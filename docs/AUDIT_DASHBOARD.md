# Auditoría Forense: Dashboard Integral de Negocio (`/admin/dashboard`)

**Fecha:** 18 de Octubre de 2026  
**Problemas Investigados:**  
1. *Métricas en 0 y mensajes de "sin registros" en producción.*  
2. *Ausencia de enlaces a pgAdmin y PostHog.*  
3. *Falta de métricas analíticas avanzadas (Top productos, RFM, reparaciones).*  
**Veredicto:** ❌ **Fallo de Enrutamiento en Reverse Proxy Nginx (Colisión Puerto 5000 Flask vs Puerto 4000 Node)**.

---

## 1. Evidencia en la Base de Datos PostgreSQL: Los Datos Sí Existen

Se ejecutó la función RPC de agregación directamente en la base de datos con el `tenant_id` real de Arecofix (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`):
```sql
SELECT get_admin_business_dashboard_metrics('bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid, 'month', NULL, NULL, NULL);
```

**Resultado Extraído de PostgreSQL:**
- **Ingresos del Mes (`total_income`):** `$ 144.500,00`
- **Reparaciones Activas en Taller (`active_repairs_count`):** `17` equipos
- **Reparaciones Demoradas (> 48hs) (`delayed_repairs_count`):** `13` equipos (Alerta activa)
- **Alumnos con Suscripción Activa (`active_subscriptions_count`):** `7`
- **Artículos en Stock Crítico (`critical_stock_count`):** `2.589` productos
- **Tendencia Histórica (6 Meses):**
  - Mayo: `$ 1.081`
  - Junio: `$ 99.668`
  - Julio: `$ 280.521`
  - Agosto: `$ 329.000`
  - Septiembre: `$ 104.600`
  - Octubre: `$ 144.500`

*Conclusión DB:* La base de datos tiene datos consistentes y la función RPC `get_admin_business_dashboard_metrics` funciona perfectamente.

---

## 2. Los Enlaces a pgAdmin y PostHog: Ya Están en el Código Fuente

Inspección de `src/app/admin/dashboard/admin-dashboard-page.html`:
- **Líneas 30–38:** Botón verde `id="btn-open-supabase-studio"` con enlace a `https://studio.arecofix.com.ar` ("Studio / pgAdmin").
- **Líneas 40–49:** Botón morado `id="btn-open-posthog"` con enlace a `https://us.posthog.com` ("PostHog").
- **Líneas 1109–1120:** Botones redundantes en el pie de página de la pestaña Salud de Base de Datos.

*Conclusión UI:* Los enlaces **no faltan en el código**. Sin embargo, en producción el usuario no los ve o los ve deshabilitados si la pestaña de salud falla al cargar.

---

## 3. Causa Raíz de las Métricas en Cero: Colisión Arquitectónica Nginx

### 3.1. Prueba Directa de Puertos en la VPS
Se consultó el endpoint desde la terminal interna del servidor VPS:

```bash
# 1. Petición a Flask (Puerto 5000):
$ curl -s http://127.0.0.1:5000/api/admin/dashboard/metrics
<!doctype html><title>404 Not Found</title><h1>Not Found</h1>

# 2. Petición a Node Express (Puerto 4000):
$ curl -s http://127.0.0.1:4000/api/admin/dashboard/metrics
{"success":false,"error":"Token de autorización ausente. Se requiere inicio de sesión administrativo."}
```

### 3.2. Configuración Nginx en `/etc/nginx/sites-available/arecofix_frontend`
```nginx
    location /api/ {
        proxy_pass http://127.0.0.1:5000; # <--- PROXIEA TODO /api/ A FLASK (PUERTO 5000)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:4000; # <--- NODE EXPRESS SSR
        ...
    }
```

### 3.3. Cadena de Falla (5 Whys)
1. **¿Por qué el dashboard muestra 0?**  
   Porque `AdminBusinessDashboardService` recibe un error de red y ejecuta su `catchError`, devolviendo `getDefaultEmptyMetrics()`.
2. **¿Por qué hay error de red?**  
   Porque la llamada `GET /api/admin/dashboard/metrics` devuelve un código HTTP 404 HTML en lugar de JSON.
3. **¿Por qué devuelve 404?**  
   Porque el servidor Flask de Python (puerto 5000) responde a la petición y no tiene registrada la ruta `/api/admin/dashboard/metrics`.
4. **¿Por qué responde Flask si el endpoint fue programado en Node.js?**  
   Porque Nginx tiene la regla `location /api/ { proxy_pass http://127.0.0.1:5000; }`, capturando **todas** las peticiones `/api/*` antes de que puedan llegar a Node (puerto 4000).
5. **¿Por qué ocurre la colisión?**  
   Porque no existe una directiva específica en Nginx para discriminar los endpoints que pertenecen a Node (`/api/admin/dashboard`, `/api/admin/services`, `/api/public/leads`) de los endpoints legados de Flask.

---

## 4. Solución Arquitectónica Recomendada (Para la Fase de Fixes)

En `/etc/nginx/sites-available/arecofix_frontend`:
Agregar las directivas de proxy hacia el puerto 4000 antes del bloque genérico `/api/`:
```nginx
    # Endpoints del Backend Node.js / Express SSR (Puerto 4000)
    location ~ ^/api/(admin|public|academy|mercadopago|webhooks)/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Resto de APIs legadas hacia Flask (Puerto 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        ...
    }
```
Con este ajuste, las peticiones a `/api/admin/dashboard/metrics`, `/analytics` y `/db-health` llegarán al runtime de Node en el puerto 4000, consultarán la función RPC con el `tenant_id` autenticado y el Dashboard exhibirá instantáneamente los `$ 144.500`, los 17 equipos en taller y las alertas críticas reales.
