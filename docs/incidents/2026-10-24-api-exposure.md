# Reporte de Incidente de Seguridad: Exposición Pública de API Backend (Flask / api.arecofix.com.ar)

**ID Incidente**: `INC-20261024-API-EXPOSURE`  
**Fecha de Detección**: 2026-10-24 22:55 UTC (19:55 ART)  
**Fecha de Mitigación**: 2026-10-24 23:51 UTC (20:51 ART)  
**Severidad**: **P0 (Crítica)**  
**Estado**: **RESOLUCIÓN COMPLETADA**  
- **Rotación JWT en Producción**: 2026-10-25 02:23 UTC  
- **Rotación SERVICE_ROLE_KEY**: 2026-10-25 02:23 UTC  
- **Rebuild y Deploy Frontend Prod con nueva ANON_KEY**: 2026-10-25 02:29 UTC  
- **Actualización de Workflows n8n**: 2026-10-25 02:25 UTC  
- **Revocación WhatsApp token EAARLw... en Meta**: 2026-10-25 02:15 UTC  
- **Rotación de WHATSAPP_VERIFY_TOKEN y eliminación de fallback**: 2026-10-25 02:22 UTC  
- **Verificación de Invalidez de Claves Viejas (HTTP 401)**: 2026-10-25 02:30 UTC  
- **Verificación de Claves Nuevas en Producción (HTTP 200)**: 2026-10-25 02:30 UTC  

---

## 1. Resumen Ejecutivo
Durante la auditoría de seguridad de fin de semana, se descubrió que el subdominio público `https://api.arecofix.com.ar` enrutaba peticiones hacia el proceso PM2 `arecofix-backend` (`Back-End/app.py`), el cual fue originalmente diseñado como backend REST offline para la aplicación de escritorio Tauri.
Debido a que sus endpoints administrativos carecían del decorador `@token_required`, las rutas de lectura y escritura `/api/orders`, `/api/clientes`, `/api/marcas`, `/api/productos` y `/api/finances` se encontraban accesibles públicamente sin autenticación previa.

La mitigación de emergencia fue aplicada en dos capas (Nginx en VPS y `before_request` en Flask), logrando un bloqueo total e inmediato (`HTTP 403 Forbidden`) sin afectar el sitio de producción ni los assets estáticos.

---

## 2. Cronología (Timeline)

- **22:55:41 UTC**: Verificación inicial de `https://arecofix.com.ar/api/marcas` devuelve `404 Not Found` (Express SSR).
- **22:55:50 UTC**: Verificación cruzada contra `https://api.arecofix.com.ar/api/marcas` devuelve **`200 OK`** con lista de marcas en formato JSON.
- **22:56:20 UTC**: Verificación contra `https://api.arecofix.com.ar/api/orders` devuelve **`200 OK`** exponiendo registros de órdenes sin autenticación.
- **22:56:26 UTC**: Verificación contra `https://api.arecofix.com.ar/api/clientes` devuelve **`200 OK`** sin autenticación.
- **23:45:05 UTC**: Inspección forense de `/home/ubuntu/.pm2/logs/arecofix-backend-error.log` detecta múltiples escaneos activos de directory traversal desde internet intentando acceder a `..%2f..%2f.env` y `..%2f..%2fproc/self/environ`.
- **23:46:20 UTC**: Modificación de `/etc/nginx/sites-available/arecofix_api` en el VPS configurando `location / { return 403; }` y `sudo systemctl reload nginx`.
- **23:49:43 UTC**: Aplicación de parche en `Back-End/app.py`:
  1. Incorporación de filtro `@app.before_request` bloqueando con `403 Forbidden` todas las rutas `/api/orders`, `/api/clientes`, `/api/marcas`, `/api/productos`, `/api/finances`, `/api/categorias`, `/api/upload`, `/api/files`.
  2. Eliminación definitiva del fallback hardcodeado del token de WhatsApp (`EAARLw...`) en `app.py:613`.
  3. Activación de fail-fast logging al startup si falta `WHATSAPP_TOKEN`.
- **23:50:48 UTC**: Reinicio limpio de `arecofix-backend` en PM2 (`pid: 3231540`).
- **23:51:07 UTC**: Verificación confirmada: `curl -si https://api.arecofix.com.ar/api/orders` devuelve **`403 Forbidden`**.
- **23:51:23 UTC**: Verificación de producción: `curl -si https://arecofix.com.ar/` devuelve **`200 OK`** y renderizado visual completo en navegador.

---

## 3. Evidencia Forense de Escaneos Detectados

En los registros históricos de `/home/ubuntu/.pm2/logs/arecofix-backend-error.log`:
```text
127.0.0.1 - - [18/Oct/2026 19:49:07] "GET /api/orders/..%2f..%2f.env HTTP/1.1" 404 -
127.0.0.1 - - [18/Oct/2026 19:49:07] "GET /api/orders/..%2f..%2fproc/self/environ HTTP/1.1" 404 -
127.0.0.1 - - [18/Oct/2026 19:49:08] "GET /api/orders/..%2fadmin/config.json HTTP/1.1" 404 -
127.0.0.1 - - [19/Oct/2026 06:12:07] "GET /api/orders/..%2f..%2f.env HTTP/1.1" 404 -
127.0.0.1 - - [19/Oct/2026 06:12:07] "GET /api/orders/..%2f..%2fproc/self/environ HTTP/1.1" 404 -
127.0.0.1 - - [23/Oct/2026 13:45:05] "GET /api/orders/..%2f..%2f.env HTTP/1.1" 404 -
```

---

## 4. Análisis de Impacto
1. **Base de Datos Productiva de E-commerce**: **NO AFECTADA**.
   - El sistema de e-commerce (carrito, checkout, reparaciones, cursos, usuarios) opera 100% sobre Supabase (`db.arecofix.com.ar` / PostgreSQL) con Row Level Security activo.
2. **Base de Datos Local SQLite en VPS**:
   - Se auditó el archivo `/home/ubuntu/arecofix/Back-End/arecofix_local.sqlite`: contenía únicamente 1 orden de prueba técnica del 29/08/2026 (`Consumidor Final`, $75.000) y 0 clientes. No hubo filtración de información sensible de clientes reales por esta vía.
3. **Superficie de Exposición**:
   - Totalmente cerrada y neutralizada.

---

## 5. Acciones Aplicadas y Evidencia de Mitigación

```bash
# 1. Petición contra endpoint de órdenes ahora bloqueado
curl -si https://api.arecofix.com.ar/api/orders | head -5
```
**Salida**:
```text
HTTP/1.1 403 Forbidden
Date: Sat, 24 Oct 2026 23:51:07 GMT
Content-Type: application/json
Content-Length: 41
Connection: keep-alive
```

```bash
# 2. Petición contra sitio principal de producción
curl -si https://arecofix.com.ar/ | head -3
```
**Salida**:
```text
HTTP/1.1 200 OK
Date: Sat, 24 Oct 2026 23:51:23 GMT
Content-Type: text/html; charset=utf-8
```

---

## 6. Próximos Pasos (Follow-ups Inmediatos)
1. **PASO 4**: Rotación de `SUPABASE_SERVICE_ROLE_KEY` y purga de `cypress.env.json` del historial de Git con `git-filter-repo`.
2. **Cloudflare Zero Trust**: Ajustar las reglas de túnel en el Dashboard de Cloudflare para que `api.arecofix.com.ar` apunte estrictamente al puerto 80 (Nginx) y no directamente al puerto 5000.
3. **Fase 2**: Implementación formal de autenticación `@token_required` mediante validación de JWTs de Supabase en todas las rutas de `Back-End/app.py`.
