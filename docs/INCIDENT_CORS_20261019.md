# 🚨 POST-MORTEM INCIDENTE P0: BLOQUEO CORS POR CABECERA `x-guest-session` EN SUPABASE KONG GATEWAY

**Fecha del Incidente:** 2026-10-19T02:45:00Z - 2026-10-19T03:05:00Z  
**Severidad:** P0 (Incidente Crítico de Disponibilidad de Catálogo y Carrito)  
**Roles involucrados:** SRE Senior, DBA Supabase/PostgreSQL, DevOps Engineer, Lead Angular SSR  
**Estado:** 🟢 RESUELTO (PRODUCCIÓN OPERATIVA Y VERIFICADA)  

---

## 1. TIMELINE DE EVENTOS

- **02:30 UTC:** Despliegue en producción de la mitigación de RLS para carritos anónimos con inyección de cabecera `x-guest-session`.
- **02:45 UTC:** Reporte de fallo generalizado en frontend:
  - Error en consola del navegador: `Access to fetch at 'https://db.arecofix.com.ar/rest/v1/orders' from origin 'https://arecofix.com.ar' has been blocked by CORS policy: Request header field x-guest-session is not allowed by Access-Control-Allow-Headers in preflight response.`
  - Errores en cascada: Preflight OPTIONS fallido provocó loop de reintentos en `SupabaseService`.
  - Failover a Cloudflare D1 Worker (`arecofix-d1-failover.ezequielenrico15.workers.dev`) arrojó `500 {"error":"D1_ERROR: no such table: orders: SQLITE_ERROR"}`.
  - CartService arrojó `Formato de datos no válido para la base de datos`.
- **02:54 UTC:** Inicio de FASE 0 (Diagnóstico Forense):
  - Ejecución de `curl -X OPTIONS https://db.arecofix.com.ar/rest/v1/orders -H "Origin: https://arecofix.com.ar" -H "Access-Control-Request-Headers: x-guest-session" -i`.
  - Confirmación: `access-control-allow-headers` devolvía la lista oficial sin `x-guest-session`.
  - Detección de configuración de Kong en `/home/ubuntu/arecofix/supabase/kong.yml`.
  - Detección de que el interceptor inyectaba `x-guest-session` indiscriminadamente en todos los endpoints de PostgREST (`categories`, `products`, `orders`).
- **02:55 UTC:** Inicio de FASE 1 (Remediación Inmediata de Infraestructura - Opción A):
  - Backup preventivo: `cp /home/ubuntu/arecofix/supabase/kong.yml /home/ubuntu/arecofix/supabase/kong.yml.bak.20261019`.
  - Inserción de `- x-guest-session` en la lista de headers permitidos del plugin CORS en `kong.yml` (para `postgrest`, `auth` y `realtime`).
  - Reinicio atómico del gateway: `docker restart supabase-kong`.
- **02:56 UTC:** Verificación exitosa de preflight:
  - `curl -X OPTIONS` respondió `HTTP/1.1 200 OK` con `access-control-allow-headers: ...,x-guest-session`.
  - Peticiones GET a `/categories` y `/orders` con origen `https://arecofix.com.ar` y cabecera `x-guest-session` devolvieron `HTTP/2 200 OK`.
- **02:58 UTC:** Inicio de FASE 3 (Cierre de Causa Raíz Estructural en Código):
  - En `SupabaseService.ts`: Restricción estricta de `x-guest-session` solo para `/rest/v1/orders` y `/rest/v1/order_items`.
  - En `SupabaseService.ts`: Aislamiento del failover D1 para evitar llamadas espurias con endpoints transaccionales (`/orders`, `/order_items`, `/service_leads`).
  - En `guest-session.interceptor.ts`: Scopeado exclusivo a órdenes y Express `/api/`.
- **03:03 UTC:** Implementación de tests de regresión:
  - Unit tests en `guest-session.interceptor.spec.ts` (4/4 passed).
  - Test E2E de Cypress en `cypress/e2e/cart/cors-preflight-guest-session.cy.ts`.
  - Script automatizado de healthcheck CI en `scripts/verify-cors-preflight.mjs`.
- **03:05 UTC:** Cierre formal del incidente y normalización de producción.

---

## 2. CAUSA RAÍZ Y FACTORES CONTRIBUYENTES

1. **Desalineación Servidor/Cliente (Causa Primaria):**  
   El cliente Angular y el SDK de Supabase fueron instruidos para inyectar la cabecera `x-guest-session` en las peticiones HTTP hacia PostgREST. Sin embargo, el API Gateway Kong opera con una lista blanca estricta (`access_control_allow_headers`). Al recibir una cabecera no autorizada en el preflight `OPTIONS`, el navegador bloqueó la petición por violación de política CORS.
2. **Inyección Global Indiscriminada:**  
   El interceptor inicial adjuntaba `x-guest-session` a **todas** las peticiones a Supabase (incluyendo lecturas públicas del catálogo como `/categories` y `/products`), expandiendo el impacto del bloqueo CORS a toda la aplicación en lugar de confinarlo al carrito.
3. **Failover Incompleto en D1 Worker:**  
   Al fallar Supabase por CORS, el mecanismo de resiliencia intentó consultar Cloudflare D1. La base de datos D1 no cuenta con la tabla `orders` (diseñada únicamente como réplica de catálogo estático), provocando un error 500 (`no such table: orders: SQLITE_ERROR`) que rompió el parsing de la respuesta en `CartService`.

---

## 3. IMPACTO

- **Servicios afectados:** Catálogo de productos, categorías y flujo de carrito/pedidos en la versión web cliente.
- **Duración:** ~20 minutos.
- **Afectación de datos:** Cero pérdida de datos (PostgreSQL intacto, RLS no vulnerada).
- **Tráfico:** Los usuarios experimentaron degradación temporal en la carga de categorías y error de preflight al interactuar con el carrito.

---

## 4. REMEDIACIÓN APLICADA

### 4.1. Configuración de Kong Gateway (Producción)
En `/home/ubuntu/arecofix/supabase/kong.yml`:
```yaml
  plugins:
  - name: cors
    config:
      origins:
      - '*'
      headers:
      - Accept
      - Content-Type
      - Authorization
      - apikey
      ...
      - x-supabase-api-version
      - x-guest-session # <-- AGREGADO
```
Reinicio del contenedor: `docker restart supabase-kong`.

### 4.2. Scopeo Estructural en Angular Client
En `src/app/core/services/supabase.service.ts`:
```typescript
const needsGuestSession = urlStr.includes('/rest/v1/orders') || urlStr.includes('/rest/v1/order_items');
if (typeof window !== 'undefined' && needsGuestSession && !headers.has('x-guest-session')) {
  const guestSession = getOrCreateGuestSessionId();
  if (guestSession) {
    headers.set('x-guest-session', guestSession);
  }
}
```

En `src/app/core/interceptors/guest-session.interceptor.ts`:
```typescript
const isOrders = req.url.includes('/rest/v1/orders') || req.url.includes('/rest/v1/order_items');
const isExpressApi = req.url.includes('/api/');
if ((isOrders || isExpressApi) && !req.headers.has('x-guest-session')) {
  const cloned = req.clone({ setHeaders: { 'x-guest-session': sessionId } });
  return next(cloned);
}
```

### 4.3. Protección de Failover D1
Se excluyó a `/orders`, `/order_items` y `/service_leads` de los intentos de failover hacia Cloudflare D1:
```typescript
const isTransactional = requestUrl.includes('/orders') || requestUrl.includes('/order_items') || requestUrl.includes('/service_leads');
if (!isTransactional) {
  // Attempt D1 Failover only for public catalog
}
```

---

## 5. LECCIONES APRENDIDAS Y ACCIONES PREVENTIVAS

1. **Protocolo Estricto de Headers:** Cualquier cabecera custom que un cliente web deba enviar a través de un gateway o proxy inverso debe habilitarse **primero en la infraestructura de CORS**, validarse con peticiones `OPTIONS`, y solo después desplegarse en el cliente.
2. **Separación de Tráfico Transaccional vs. Catálogo:** Los mecanismos de failover a edge workers (D1) deben estar estrictamente restringidos a datos de solo lectura desacoplados de transacciones de usuarios o RLS.
3. **Healthcheck Automatizado de CORS en CI/CD:** Se incorporó `scripts/verify-cors-preflight.mjs` para ejecutarse automáticamente en pipelines y tras cada reinicio de Kong.
