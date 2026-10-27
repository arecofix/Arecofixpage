# 🧪 Infraestructura y Operaciones de Staging — Arecofix

## 1. Visión General y Arquitectura

Para prevenir incidentes de seguridad y estabilidad en producción, el entorno de **Staging** replica integralmente el stack de microservicios e infraestructura:

```
[ Cliente / CI / Testing ]
         │
         ▼
[ Nginx Reverse Proxy (Port 80) ] ──> Host: staging.arecofix.com.ar
         │
         ├──> PM2: arecofix-frontend-staging (Port 4001, PID auto)
         │           │
         │           ▼
         └──> Supabase Staging Stack (Docker Compose namespace: supabase-staging):
                 ├── Kong Staging: 8002 (HTTP) / 8444 (HTTPS) / 8003 (Admin)
                 ├── PostgREST Staging: 3001 -> 3000
                 ├── Auth Gotrue Staging: 9998 -> 9999
                 └── PostgreSQL Staging: 5433 -> 5432 (Volumen: pgdata_staging)
```

---

## 2. Mapa de Puertos y Servicios

| Componente | Producción | Staging | Contenedor / Proceso Staging |
|---|---|---|---|
| **Frontend SSR (Node.js/PM2)** | 4000 | **4001** | `arecofix-frontend-staging` |
| **Kong Gateway** | 8000 / 8443 | **8002 / 8444** | `supabase-staging-kong` |
| **PostgREST** | 3000 | **3001** | `supabase-staging-rest` |
| **Auth (GoTrue)** | 9999 | **9998** | `supabase-staging-auth` |
| **PostgreSQL Database** | 5432 | **5433** | `supabase-staging-db` |

---

## 3. Despliegue en Staging en 1 Comando

Para desplegar a staging desde local o CI:

```bash
pnpm run deploy:staging
```

O para desplegar omitiendo el build (usando artefacto pre-compilado):
```bash
pnpm run deploy:staging --skip-build
```

### Qué ejecuta automáticamente:
1. Valida conectividad SSH y certificados.
2. Compila el bundle de Angular SSR (`ng build --configuration production`).
3. Comprime el artefacto `dist-staging.tar.gz`.
4. Transfiere vía SCP el bundle, `ecosystem.staging.config.cjs` y `server-init.staging.mjs`.
5. Descomprime en `/home/ubuntu/arecofix-staging/dist/`.
6. Recarga atómicamente el proceso PM2 `arecofix-frontend-staging` con `--update-env`.
7. Ejecuta healthcheck con reintentos hasta confirmar respuesta `200 OK`.

---

## 4. Sincronización y Sanitización de Datos desde Producción

Los datos de staging se clonan de producción aplicando enmascaramiento estricto de PII:

```bash
# 1. En la VPS, generar dump de solo lectura de prod:
docker exec -i supabase-db pg_dump -U postgres -d postgres --schema=public --no-owner --no-privileges > /tmp/prod_dump.sql
docker exec -i supabase-db pg_dump -U postgres -d postgres --schema=auth --no-owner --no-privileges > /tmp/prod_auth.sql

# 2. Restaurar en base de staging:
docker exec -i supabase-staging-db psql -U postgres -d postgres < /tmp/prod_auth.sql
docker exec -i supabase-staging-db psql -U postgres -d postgres < /tmp/prod_dump.sql

# 3. Sanitizar PII inmediatamente:
docker exec -i supabase-staging-db psql -U postgres -d postgres -c "
  UPDATE public.service_leads SET name = 'Lead ' || id, email = 'lead_' || id || '@sanitized.test', phone = '+5491100000000';
  UPDATE public.profiles SET phone = '+5491100000000' WHERE email NOT LIKE '%arecofix%';
  UPDATE public.contact_messages SET name = 'Contact ' || id, email = 'contact_' || id || '@sanitized.test', phone = '+5491100000000';
"

# 4. Eliminar volcados temporales:
rm -f /tmp/prod_dump.sql /tmp/prod_auth.sql
```

---

## 5. Verificación de Salud en Staging

```bash
# 1. Kong Staging REST:
curl -sI http://localhost:8002/rest/v1/

# 2. SSR Frontend Staging directo:
curl -sI -H "Host: staging.arecofix.com.ar" http://localhost:4001/

# 3. Nginx Reverse Proxy Staging:
curl -sI http://staging.arecofix.com.ar/
```
