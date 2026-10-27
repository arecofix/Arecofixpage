# 🏛️ Architectural Decision Record (ADR): Deprecación y Desacoplamiento de Flask en VPS

**Fecha:** 2026-10-19  
**Estado:** ✅ APROBADO (Para ejecución en Bloque 2)  
**Contexto:** Incidente P0 del 2026-10-18 y Diagnóstico de Enrutamiento Nginx  
**Responsables:** SRE Senior, DevOps Lead, Security Auditor  

---

## 1. Contexto del Problema

Durante el análisis del incidente P0 de enrutamiento y timeouts en producción, se constató que la configuración de Nginx en `/etc/nginx/sites-available/arecofix_frontend` contenía una regla de fallback:

```nginx
# Legacy Flask Python backend (POS, Fiscal ARCA)
location /api/ {
    proxy_pass http://127.0.0.1:5000;
    ...
}
```

Esta directiva capturaba cualquier ruta `/api/*` que no coincidiera explícitamente con el regex:
`location ~ ^/api/(admin|public|mercadopago|academy|webhooks)/`

Cualquier nuevo endpoint implementado en Node.js Express (por ejemplo, métricas de dashboard, reportes, leads o analytics) caía de forma silenciosa e inadvertida en el servidor Flask (puerto 5000), el cual respondía con errores 404 HTML o bloqueos en la conexión, produciendo falsos positivos de indisponibilidad y timeouts (504).

---

## 2. Evidencia Forense de Producción

### 2.1. Estado del Proceso Flask en la VPS
```bash
ps aux | grep -iE "flask|python" | grep -v grep; sudo ss -tlnp | grep :5000
```
**Output obtenido:**
```text
ubuntu   3729218  0.0  0.4 938144 98284 ?        Ssl  Sep15  15:55 ./venv/bin/python /home/ubuntu/arecofix/Back-End/app.py
LISTEN   0        128  0.0.0.0:5000             0.0.0.0:*        users:(("python",pid=3729218,fd=8))
```
*Flask se encuentra en ejecución bajo PID 3729218 escuchando en el puerto local 5000.*

### 2.2. Tráfico Histórico hacia el Puerto 5000
```bash
sudo grep ":5000" /var/log/nginx/access.log 2>/dev/null | tail -20
sudo zgrep -E "proxy_pass.*5000|:5000" /var/log/nginx/access.log* /var/log/nginx/error.log* 2>/dev/null | tail -20
```
**Output obtenido:**
- **Últimos 45 días en `access.log` y `error.log`:** Cero peticiones legítimas dirigidas a Flask.
- **Únicos registros existentes:** Intentos de escaneo de vulnerabilidades automatizados (`GET /admin/config.php`, `GET /SDK/webLanguage`) registrados el `2026/09/01`.
- **Tráfico productivo de e-commerce y administración:** 100% procesado por Node.js Express (puerto 4000) y Supabase/Kong (puerto 8000/3000).

### 2.3. Rol del Backend Flask en la Arquitectura
El backend Flask (`Back-End/app.py`) fue diseñado originalmente para:
1. Soporte offline en la aplicación Desktop Tauri (SQLite local y sincronización).
2. Módulos heredados de facturación fiscal ARCA / POS local.
En el entorno local de escritorio (Tauri), la app inicia su propio proceso Flask en `localhost`. Su presencia en la VPS como receptor de `/api/` en la web pública es un rezago de arquitectura que constituye un riesgo de seguridad y un "footgun" de enrutamiento continuo.

---

## 3. Decisión Adoptada

1. **Eliminar el bloque `location /api/` hacia Flask en `arecofix_frontend`:**  
   Todo el prefijo `/api/` pertenecerá exclusivamente a Node.js Express en el puerto 4000:
   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:4000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_connect_timeout 60s;
       proxy_read_timeout 120s;
       proxy_send_timeout 120s;
   }
   ```
2. **Aislamiento de Flask (Legacy / Desktop Sync):**  
   Si en el futuro se requiere exponer endpoints específicos de Flask en la VPS para sincronización externa de clientes de escritorio, se utilizará:
   - El subdominio virtual dedicado ya existente `api.arecofix.com.ar` configurado en `/etc/nginx/sites-available/arecofix_api`.
   - O bien un prefijo explícito y no colisionante como `/legacy-sync/` o `/flask/`.
3. **Plan de Ejecución:**  
   Esta modificación se ejecutará de forma planificada durante el **Bloque 2**, con validación de sintaxis (`nginx -t`) y recarga atómica (`nginx -s reload`).

---

## 4. Consecuencias y Beneficios

- ✅ **Eliminación del Footgun:** Cualquier nueva ruta agregada a Node.js (`/api/analytics`, `/api/leads`, `/api/reports`) funcionará de inmediato sin requerir modificaciones manuales del regex en Nginx.
- ✅ **Reducción de Superficie de Ataque:** Evita que peticiones no coincidentes alcancen un proceso Python que no requiere exposición pública en la web principal.
- ✅ **Consistencia Operativa:** Unifica el backend web en Node.js Express 4000 para todo `arecofix.com.ar`.
