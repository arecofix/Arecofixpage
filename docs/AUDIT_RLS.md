# 🛡️ AUDITORÍA FORENSE: ROW LEVEL SECURITY (RLS) Y AISLAMIENTO MULTI-TENANT

**Fecha de ejecución:** 2026-10-18T22:35:00-03:00  
**Equipo auditor:** DBA PostgreSQL Senior, Auditor de Seguridad, Tech Lead  
**Entorno auditado:** PostgreSQL 15 en Supabase (`supabase-db`), host `db.arecofix.com.ar`  
**Metodología:** Inspección del catálogo `pg_tables` y `pg_policies`, simulación forense con `SET ROLE anon` y `SET ROLE authenticated`.

---

## 1. RESUMEN DE COBERTURA DE RLS EN EL ESQUEMA `public`

De las **70 tablas** existentes en el esquema `public`, **66 tablas (94.3%) tienen RLS activo (`rowsecurity = true`)**.

### Tablas con RLS Inactivo (`rowsecurity = false`):
1. `public.roles`: Tabla de lookup del sistema (roles base).
2. `public.role_permissions`: Tabla de lookup del sistema (matriz de permisos).
3. `public.services_backup_20261018`: **Tabla de backup temporal de la Fase 1.**
4. `public.blog_posts_backup_20261018`: **Tabla de backup temporal de la Fase 1.**

> [!WARNING]
> **OBSERVACIÓN (P2):** Las tablas de backup fueron creadas directamente en el esquema `public` con permisos heredados y `rowsecurity = false`. Deben moverse a un esquema reservado de mantenimiento (ej: `audit` o `backups`) para prevenir lecturas accidentales no controladas.

---

## 2. EVIDENCIA DE SIMULACIÓN FORENSE: `SET ROLE anon`

Se ejecutó la siguiente transacción de prueba en la base de datos de producción:

```sql
BEGIN;
SET ROLE anon;
SELECT 'anon_services_count' AS test, COUNT(*) FROM public.services;
SELECT 'anon_service_leads_count' AS test, COUNT(*) FROM public.service_leads;
SELECT 'anon_products_count' AS test, COUNT(*) FROM public.products;
SELECT 'anon_repairs_count' AS test, COUNT(*) FROM public.repairs;
SELECT 'anon_profiles_count' AS test, COUNT(*) FROM public.profiles;
SELECT 'anon_orders_count' AS test, COUNT(*) FROM public.orders;
ROLLBACK;
```

### Resultados Obtenidos Literalmente:

| Métrica / Test | Filas Visibles a `anon` | Evaluación de Seguridad |
|---|---|---|
| `anon_services_count` | **1** | ✅ **SEGURO**: Solo ve el servicio con `is_published = true` (`auditoria-de-sitios-web`). |
| `anon_service_leads_count` | **0** | ✅ **SEGURO**: Ningún dato de prospectos o PII expuesto a anónimos. |
| `anon_products_count` | **2,594** | ✅ **CORRECTO**: Catálogo público visible para e-commerce. |
| `anon_repairs_count` | **0** | ✅ **SEGURO**: Datos de taller totalmente aislados. |
| `anon_profiles_count` | **0** | ✅ **SEGURO**: Perfiles y credenciales totalmente aislados. |
| `anon_orders_count` | **18** | ❌ **VULNERABILIDAD CRÍTICA (P1)**: Fuga de pedidos de invitados. |

---

## 3. HALLAZGO CRÍTICO (P1): VULNERABILIDAD EN POLÍTICAS DE `public.orders`

Al auditar la tabla `public.orders` mediante `pg_policies`, se detectaron las siguientes 3 políticas permisivas para `{anon}`:

```sql
-- 1. LECTURA
CREATE POLICY "Anon can view guest orders" ON public.orders
FOR SELECT TO anon
USING ((session_id IS NOT NULL) AND (user_id IS NULL));

-- 2. MODIFICACIÓN
CREATE POLICY "Anon can update guest orders" ON public.orders
FOR UPDATE TO anon
USING ((session_id IS NOT NULL) AND (user_id IS NULL))
WITH CHECK ((session_id IS NOT NULL) AND (user_id IS NULL));

-- 3. ELIMINACIÓN
CREATE POLICY "Anon can delete guest carts" ON public.orders
FOR DELETE TO anon
USING ((session_id IS NOT NULL) AND (user_id IS NULL) AND (status = 'cart'::text));
```

### 5 Whys y Análisis de Causa Raíz:
1. **¿Qué sucede?** Un atacante o scraper anónimo puede consultar `SELECT * FROM orders` y recibir todos los carritos y pedidos de invitados de todos los clientes sin restricción.
2. **¿Por qué?** La condición `(session_id IS NOT NULL AND user_id IS NULL)` solo verifica que la columna `session_id` no esté vacía en la fila, pero **NO compara** si el `session_id` de la fila coincide con el session ID del usuario actual.
3. **¿Por qué se escribió así?** Durante la migración `20261016000000_fix_cart_and_checkout_rls.sql`, se implementó soporte para carritos de compras anónimos (invitados sin cuenta), omitiendo la validación contra un header HTTP o claim de sesión (`request.headers`).
4. **Impacto:**
   - **Lectura indebida:** Exposición de carritos de compras activos de otros usuarios.
   - **Destrucción de datos:** Un script anónimo puede ejecutar `DELETE FROM orders;` y borrar todos los carritos de invitados de la tienda simultáneamente.

### Remedición Inmediata Requerida:
Vincular el RLS de sesión con el header HTTP transmitido por el cliente en Supabase PostgREST:
```sql
DROP POLICY "Anon can view guest orders" ON public.orders;
CREATE POLICY "Anon can view guest orders" ON public.orders
FOR SELECT TO anon
USING (
  session_id IS NOT NULL 
  AND user_id IS NULL 
  AND session_id::text = NULLIF(current_setting('request.headers', true)::json->>'x-guest-session', '')
);
```

---

## 4. AUDITORÍA DE POLÍTICAS DE SERVICIOS Y LEADS

### Tabla `public.services`:
- `services_anon_select`: `USING ((is_published = true) AND (deleted_at IS NULL))` -> ✅ Correcto y verificado.
- `services_admin_crud`: `USING (is_super_admin() OR (tenant_id = get_current_tenant_id()))` -> ✅ Tenant isolation enforced.

### Tabla `public.service_blocks`:
- `service_blocks_anon_select`:
  ```sql
  ((is_enabled = true) AND 
    (((owner_type = 'service') AND (EXISTS (SELECT 1 FROM services s WHERE s.id = owner_id AND s.is_published = true AND s.deleted_at IS NULL))) OR
     ((owner_type = 'post') AND (EXISTS (SELECT 1 FROM blog_posts p WHERE p.id = owner_id AND p.status = 'published')))))
  ```
  -> ✅ Excelente política basada en integridad referencial y estado de publicación del padre.

### Tabla `public.service_leads`:
- `service_leads_anon_insert`: `INSERT` permitido a `{anon, authenticated}` con `WITH CHECK (true)`.
- `service_leads_admin_all`: `ALL` reservado para administradores del tenant `(is_super_admin() OR (tenant_id = get_current_tenant_id()))`.
- Ninguna política de lectura (`SELECT`) está asignada a `{anon}`. -> ✅ Blindaje de datos verificado.
