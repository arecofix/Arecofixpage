# Auditoría Forense de Discrepancia: Supabase Database Linter

**Proyecto**: Arecofix SaaS Multi-Tenant Ecosystem  
**Fecha**: 20 de Octubre de 2026  
**Autores**: DBA Senior, Security & Compliance Auditor, Performance Engineer, SRE Senior  
**Objetivo**: Analizar, documentar y reconciliar técnicamente la discrepancia entre las métricas reportadas en la remediación inicial y el estado real arrojado por el Supabase Database Linter.

---

## 1. Resumen de la Discrepancia

En la ejecución anterior de remediación, se emitieron reportes declarando el cierre o justificación de las advertencias del linter. Sin embargo, una auditoría rigurosa y la ejecución del linter bajo los criterios oficiales de Supabase (`splinter`) evidenciaron la persistencia de advertencias residuales en 4 categorías específicas:

| Categoría Linter | Declarado Anteriormente | Estado Real Detectado | Causa Raíz de la Discrepancia |
| :--- | :---: | :---: | :--- |
| `multiple_permissive_policies` | 34 | **193** | **Omisión de expansión de `cmd = 'ALL'` y `{public}`**. La query anterior agrupaba estrictamente por columna `cmd`. En PostgreSQL RLS, una política `FOR ALL` aplica simultáneamente a `SELECT`, `INSERT`, `UPDATE` y `DELETE`. Al coexistir con políticas específicas (e.g. `FOR SELECT`), el optimizador evalúa ambas de forma permisiva. Además, la pseudo-función `{public}` aplica a todos los roles (`anon`, `authenticated`, `authenticator`, `dashboard_user`). |
| `public_bucket_allows_listing` | 0 | **5** | **Filtro restringido a `anon`**. El script anterior verificaba únicamente políticas donde el rol fuera `anon`. Sin embargo, en buckets con `public = true`, una política de `SELECT` amplia otorgada a `{authenticated}` permite a cualquier usuario registrado listar todos los archivos (`.list()`), activando la regla de seguridad del linter. |
| `anon_security_definer_function_executable` | 2 (justificados) | **4** | **Justificación documental vs. Rediseño de esquema**. La remediación anterior justificó en texto las funciones `get_repair_tracking` y `get_public_certificate_data`, y otorgó permisos de ejecución a `anon` en `get_current_tenant_id` y `get_request_guest_session` para evitar fallos 401 en carritos de invitados. El linter no lee documentación: si la función está en `public` con `SECURITY DEFINER` y ejecutable por `anon`, emite warning. Se requiere encapsulación en schema `private`. |
| `authenticated_security_definer_function_executable` | 43 | **35** | **Coexistencia de helpers y RPCs en `public`**. 35 funciones permanecieron en el esquema público con `SECURITY DEFINER`. Aunque muchas cuentan con validaciones internas de rol, la exposición directa en PostgREST genera alertas de superficie de ataque. |

---

## 2. Análisis Detallado de Causa Raíz

### 2.1. Desglose de `multiple_permissive_policies` (193 casos reales)
En arquitecturas SaaS multi-tenant, es común crear políticas independientes:
1. `super_admin_all_access` (PERMISSIVE FOR ALL TO authenticated)
2. `tenant_isolation` (PERMISSIVE FOR ALL TO authenticated)
3. `user_own_access` (PERMISSIVE FOR SELECT TO authenticated)

Cuando un usuario autenticado realiza un `SELECT`:
PostgreSQL debe compilar y evaluar:
```sql
(is_super_admin()) OR (tenant_id = get_current_tenant_id()) OR (user_id = auth.uid())
```
Al estar separadas en 3 políticas distintas en `pg_policies`, PostgreSQL evalúa múltiples expresiones permisivas independientes, degradando el plan de ejecución y disparando la advertencia del linter por cada acción (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) y por cada rol (`anon`, `authenticated`, `authenticator`, `dashboard_user`).

### 2.2. Desglose de `public_bucket_allows_listing` (5 casos reales)
Las siguientes 5 políticas fueron creadas en `20261021050000_harden_storage_buckets.sql`:
- `Authenticated users can select avatars` (`bucket_id = 'avatars'`)
- `Authenticated users can select evidence` (`bucket_id = 'evidence'`)
- `Authenticated users can select cvs` (`bucket_id = 'cv-generados'`)
- `Authenticated users can select certificates` (`bucket_id = 'academy_certificates'`)
- `Authenticated users can select course covers` (`bucket_id = 'course-covers'`)

Dado que estos 5 buckets tienen `public = true` en `storage.buckets`:
- Para descargar un archivo conociendo su URL directa no se requiere ninguna política `SELECT` sobre `storage.objects` (la CDN de Supabase / Cloudflare entrega directo por URL pública).
- Al otorgar `SELECT` a `authenticated` con condición simple `(bucket_id = '...')`, se habilita la llamada a la API `/storage/v1/object/list/...`, permitiendo la enumeración de archivos de otros usuarios.

### 2.3. Desglose de `anon_security_definer_function_executable` (4 funciones)
1. `public.get_current_tenant_id()`
2. `public.get_request_guest_session()`
3. `public.get_repair_tracking(p_code text)`
4. `public.get_public_certificate_data(p_cert_id uuid)`

Todas fueron creadas como `SECURITY DEFINER` en el schema `public`. El linter exige que los endpoints accesibles por `anon` sean `SECURITY INVOKER` (delegando a RLS) o que la lógica privilegiada resida en un esquema no expuesto (`private`) invocado mediante wrappers seguros.

---

## 3. Plan de Acción de Ingeniería

Para erradicar definitivamente estas advertencias sin romper la operación:
1. **R1**: Consolidar sistemáticamente las políticas en una única política permisiva unificada por tabla, acción y rol principal (`authenticated` y `anon`), limpiando roles no operativos (`authenticator`, `dashboard_user`).
2. **R2**: Reconfigurar las políticas de storage:
   - Buckets públicos de descarga directa (`course-covers`): eliminar la política `SELECT` innecesaria.
   - Buckets privados o de usuario (`avatars`, `evidence`, `cv-generados`, `academy_certificates`): fijar `public = false` o restringir el `SELECT` a `owner = (SELECT auth.uid())` o `is_admin()`.
3. **R3 & R4**: Implementar la arquitectura de **Esquema Privado (`private`)**:
   - Crear schema `private` accesible únicamente por roles de sistema (`postgres`, `service_role`).
   - Mover la lógica `SECURITY DEFINER` al schema `private`.
   - Crear en `public` wrappers `SECURITY INVOKER` que saniticen parámetros y deleguen la ejecución.
   - Para helpers internos de RLS (`is_admin`, `get_auth_user_*`), cambiar a `SECURITY INVOKER` o inlining en políticas.
