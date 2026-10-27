# Política de Seguridad y Hardening (Security Policy)

**Versión**: 1.1.0  
**Última Revisión**: 20 de Octubre de 2026  
**Ámbito**: Ecosistema Arecofix (`arecofix.com.ar`, SSR Express, PostgreSQL Supabase, Cloudflare)

---

## 1. Política de Content Security Policy (CSP)

Arecofix implementa un modelo de seguridad por capas con Content Security Policy en modo **Enforced** (estricto, sin `-Report-Only`). El CSP bloquea inyecciones de scripts maliciosos (XSS), robo de sesiones por cross-site requests y clickjacking.

### 1.1. Directivas Activas y Rationale

| Directiva | Valor Configurado | Justificación y Rationale |
| :--- | :--- | :--- |
| `default-src` | `'self' https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://db.arecofix.com.ar https://api.arecofix.com.ar` | Origen base restringido al propio dominio y microservicios esenciales. |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://sdk.mercadopago.com https://*.mercadolibre.com https://*.mercadopago.com https://http2.mlstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.facebook.net https://*.facebook.com https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.google.com https://apis.google.com` | Carga de scripts del bundle Angular, SDK oficial de Mercado Pago, widgets antibot de Cloudflare Turnstile y métricas de analítica. |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | Hojas de estilo locales e incrustadas de TailwindCSS/DaisyUI y Google Fonts. |
| `font-src` | `'self' https://fonts.gstatic.com data:` | Tipografías de Google Fonts y assets binarios en base64. |
| `img-src` | `'self' data: blob: https: http://127.0.0.1:* https://worker.arecofix.com.ar https://*.gstatic.com https://encrypted-tbn0.gstatic.com` | Imágenes locales, Cloudflare R2 / Worker de failover y avatares remotos. |
| `frame-src` | `'self' https://challenges.cloudflare.com https://www.google.com https://www.youtube.com https://*.facebook.com https://*.firebaseapp.com` | Renderizado aislado de Cloudflare Turnstile en forms y videos educativos de la Academia. |
| `connect-src` | `'self' https://db.arecofix.com.ar wss://db.arecofix.com.ar https://challenges.cloudflare.com https://static.cloudflareinsights.com https://api.mercadopago.com https://*.mercadopago.com https://api.arecofix.com.ar https://worker.arecofix.com.ar https://*.supabase.co ...` | Comunicaciones REST y WebSocket en tiempo real con Supabase y endpoints de cobro seguro de Mercado Pago. |
| `worker-src` | `'self' blob:` | Web Workers del cliente para compresión y procesamiento offline con IndexedDB. |
| `object-src` | `'none'` | Mitigación absoluta contra plugins legados (Flash, Silverlight, applets). |
| `upgrade-insecure-requests` | (flag activo) | Fuerza la elevación automática de cualquier recurso HTTP a HTTPS seguro. |

### 1.2. Protocolo para Modificar o Agregar Nuevos Orígenes
1. **Regla de Oro**: Ninguna URL externa debe agregarse directamente a producción.
2. Registrar el nuevo origen en `server/middleware/security.middleware.ts` en la directiva estricta correspondiente.
3. Probar en entorno local (`pnpm start`) abriendo la consola de DevTools para confirmar 0 advertencias de violación.
4. Ejecutar el test E2E de regresión `cart-integrity.cy.ts` y `seo-validation.cy.ts`.
5. Desplegar a staging y verificar mediante `curl.exe -sI https://staging.arecofix.com.ar/`.

---

## 2. Cabeceras HTTP de Seguridad (Hardening)

Además del CSP, Nginx y Express emiten los siguientes encabezados en cada respuesta:

- **HSTS (HTTP Strict Transport Security)**: `max-age=31536000; includeSubDomains; preload` (forzado en Cloudflare Edge).
- **X-Content-Type-Options**: `nosniff` (previene ataques de MIME-type sniffing).
- **X-Frame-Options**: `SAMEORIGIN` (mitiga ataques de clickjacking).
- **Referrer-Policy**: `strict-origin-when-cross-origin` (protege la privacidad de URLs internas ante navegación externa).
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(self)`.

---

## 3. Gestión y Rotación de Secretos

### 3.1. Dónde viven los secretos
1. **Entorno Local**: Archivo `.env` en la raíz del proyecto (ignorado en `.gitignore`).
2. **Entorno de Producción**: `/home/ubuntu/arecofix/.env` con permisos `chmod 600`.
3. **Pipeline CI/CD**: Almacenados en GitHub Actions Secrets (`SSH_PRIVATE_KEY`, `STAGING_SUPABASE_KEY`).

### 3.2. Prohibición Absoluta
- ❌ Prohibido commitear archivos `.env`, llaves privadas (`*.key`, `*.pem`) o tokens con prefijos `APP_USR-`, `TEST-`, `sbp_`.
- Se ejecutan validaciones automatizadas pre-commit y pre-deploy para impedir fugas de credenciales.

### 3.3. Protocolo de Rotación de Emergencia
En caso de sospecha de fuga de credenciales:
1. **Mercado Pago (`MP_ACCESS_TOKEN`)**:
   - Ingresar a la consola de desarrolladores de Mercado Pago.
   - Revocar el token comprometido y generar un nuevo Client Secret.
   - Actualizar `/home/ubuntu/arecofix/.env` y reiniciar PM2 (`pm2 reload arecofix-frontend`).
2. **Supabase (`SUPABASE_KEY` / `SERVICE_ROLE_KEY`)**:
   - Regenerar tokens en el dashboard de Supabase (o archivo de configuración de Kong/PostgREST en VPS).
   - Actualizar variables de entorno en el servidor y reiniciar containers Docker.
3. **Clave SSH (`ssh-key-2026-08-30.key`)**:
   - Generar nuevo par `ssh-keygen -t ed25519`.
   - Reemplazar en `~/.ssh/authorized_keys` en el VPS.
   - Actualizar el secreto `SSH_PRIVATE_KEY` en GitHub Repository Secrets.

---

## 4. Política de Base de Datos y Row-Level Security (RLS)

1. **100% Cobertura RLS**: Toda tabla creada en el esquema `public` de PostgreSQL **debe** tener activado `ROW LEVEL SECURITY`.
2. **Aislamiento Multi-Tenant**: Las queries deben pasar por filtros `tenant_id = get_current_tenant_id()` o utilizar funciones `SECURITY DEFINER` validadas.
3. **Permisos de Roles (RBAC)**: Tablas de roles (`public.roles`, `public.role_permissions`) tienen lecturas restringidas a usuarios autenticados y mutaciones reservadas exclusivamente para `is_super_admin()`.

### 4.1. Estándar para Funciones `SECURITY DEFINER` y `search_path` (CWE-426)
- **Principio**: La cláusula `SECURITY DEFINER` solo se permite cuando la función requiere elevar privilegios de forma controlada (e.g. tracking público sin exponer tablas o triggers internos).
- **Hardening Obligatorio**: Toda función debe fijar su search path explícitamente:
  ```sql
  ALTER FUNCTION <schema>.<proc>(<args>) SET search_path = public, extensions, pg_temp;
  ```
- **Control de API**: Toda función interna, trigger o procedimiento de mantenimiento debe revocar permisos de ejecución:
  ```sql
  REVOKE EXECUTE ON FUNCTION ... FROM public, anon, authenticated;
  ```

### 4.3. Política de Funciones SECURITY DEFINER (Arquitectura Schema 'private')
- **Superficie de Ataque PostgREST**: PostgREST expone automáticamente al exterior cualquier función creada en el esquema `public`. Si dicha función tiene el atributo `SECURITY DEFINER`, cualquier usuario (o `anon`) con permiso de ejecución puede saltarse las políticas RLS.
- **Arquitectura de Esquema Privado Obligatoria**:
  1. Toda lógica de negocio que requiera privilegios elevados (`SECURITY DEFINER`) **debe** residir en el esquema interno `private`:
     ```sql
     CREATE SCHEMA IF NOT EXISTS private;
     REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;
     GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role, postgres;
     ```
  2. PostgREST tiene explícitamente configurado `PGRST_DB_SCHEMA=public,zarx,storage,graphql_public`, lo que impide invocar funciones de `private` directamente vía HTTP.
  3. En el esquema `public` se implementa un wrapper `SECURITY INVOKER` que sanitiza parámetros y delega la llamada a `private.<funcion>()`.
  4. **Regla de Oro contra Recursi�n Infinita (CWE-674):** Los helpers centrales de resoluci�n de tenencia y roles (is_admin(), get_auth_user_tenant(), is_super_admin(), etc.) deben definirse imperativamente como SECURITY DEFINER con SET search_path = public, private, extensions, pg_temp para prevenir bucles recursivos fatales (stack depth limit exceeded) al consultar profiles.
  5. Cada función pública con delegación debe incluir metadatos de auditoría:
     ```sql
     COMMENT ON FUNCTION public.<proc>(<args>) IS '@security-definer-justification: Wrapper SECURITY INVOKER delegando a private.<proc>; cumple CIS y linter';
     ```

### 4.4. Política de Storage y Enumeración de Buckets (Storage Listing Policy)
- **Riesgo de Enumeración**: Otorgar permisos `SELECT` amplios sobre `storage.objects` (e.g. `bucket_id = 'avatars'`) permite a los usuarios invocar la API `/storage/v1/object/list/...`, enumerando archivos ajenos y metadatos sensibles.
- **Regla para Buckets Públicos (`public = true`)**:
  - Los archivos de buckets públicos (e.g. `course-covers`) se descargan directamente vía CDN / URL pública sin requerir políticas `SELECT` sobre `storage.objects`.
  - Queda **estrictamente prohibido** otorgar políticas `SELECT` amplias en buckets públicos.
- **Regla para Buckets Privados o de Usuario**:
  - Las políticas de lectura sobre `storage.objects` deben acotarse estrictamente al propietario o al rol administrativo:
    ```sql
    CREATE POLICY "<bucket>_select_own" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = '<bucket>' AND (owner = (SELECT auth.uid()) OR public.is_admin()));
    ```

### 4.5. Justificación Técnica de Warnings Residuales del Linter
- **Estado Oficial**: 0 vulnerabilidades P0/P1 activas.
- **Categorías Residuales Justificadas**:
  - `no_primary_key`: 2 tablas en schema `backups.*` inmutables y sin acceso por API (`USAGE` revocado a `anon`/`authenticated`/`public`).
  - `unused_index`: Índices covering de Foreign Keys en período de warmup post-creación. Re-evaluación programada a 30 días mediante `scripts/audit_unused_indexes.mjs`.
  - `pg_graphql_*_table_exposed`: Catálogo público del e-commerce expuesto a SSR con 100% de tablas protegidas por Row-Level Security y tablas financieras/logs revocadas de `anon`.
- Documentación completa y comandos de verificación forense en [Justificación Técnica de Warnings Residuales](file:///c:/git/Arecofixpage/docs/JUSTIFIED_WARNINGS_20261020.md).

---

## 5. Reporte de Vulnerabilidades

Agradecemos los reportes responsables de seguridad. Si descubre una vulnerabilidad potencial, por favor no abra un issue público.

- **Canal de Contacto Seguro**: `seguridad@arecofix.com.ar`
- **Tiempo de Respuesta Comprometido**: < 24 horas hábiles.
- **Divulgación Coordinada**: Solicitamos un período de gracia de 30 días antes de la divulgación pública para aplicar el parche en producción.

---

## 6. Historial de Auditorías de Seguridad

- [Informe de Certificación Original (19/10/2026)](file:///c:/git/Arecofixpage/docs/CLIENT_READINESS_20261019.md)
- [Auditoría Forense de Regresión (20/10/2026)](file:///c:/git/Arecofixpage/docs/REGRESSION_AUDIT_20261020.md)
- [Auditoría Forense de Base de Datos (20/10/2026)](file:///c:/git/Arecofixpage/docs/DATABASE_AUDIT_20261020.md)
- [Auditoría Forense de Discrepancia del Linter (20/10/2026)](file:///c:/git/Arecofixpage/docs/LINTER_DISCREPANCY_20261020.md)
- [Plan de Remediación Residual (20/10/2026)](file:///c:/git/Arecofixpage/docs/REMEDIATION_PLAN_RESIDUAL_20261020.md)
- [Remediación R1 - Políticas Permisivas Múltiples](file:///c:/git/Arecofixpage/docs/REMEDIATION_R1_20261020.md)
- [Remediación R2 - Políticas de Listado de Storage](file:///c:/git/Arecofixpage/docs/REMEDIATION_R2_20261020.md)
- [Remediación R3 - Funciones Anon Security Definer](file:///c:/git/Arecofixpage/docs/REMEDIATION_R3_20261020.md)
- [Remediación R4 - Funciones Authenticated Security Definer](file:///c:/git/Arecofixpage/docs/REMEDIATION_R4_20261020.md)
- [Justificación Técnica de Warnings Residuales](file:///c:/git/Arecofixpage/docs/JUSTIFIED_WARNINGS_20261020.md)
- [Guía de Hardening de Base de Datos](file:///c:/git/Arecofixpage/docs/DATABASE_HARDENING_GUIDE.md)


