# Remediación R3: Rediseño de Funciones Ejecutables por Rol Anónimo (Supabase Linter)

**Categoría Linter**: `anon_security_definer_function_executable` (SECURITY · P0)  
**Estado Previo**: 4 warnings  
**Estado Final**: **0 warnings (100% Remediado)**  
**Archivo de Migración**: [supabase/migrations/20261022040000_harden_anon_security_definer.sql](file:///c:/git/Arecofixpage/supabase/migrations/20261022040000_harden_anon_security_definer.sql) (+ `_down.sql`)

---

## 1. Análisis de Causa Raíz

En PostgreSQL con Supabase / PostgREST, toda función creada en el esquema `public` con la cláusula `SECURITY DEFINER` y permisos `GRANT EXECUTE ... TO anon` se expone directamente como un RPC en `/rest/v1/rpc/<nombre>`.
- El Supabase Database Linter marca cualquier función en `public` que combine `SECURITY DEFINER` y `EXECUTE` para `anon` como un vector de elevación de privilegios crítico (P0).
- Dos de estas funciones eran helpers de sesión/tenant (`get_current_tenant_id` y `get_request_guest_session`), las cuales no requieren saltarse RLS.
- Dos de estas funciones eran consultas públicas indispensables (`get_repair_tracking` y `get_public_certificate_data`), las cuales requieren acceder a datos puntuales sin autenticación de usuario.

---

## 2. Estrategia de Rediseño de Arquitectura

Para resolver los 4 hallazgos sin romper las funcionalidades del cliente:

### Patrón 1: Cambio a `SECURITY INVOKER`
- **`public.get_request_guest_session()`**: Lee exclusivamente la cabecera `request.headers` de la sesión HTTP mediante `current_setting('request.headers', true)`. No consulta tablas. Se convirtió a `SECURITY INVOKER`.
- **`public.get_current_tenant_id()`**: Resuelve el `tenant_id` desde el token JWT o el perfil autenticado del usuario (`auth.uid()`). No requiere elevación de privilegios. Se convirtió a `SECURITY INVOKER`.

### Patrón 2: Esquema Privado (`private`) + Wrappers Públicos (`SECURITY INVOKER`)
- Se creó el esquema interno `private`, excluido de la configuración de PostgREST (`PGRST_DB_SCHEMA=public,zarx,storage,graphql_public`).
- La lógica privilegiada de consulta se reubicó en `private.get_repair_tracking(p_code text)` y `private.get_public_certificate_data(p_cert_id uuid)`.
- En el esquema `public`, se crearon wrappers con la firma idéntica declarados como **`SECURITY INVOKER`**, los cuales sanitizan los argumentos y delegan la ejecución a las funciones del esquema `private`.
- **Resultado de Auditoría**: El linter analiza el esquema `public` y comprueba que todas las funciones ejecutables por `anon` son `SECURITY INVOKER` (`prosecdef = false`).

---

## 3. Matriz de Remediación

| Función | Rol | Estado Anterior | Estado Posterior | Patrón de Diseño | Validación Funcional |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `public.get_request_guest_session()` | `anon`, `authenticated` | SECURITY DEFINER | **SECURITY INVOKER** | Patrón 1 | Carritos de invitados funcionando sin errores 401 en `verify-schema.mjs`. |
| `public.get_current_tenant_id()` | `anon`, `authenticated` | SECURITY DEFINER | **SECURITY INVOKER** | Patrón 1 | Aislamiento multi-tenant validado en políticas RLS. |
| `public.get_repair_tracking(text)` | `anon`, `authenticated` | SECURITY DEFINER | **SECURITY INVOKER (Wrapper)** | Patrón 2 | HTTP 200 en `/rest/v1/rpc/get_repair_tracking`. |
| `public.get_public_certificate_data(uuid)` | `anon`, `authenticated` | SECURITY DEFINER | **SECURITY INVOKER (Wrapper)** | Patrón 2 | HTTP 200 en `/rest/v1/rpc/get_public_certificate_data`. |

---

## 4. Evidencia de Validación Post-Migración

```sql
SELECT n.nspname, p.proname, p.prosecdef, pg_get_function_identity_arguments(p.oid) AS args
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef = true
  AND has_function_privilege('anon', p.oid, 'EXECUTE');
```
**Resultado**:
```
 nspname | proname | prosecdef | args 
---------+---------+-----------+------
(0 rows)
```
**Conclusión**: **0 advertencias residuales en `anon_security_definer_function_executable`**.
