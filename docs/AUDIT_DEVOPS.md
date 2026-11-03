# 🚀 AUDITORÍA FORENSE: DEVOPS, SRE, NGINX, PM2 Y DESPLIEGUES

**Fecha de ejecución:** 2026-10-18T22:36:00-03:00  
**Equipo auditor:** DevOps / Site Reliability Engineer (SRE) Senior  
**Infraestructura auditada:** Oracle Cloud VPS (Ubuntu), Cloudflare CDN, Nginx Reverse Proxy, PM2 Runtime, Supabase Docker.

---

## 1. RESUMEN DE ESTADO DE INFRAESTRUCTURA Y SRE

| Componente | Estado Documentado | Estado Real | Severidad | Veredicto |
|---|---|---|---|---|
| **Healthcheck Público** | `pnpm run healthcheck` | ✅ 200 OK (702ms) | Info | **OPERATIVO** |
| **PM2 Runtime** | PM2 (Cluster) | ⚠️ PM2 (Fork Mode, 1 instancia) | **P2** | **DISCREPANCIA DE MODO** |
| **Estabilidad PM2** | Estable | ⚠️ 61,186 reinicios acumulados | **P2** | **HISTORIAL DE CRASHES** |
| **Rotación de Logs** | `pm2-logrotate` configurado | ❌ No instalado / No configurado | **P2** | **RIESGO DE DISCO LLENO** |
| **Nginx Reverse Proxy** | Proxy inverso unificado | ❌ **Shadowing de rutas `/api/` hacia Flask** | **P0** | **BLOQUEO ARQUITECTÓNICO** |
| **Rollback de Emergencia** | `pnpm run deploy:rollback` | ✅ Script funcional y `dist_backup` presente | Info | **CONFORME** |
| **Backups Automatizados** | Backups diarios con retención | ⚠️ Solo tablas manuales en `public`, sin `pg_dump` externo | **P1** | **RIESGO DE PÉRDIDA DE DATOS** |
| **Scripts en `package.json`** | deploy, rollback, pm2:* | ✅ Todos presentes excepto `lint` | Info | **CASI TOTAL** |

---

## 2. ANÁLISIS DE LA CAUSA RAÍZ EN NGINX (HALLAZGO P0)

Al auditar la configuración de Nginx en la VPS (`/etc/nginx/sites-available/arecofix_frontend`), se descubrió la causa de por qué múltiples endpoints de Node.js fallan:

### Configuración Actual en Nginx:
```nginx
# Todas las peticiones con prefijo /api/ se envían directamente a Flask (Python)
location /api/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# El resto del tráfico se envía a Angular SSR (Node.js)
location / {
    proxy_pass http://127.0.0.1:4000;
}
```

### Conflicto de Enrutamiento:
1. Las nuevas rutas de Node/Express creadas para el Dashboard (`/api/admin/dashboard/metrics`) y Leads de Servicios (`/api/public/leads`) comparten el prefijo `/api/`.
2. Nginx intercepta estas llamadas antes de que lleguen a Express (puerto 4000) y las reenvía a Flask (puerto 5000).
3. Flask no reconoce esas rutas y responde con un error `404 Not Found` en formato HTML.
4. El frontend en Angular captura el error y silencia las métricas a cero.

### Solución en Nginx:
Separar los endpoints o delegar selectivamente:
```nginx
# Endpoints específicos del backend Node.js
location ~ ^/api/(admin|public|services)/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Endpoints tradicionales de Flask / Facturación / POS
location /api/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 3. AUDITORÍA DE PM2 Y PROCESOS

Ejecución de `pm2 list` en la VPS:
```
┌────┬──────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                 │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼──────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 2  │ arecofix-backend     │ default     │ 0.0.0   │ fork    │ 3729218  │ 34D    │ 5    │ online    │ 0%       │ 96.0mb   │ ubuntu   │ disabled │
│ 1  │ arecofix-frontend    │ default     │ 0.0.0   │ fork    │ 3127639  │ 6h     │ 611… │ online    │ 0%       │ 475.5mb  │ ubuntu   │ disabled │
└────┴──────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

- **Modo:** Ambos procesos corren en modo `fork`. El `ecosystem.config.cjs` tiene configurado `instances: 1` y `exec_mode: 'fork'`. La documentación que indica "PM2 (cluster)" es inexacta.
- **Memoria:** `arecofix-frontend` consume **475.5 MB** de RAM (límite de reinicio en `600M`).
- **Módulo `pm2-logrotate`:** No está instalado en el daemon global de PM2. Los archivos de log (`/home/ubuntu/.pm2/logs/arecofix-frontend-out.log`) crecen sin rotación automática diaria, representando un riesgo de saturación del disco a largo plazo.

---

## 4. AUDITORÍA DE BACKUPS Y RECUPERABILIDAD

1. **Backups en Base de Datos:**
   - Existen las tablas `public.services_backup_20261018` y `public.blog_posts_backup_20261018`.
   - **Riesgo:** Están dentro del mismo cluster PostgreSQL y esquema `public`. Si la base de datos se corrompe o la instancia se destruye, los backups se pierden junto con los datos primarios.
2. **Backups a Nivel Sistema Operativo:**
   - La tabla `crontab -l` en la VPS no tiene tareas programadas de `pg_dump`.
   - **Recomendación (P1):** Configurar un script cron nocturno con `pg_dump` comprimido y sincronizado hacia un bucket externo (e.g. Cloudflare R2 o AWS S3) con 30 días de retención.

---

## 5. AUDITORÍA DE SCRIPTS DE DESPLIEGUE (`package.json`)

Se validaron los scripts del pipeline:
- `pnpm run deploy`: Ejecuta `scripts/deploy.mjs` (compila, comprime, transfiere por SCP, reinicia PM2 y ejecuta healthcheck).
- `pnpm run deploy:quick`: Salta la compilación local para actualizar solo assets estáticos o configuraciones.
- `pnpm run deploy:rollback`: Restaura de forma instantánea el directorio `dist_backup` preservado en la VPS.
- `pnpm run healthcheck`: Verifica respuesta HTTP y métricas de PM2 vía SSH.
- `pnpm run lint`: **FALTA EN `package.json`** (provoca error al intentar auditar con linter).
