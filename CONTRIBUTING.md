# 📋 Guía de Contribución y Estándares de Ingeniería — Arecofix

Bienvenido a la guía de desarrollo y contribución para la plataforma Arecofix. Todos los desarrolladores y agentes de IA deben adherirse estrictamente a estas directrices antes de fusionar o desplegar cambios.

---

## 🔒 1. REGLA DE ORO DE SEGURIDAD Y MIGRACIONES RLS

> [!CAUTION]
> **Toda migración de RLS que dependa de headers del cliente debe tener un test E2E en staging que valide el flujo legítimo (checkout, carrito, login) antes de aplicarse en producción. Sin ese test, no se aplica.**

### Procedimiento Obligatorio para Políticas RLS
1. **Validación de Interceptores y Contrato:**  
   Si una política en Supabase/PostgreSQL utiliza `current_setting('request.headers', true)` (por ejemplo `x-guest-session` o cabeceras de tenant), el interceptor HTTP de Angular (`HttpClient`) y el `customFetch` de `@supabase/supabase-js` deben estar implementados, desplegados y testeados previamente.
2. **Matriz de Operaciones:**  
   Toda tabla con RLS debe verificar explícitamente las 4 operaciones (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) para los roles `anon` y `authenticated`.
3. **Tests de No-Fuga Transaccionales:**  
   Se debe adjuntar en la PR la evidencia de ejecución SQL transaccional (`SET ROLE anon; ... ROLLBACK;`) que demuestre que usuarios no autorizados no pueden leer ni mutar filas ajenas.
4. **Verificación de Performance:**  
   Toda función SQL invocada en políticas RLS debe ser declarada como `STABLE` (no `VOLATILE`) y contar con índices en las columnas filtradas (ej. `session_id`, `tenant_id`, `user_id`).

---

## 🌐 2. REGLA OBLIGATORIA DE CORS Y HEADERS CUSTOM EN SUPABASE/KONG

> [!CAUTION]
> **Cualquier header custom que el cliente envíe a Supabase debe estar en `access_control_allow_headers` de Kong ANTES del deploy. Sin ese paso, el header no llega y toda la app se rompe con CORS.**

### Checklist Obligatorio de Despliegue de Headers:
1. **(1) Configurar Kong:** Agregar el header en `/home/ubuntu/arecofix/supabase/kong.yml` bajo `plugins: - name: cors -> config: headers: [...]`.
2. **(2) Reiniciar Gateway:** Ejecutar `docker restart supabase-kong` en la VPS.
3. **(3) Verificar Preflight:** Ejecutar `curl -X OPTIONS https://db.arecofix.com.ar/rest/v1/... -H "Origin: https://arecofix.com.ar" -H "Access-Control-Request-Headers: <nuevo-header>" -i` y verificar `HTTP 200` con el header presente en `access-control-allow-headers`.
4. **(4) Deploy Cliente:** Desplegar el código frontend con el interceptor / `customFetch`.
5. **(5) Verificar en Staging:** Validar que los navegadores no bloqueen peticiones preflight en consola ni pestañas de red.
6. **(6) Deploy a Producción:** Aplicar en producción y correr `node scripts/verify-cors-preflight.mjs`.

---

## 🏗️ 3. ESTÁNDARES DE DESARROLLO

- **Tipado Estricto:** Prohibido el uso de `any`. Se deben definir interfaces y tipos explícitos para entidades, DTOs y respuestas de API.
- **Sanitización Defensiva de UUIDs:** Todo parámetro de ruta, ID de almacenamiento local o clave foránea debe validarse con `assertUuid()` antes de pasarse a consultas de Supabase o Express.
- **Independencia de Enrutamiento:** Toda nueva ruta de API implementada en Node.js Express debe añadirse al prefijo canónico `/api/*` en el puerto 4000.
- **Protección de Datos Privados:** Los DTOs públicos de respuesta (como `POST /api/public/leads`) nunca deben filtrar metadatos de auditoría o rate-limiting interno (`ip_hash`, `user_agent`).
- **Pruebas Automatizadas:** Todo commit a `main` debe superar la suite completa de unit tests (`pnpm test`) y pruebas E2E correspondientes.

---

## 🚀 4. STAGING OBLIGATORIO Y CICLO DE PROMOCIÓN

> [!IMPORTANT]
> **Prohibido desplegar cambios directamente a producción sin validación previa en el entorno de Staging (`staging.arecofix.com.ar` / puerto 4001).**

1. **Deploy a Staging:** Ejecutar `pnpm run deploy:staging` para compilar y desplegar en la instancia aislada de staging.
2. **Suite de Verificación en Staging:**
   - Preflight CORS: `node scripts/verify-cors-preflight.mjs`
   - D1 Failover Health: `node scripts/dashboard-healthcheck.mjs`
   - Tests E2E de Header Scoping: `pnpm run test:e2e` (o Cypress contra staging)
3. **Puerta de Aprobación Manual:** La promoción a producción se realiza únicamente tras verificación exitosa en Staging, mediada por aprobación en GitHub Environments.
4. **Procedimiento de Rollback:** En caso de regresión en producción, ejecutar `pnpm run deploy:rollback` para restaurar la versión anterior en segundos.

---

## 🛡️ 5. VALIDACIÓN DE CLOUDFLARE TURNSTILE SERVER-SIDE

> [!WARNING]
> **Ningún formulario público que acepte submissions de usuarios (ej. leads, contacto, presupuestos) puede insertar directamente en la base de datos sin validar previamente el token Turnstile en el backend Node.js.**

1. **Validación Obligatoria:** La cabecera o payload debe incluir `cf-turnstile-response` o `turnstile_token`.
2. **Validación contra Cloudflare:** Se debe realizar `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` con el secreto (`TURNSTILE_SECRET_KEY`) y la IP remota del cliente.
3. **Manejo de Errores Estandarizado:**
   - Sin token -> `400 Bad Request`: `{"success":false,"error":"Turnstile token required"}`
   - Token inválido -> `400 Bad Request`: `{"success":false,"error":"Turnstile validation failed"}`
4. **Claves de Prueba Oficiales:**
   - Secret Dummy: `1x0000000000000000000000000000000AA` (pasa siempre para CI y pruebas)
   - Token Fallo: `INVALID_TOKEN` o `TEST_FAIL_TOKEN`

---

## 🛑 6. PREVENCIÓN DE SCHEMA DRIFT Y CONSULTAS A POSTGREST

> [!CAUTION]
> **Ningún deploy de frontend se aprueba si el esquema de la base de datos de producción no tiene las columnas y tablas requeridas. El pipeline verifica esto automáticamente mediante `node scripts/verify-schema.mjs`.**

1. **Prohibición de `select('*')` en Repositorios:**
   Todas las consultas a Supabase/PostgREST deben especificar de forma explícita las columnas requeridas (ejemplo: `select(ORDER_SELECT_COLUMNS)`). Esto reduce la sobrecarga de egress de red y garantiza que las inconsistencias de esquema se detecten de inmediato.
2. **Migraciones Previas Obligatorias:**
   Si una entidad, mapper o DTO en TypeScript añade una propiedad que se envía o recibe de la base de datos, se debe crear la migración SQL correspondiente en `supabase/migrations/` y aplicarla antes o sincrónicamente con el despliegue.
3. **Recarga Obligatoria de Caché de PostgREST:**
   Tras ejecutar cualquier cambio DDL (`ALTER TABLE`), se debe enviar `NOTIFY pgrst, 'reload schema'` o reiniciar `supabase-rest` para refrescar el diccionario de esquema de PostgREST.

---

## ⚖️ 7. REGLAS DE EVIDENCIA EMPÍRICA Y QA

> [!CAUTION]
> **Queda estrictamente prohibido simular o inventar outputs de terminal, navegador o pruebas de QA. La integridad técnica y la honestidad de los reportes es innegociable.**

1. **Evidencia Literal Obligatoria:**
   - Prohibido simular o inventar outputs de terminal, logs o respuestas HTTP. Toda evidencia reportada debe ser el output literal capturado durante la ejecución de los comandos.
   - Toda prueba de "navegador real" o interacción UI debe ir acompañada de una captura de pantalla con timestamp o un archivo de video (`.webp` / `.mp4`).

2. **Datos de Prueba Realistas del Dominio:**
   - Los datos utilizados en pruebas manuales o automatizadas (E2E, Postman, Curl) deben ser identificadores genéricos trazables (ej. `TEST-PRODUCT-001`, `TEST-CART-001`) o corresponder al dominio real del negocio (celulares, repuestos, pantallas OLED, baterías, módulos, servicios técnicos).
   - Queda estrictamente prohibido inventar productos o entidades fuera de contexto (ej. "Bicicletas" en una tienda de reparación de celulares y tecnología).

3. **Cypress como Única Fuente de Verdad para UI:**
   - Las pruebas automatizadas de Cypress (`cypress/e2e/**`) son la única fuente de verdad para validar el comportamiento funcional de la interfaz gráfica y los flujos de usuario.
   - Si un test manual no cuenta con un equivalente automatizado en código o evidencia verificable en staging/producción, no cuenta como aprobado ni cerrado.



