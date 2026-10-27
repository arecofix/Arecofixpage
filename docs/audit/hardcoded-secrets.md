# Auditoría de Seguridad: Secretos y Credenciales Hardcodeadas

**Fecha**: 2026-10-24  
**Rama de auditoría**: `audit/2026-10`  
**Modo**: Solo Lectura (Inventario Priorizado - Gate Humano)

---

## 1. Resumen Ejecutivo de Hallazgos

| Severidad | Total | Descripción |
| :--- | :---: | :--- |
| **Crítica** | 4 | Service keys, tokens de Meta WhatsApp o credenciales R2 con acceso a infraestructura o datos |
| **Alta** | 3 | Secretos de chatbot en repositorios locales y passwords en scripts |
| **Media** | 8 | Mock JWTs con admin real, secretos de webhooks y UUIDs de tenant como fallback |
| **Baja** | 2 | Anon keys de Supabase y dummy keys públicas de Cloudflare Turnstile |

---

## 2. Inventario Detallado de Hallazgos

| # | Archivo:Línea | Severidad | Descripción del Hallazgo | Propuesta de Fix (1 línea) |
|---|---------------|-----------|--------------------------|----------------------------|
| 1 | [scripts/migrate-to-r2.js:7](file:///c:/git/Arecofixpage/scripts/migrate-to-r2.js#L7) | **Crítica** | `SUPABASE_SERVICE_KEY` (service_role con bypass total de RLS) hardcodeada en texto plano | `const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;` |
| 2 | [cypress.env.json:5](file:///c:/git/Arecofixpage/cypress.env.json#L5) | **Crítica** | `SUPABASE_SERVICE_ROLE_KEY` real versionada en archivo rastreado por Git | Añadir `cypress.env.json` a `.gitignore`, hacer `git rm --cached` y cargar la key via variable de entorno en CI. |
| 3 | [cloudflare/workers/r2-proxy/wrangler.toml:14](file:///c:/git/Arecofixpage/cloudflare/workers/r2-proxy/wrangler.toml#L14) | **Crítica** | `R2_SECRET_ACCESS_KEY` de Cloudflare R2 versionada en archivo de configuración | Eliminar la línea del `wrangler.toml` y cargar el secreto via `wrangler secret put R2_SECRET_ACCESS_KEY`. |
| 4 | [Back-End/app.py:613](file:///c:/git/Arecofixpage/Back-End/app.py#L613) | **Crítica** | Token de Meta/WhatsApp Cloud API (`EAARLw...`) hardcodeado como fallback en `app.py` | `WHATSAPP_TOKEN = os.environ.get('WHATSAPP_TOKEN')` y arrojar error explícito si no está configurado. |
| 5 | [cloudflare/workers/rag-chatbot/.dev.vars:3](file:///c:/git/Arecofixpage/cloudflare/workers/rag-chatbot/.dev.vars#L3) | **Alta** | `CHATBOT_SECRET` estático en archivo `.dev.vars` presente en el espacio de trabajo | Añadir `**/.dev.vars` a `.gitignore` y rotar el secret en Cloudflare Dashboard. |
| 6 | [Back-End/update_zaona_pw.py:8](file:///c:/git/Arecofixpage/Back-End/update_zaona_pw.py#L8) | **Alta** | Password en texto plano `"zaona2026"` en script utilitario | Reemplazar por prompt interactivo con `getpass.getpass('Nueva contraseña: ')`. |
| 7 | [Back-End/app.py:116](file:///c:/git/Arecofixpage/Back-End/app.py#L116) | **Alta** | Fallback de `CHATBOT_SECRET` hardcodeado en `app.py` | `chatbot_secret = os.environ['CHATBOT_SECRET']` obligando a su definición en variables de entorno. |
| 8 | [Back-End/app.py:56](file:///c:/git/Arecofixpage/Back-End/app.py#L56) | **Media** | Fallback estático débil para `SECRET_KEY` de Flask (`local-offline-engine-secret-key-2026`) | `app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or os.urandom(32).hex()`. |
| 9 | [Back-End/app.py:599](file:///c:/git/Arecofixpage/Back-End/app.py#L599) | **Media** | Fallback predecible de webhook de WhatsApp (`arecofix_secreto_123`) | `VERIFY_TOKEN = os.environ['WHATSAPP_VERIFY_TOKEN']` sin fallback estático. |
| 10 | [Back-End/app.py:1429](file:///c:/git/Arecofixpage/Back-End/app.py#L1429) | **Media** | Password admin offline por defecto predecible (`admin123`) | `offline_admin_pw = os.getenv("OFFLINE_ADMIN_PASSWORD") or secrets.token_urlsafe(16)`. |
| 11 | [server/routes/academy-subscription.routes.ts:253](file:///c:/git/Arecofixpage/server/routes/academy-subscription.routes.ts#L253) | **Media** | Fallback para webhook secret de MercadoPago (`arecofix_academy_wh_secret_2026`) | Eliminar fallback y retornar HTTP 500 si `getMpWebhookSecret()` no está configurado en producción. |
| 12 | [src/app/core/services/auth.service.ts:369](file:///c:/git/Arecofixpage/src/app/core/services/auth.service.ts#L369) | **Media** | UUID de tenant fallback hardcodeado (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`) | Resolver siempre dinámicamente via `TenantService` sin ID estático de fallback. |
| 13 | [src/app/core/services/tenant.service.ts:130](file:///c:/git/Arecofixpage/src/app/core/services/tenant.service.ts#L130) | **Media** | UUID de tenant hardcodeado en resolución por defecto en `TenantService` | Configurar tenant principal por variable de entorno `DEFAULT_TENANT_ID` o configuración de base de datos. |
| 14 | [cypress/support/commands.ts:76, 167, 398, 488](file:///c:/git/Arecofixpage/cypress/support/commands.ts#L76) | **Media** | Tokens JWT de mock en Cypress con email asignado al admin real `admin@arecofix.com.ar` | Actualizar los payloads mock para referenciar a `testadmin@arecofix.com`. |
| 15 | [cypress/support/helpers/auth.helper.ts:8](file:///c:/git/Arecofixpage/cypress/support/helpers/auth.helper.ts#L8) | **Media** | Mocks de sesión E2E referenciando `admin@arecofix.com.ar` | Actualizar sesión simulada para usar `testadmin@arecofix.com`. |
| 16 | [src/environments/environment.ts:22](file:///c:/git/Arecofixpage/src/environments/environment.ts#L22) (y `environment.prod.ts:24`) | **Baja** | `supabaseKey` (anon key) hardcodeada directamente en archivos TypeScript de entorno | Reemplazar por inyección en tiempo de build o runtime (`process.env.SUPABASE_ANON_KEY`). |
| 17 | [server/routes/services.routes.ts:291](file:///c:/git/Arecofixpage/server/routes/services.routes.ts#L291) | **Baja** | Clave secreta de prueba pública de Cloudflare Turnstile (`1x0000...AA`) | Validar en startup que `TURNSTILE_SECRET_KEY` exista y no sea la dummy si `NODE_ENV === 'production'`. |
