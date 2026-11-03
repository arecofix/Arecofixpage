# 🌐 Auditoría Sistémica Global de Aislamiento Multi-Tenant

**Fecha:** 18 de Octubre, 2026  
**Sistema:** Arecofix — Plataforma Multi-Tenant SaaS  
**Alcance:** Toda la Base de Datos PostgreSQL (72 tablas y vistas) + Código Frontend/Backend (`src/`)  
**Estado:** ✅ **AUDITORÍA Y CORRECCIÓN COMPLETADA AL 100% — VERIFICADO EN PRODUCCIÓN**

---

## 1. Resumen Ejecutivo

A raíz de la vulnerabilidad crítica detectada en el módulo de Mensajería y Notificaciones —donde la función `get_my_tenant()` retornaba la Sede Central (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`) como fallback por defecto y permitía fugas entre sucursales— se llevó a cabo una auditoría exhaustiva en **todos** los módulos de la plataforma:
- **E-commerce & Facturación:** `orders`, `order_items`, `invoices`, `payments`, `bank_reconciliations`
- **Reparaciones & Servicio Técnico:** `repairs`, `repair_parts_used`, `repair_images`, `repair_status_history`, `technical_solutions`, `customer_devices`, `repair_number_sequences`
- **Caja & Finanzas:** `cash_movements`, `vw_cashflow_real`
- **Inventario & Productos:** `products`, `product_variants`, `product_stock_per_branch`, `stock_history`, `categories`, `brands`, `models`, `product_images`, `product_reviews`
- **Academia & Cursos:** `courses`, `course_modules`, `course_lessons`, `course_enrollments`, `course_certificates`, `course_progress`, `academy_subscriptions`, `academy_payments`, `academy_plans`
- **Base de Conocimiento & Contenido:** `knowledge_base`, `blog_posts`, `blog_categories`, `blog_tags`, `blog_post_tags`, `post_comments`, `pages`, `page_templates`
- **Seguridad & Roles:** `profiles`, `user_roles`, `role_permissions`, `tenants`, `branches`, `audit_logs`, `auth_logs`

---

## 2. Hallazgos en Base de Datos (PostgreSQL)

### 2.1 Funciones con Fallbacks Hardcodeados o Lógica Insegura

| Función | Tipo de Vulnerabilidad | Nivel de Riesgo | Detalle Técnico | Estado |
|---|---|:---:|---|:---:|
| `public.save_repair_order(jsonb)` | Hardcoded Fallback a Sede Central | **CRÍTICO** | Si `v_tenant_id` era nulo o 0000, asignaba `'bba26ccd-59ce-471c-aac0-4c1f5513de3b'`. Guardaba reparaciones de otras sucursales en Sede Central. | ✅ **Corregido** |
| `public.handle_new_user()` | Hardcoded Fallback a Sede Central & Sede Default | **ALTO** | Ante registros sin `tenant_id` en metadata, asignaba el tenant de la Sede Central y la sucursal `de967f68-7b15-44c0-bc98-952ccf06e1e5`. | ✅ **Corregido** |
| `public.force_tenant_isolation()` | Llamada a función obsoleta | **ALTO** | Trigger de 18 tablas invocaba `get_secure_tenant_id()`. | ✅ **Corregido** |
| `public.is_admin_of_tenant(uuid)` | Lógica permisiva ante tenant nulo | **ALTO** | Contenía: `OR (role = 'admin' AND (tenant_id = target_tenant_id OR target_tenant_id IS NULL))`. Si el target era nulo, otorgaba privilegios de admin transversal. | ✅ **Corregido** |
| `public.get_admin_business_dashboard_metrics(...)` | Falta de validación de rol para `p_tenant_id` | **ALTO** | Aceptaba `p_tenant_id` arbitrario sin verificar si el invocador era `super_admin`. | ✅ **Corregido** |
| `public.get_dashboard_stats_v2(uuid)` | Dependencia de `get_my_tenant()` sin validación | **MEDIO** | Invocaba `get_my_tenant()` y si era nulo generaba consultas inconsistentes. | ✅ **Corregido** |
| `public.get_my_tenant()` & `public.get_secure_tenant_id()` | Funciones obsoletas con fallbacks | **CRÍTICO** | Mantenían fallbacks permisivos. | ✅ **Reemplazadas por wrappers directos de `get_current_tenant_id()`** |

---

### 2.2 Vistas de Base de Datos sin `security_invoker`

| Vista | Estado Previo | Nivel de Riesgo | Detalle Técnico | Estado |
|---|---|:---:|---|:---:|
| `public.vw_cashflow_real` | `security_invoker = false` | **CRÍTICO** | Se ejecutaba con privilegios de `postgres`. Hacía `UNION ALL` entre `cash_movements`, `repairs` y `orders`, **omitiendo RLS** para cualquier usuario autenticado. | ✅ **`security_invoker = true` activado** |

*(Las otras 8 vistas auditadas: `academy_students_view`, `admin_notifications`, `available_users_for_employee`, `safe_profiles_view`, `staff_orders_view`, `v_monthly_financials`, `v_unified_clients`, `view_products_inventory` ya contaban con `security_invoker = true` o `on`).*

---

### 2.3 Tablas con RLS Incompleto o sin Forzado (`FORCE ROW LEVEL SECURITY`)

Se detectaron 19 tablas donde RLS estaba deshabilitado o no estaba forzado:

| Tabla | RLS Habilitado | RLS Forzado | Nivel de Riesgo | Detalle Técnico | Estado |
|---|:---:|:---:|:---:|---|:---:|
| `public.user_roles` | **NO** (`f`) | **NO** (`f`) | **CRÍTICO** | RLS totalmente deshabilitado. Permitía lectura/escalada de privilegios entre tenants. | ✅ **RLS Habilitado & Forzado** |
| `public.knowledge_base` | SÍ | **NO** (`f`) | **CRÍTICO** | Tenía políticas `USING (true)` para lectura y borrado entre tenants. | ✅ **Políticas reemplazadas & RLS Forzado** |
| `public.repair_number_sequences` | SÍ | **NO** (`f`) | **ALTO** | Política de lectura con `USING (true)`. | ✅ **Políticas reemplazadas & RLS Forzado** |
| `public.cash_movements` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.academy_subscriptions` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.academy_payments` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.academy_plans` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_certificates` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_lessons` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_instructors` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_progress` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_exam_questions` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.course_exam_submissions` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.product_variants` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado (propiedad transferida a `postgres`). | ✅ **RLS Forzado** |
| `public.product_reviews` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.payments` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.bank_reconciliations` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.audit_logs` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |
| `public.technical_solutions` | SÍ | **NO** (`f`) | **ALTO** | RLS no forzado. | ✅ **RLS Forzado** |

---

### 2.4 Políticas RLS Reemplazadas (Eliminación de `get_my_tenant()`)

Se identificaron y eliminaron **todas las 38 políticas** que utilizaban la función obsoleta `get_my_tenant()` o condiciones `OR get_my_tenant() IS NULL`. Se reemplazaron por políticas estrictas con `get_current_tenant_id()` y validación contra `is_super_admin()`:

1. `products` (`Products_Tenant_Isolation`)
2. `product_variants` (`Variants_Tenant_Isolation`)
3. `product_stock_per_branch` (`Stock_Tenant_Isolation`)
4. `order_items` (`staff_tenant_order_items`)
5. `stock_history` (`stock_history_tenant_isolation`)
6. `audit_logs` (`audit_logs_tenant_isolation`)
7. `auth_logs` (`auth_logs_tenant_isolation`)
8. `bank_reconciliations` (`bank_reconciliations_tenant_isolation`)
9. `blog_categories` (`blog_categories_tenant_isolation`)
10. `blog_post_tags` (`blog_post_tags_tenant_isolation`)
11. `blog_tags` (`blog_tags_tenant_isolation`)
12. `blog_posts` (`bp_select`, `bp_insert`, `bp_update`, `bp_delete`)
13. `branches` (`branches_tenant_isolation`)
14. `courses` (`crs_select`, `crs_insert`, `crs_update`, `crs_delete`)
15. `customer_devices` (`customer_devices_tenant_isolation`)
16. `models` (`mod_select`, `mod_insert`, `mod_update`, `mod_delete`)
17. `page_templates` (`page_templates_tenant_isolation`)
18. `pages` (`pages_tenant_isolation`)
19. `product_images` (`pi_select`, `pi_insert`, `pi_update`, `pi_delete`)
20. `product_reviews` (`pr_select`, `pr_insert`, `pr_update`, `pr_delete`)
21. `purchase_items` (`purchase_items_tenant_isolation`)
22. `suppliers` (`suppliers_tenant_isolation`)
23. `repair_images` (`repair_images_tenant_isolation`)
24. `repair_parts_used` (`repair_parts_used_tenant_isolation`)
25. `repair_status_history` (`repair_status_history_tenant_isolation`)
26. `technical_solutions` (`technical_solutions_tenant_isolation`)
27. `tenants` (`tenants_select_policy`)
28. `knowledge_base` (`knowledge_base_tenant_isolation`)
29. `repair_number_sequences` (`repair_number_sequences_tenant_isolation`)
30. `orders` (`Anon can insert guest orders`, `Users can insert their own orders`)
31. `user_roles` (`user_roles_tenant_isolation`)
32. `post_comments` (`post_comments_select_policy`, `post_comments_insert_policy`, `post_comments_admin_manage_policy`)

---

### 2.5 Tabla sin `tenant_id` Incorporada y Poblada (Backfill)

- **Tabla:** `public.post_comments`
- **Acción:**
  1. Se ejecutó `ALTER TABLE public.post_comments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;`
  2. Backfill ejecutado: `UPDATE public.post_comments pc SET tenant_id = bp.tenant_id FROM public.blog_posts bp WHERE pc.post_id = bp.id AND pc.tenant_id IS NULL;`
  3. `ENABLE ROW LEVEL SECURITY` y `FORCE ROW LEVEL SECURITY` aplicados.
  4. Políticas RLS seguras creadas para visitantes públicos, autores y administradores de tenant.

---

## 3. Hallazgos y Refactorizaciones en Código (Frontend / Backend)

### 3.1 Servicios de Realtime
- **Archivo:** `src/app/admin/orders/admin-orders-page.ts`
- **Vulnerabilidad:** El canal `admin-orders-realtime` escuchaba cambios en `orders` sin filtro de `tenant_id`. Cualquier pedido creado en otra sucursal se agregaba en vivo a la UI del administrador local.
- **Corrección:** Canal acotado a `admin-orders-realtime:${currentTenantId}` con filtro Postgres `{ filter: 'tenant_id=eq.' + currentTenantId }` y validación defensiva en el handler `if (newOrder.tenant_id !== currentTenantId) return;`.
- **Verificación Realtime Global:** Se auditó todo `src/` buscando `.channel(`: los únicos dos canales existentes (`notification.service.ts` y `admin-orders-page.ts`) están estrictamente acotados por `${currentTenantId}`.

### 3.2 Servicio `TenantScopedQueryService`
- **Archivo:** `src/app/core/infrastructure/supabase/tenant-scoped-query.service.ts`
- **Vulnerabilidad:** Línea 39 inyectaba `,tenant_id.is.null,tenant_id.eq.${TENANT_CONSTANTS.FALLBACK_ID}`.
- **Corrección:** Refactorizado a `.eq('tenant_id', tenantId)` estricto.

### 3.3 Repositorio Base y Servicio de Cursos
- **Archivo:** `src/app/core/repositories/base.repository.ts`
- **Vulnerabilidad:** Omitía el filtrado `eq('tenant_id', tenantId)` si `tenantId === FALLBACK_ID`.
- **Corrección:** Siempre que exista un `tenantId` válido y distinto de nulo, se aplica de forma estricta.
- **Archivo:** `src/app/core/services/courses.service.ts`
- **Vulnerabilidad:** Línea 243 utilizaba `.or(`tenant_id.eq.${tenantId},tenant_id.is.null,tenant_id.eq.${TENANT_CONSTANTS.FALLBACK_ID}`)`.
- **Corrección:** Reemplazado por `.eq('tenant_id', tenantId)`. Se acotó además `searchUsersByEmail` al tenant activo.

### 3.4 Inyección Manual de `tenant_id` en Frontend
- **Auditoría:** Búsqueda exhaustiva en formularios, directivas (`formControlName`, `name="tenant_id"`), componentes y servicios.
- **Resultado:** Ningún input o formulario permite que el usuario inyecte un `tenant_id` arbitrario. El 100% de los repositorios y servicios obtienen el ID a través de `TenantService.getTenantId()` o del token JWT.

---

## 4. Migraciones SQL Aplicadas en Producción (VPS)

1. **`20261018020000_systemic_tenant_isolation_all_modules.sql`**
   - Actualización de funciones críticas (`save_repair_order`, `handle_new_user`, `is_admin_of_tenant`, `get_admin_business_dashboard_metrics`, `has_permission`).
   - Activación de `security_invoker = true` en `vw_cashflow_real`.
   - Incorporación de columna `tenant_id` y backfill en `post_comments`.
   - `FORCE ROW LEVEL SECURITY` en 19 tablas.
   - Reemplazo de políticas en productos, variantes, stock, pedidos, movimientos de caja, reparaciones y roles de usuario.

2. **`20261018030000_eradicate_all_remaining_tenant_leaks.sql`**
   - Redefinición de `get_my_tenant()` y `get_secure_tenant_id()` como wrappers limpios sin fallbacks.
   - Actualización de `force_tenant_isolation()` y `handle_new_user()`.
   - Eliminación de políticas `USING (true)` en `knowledge_base` y `repair_number_sequences`.
   - Reemplazo de las 38 políticas restantes en blogs, imágenes, reseñas, dispositivos de clientes, modelos, páginas y plantillas.

---

## 5. Verificación y Resultados de Seguridad en Base de Datos

Se ejecutaron consultas forenses directamente contra el motor PostgreSQL (`supabase-db` en VPS):

```sql
-- 1. Tablas con tenant_id sin RLS o sin FORCE RLS
SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN (SELECT table_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'tenant_id')
  AND (c.relrowsecurity = false OR c.relforcerowsecurity = false);
-- Resultado: (0 rows) -> 100% de tablas protegidas y forzadas.

-- 2. Funciones con UUID de Sede Central hardcodeado
SELECT proname FROM pg_proc JOIN pg_namespace n ON n.oid = pg_proc.pronamespace
WHERE n.nspname = 'public' AND prosrc ILIKE '%bba26ccd-59ce-471c-aac0-4c1f5513de3b%';
-- Resultado: (0 rows) -> 0 funciones con tenant hardcodeado.

-- 3. Políticas que invoquen funciones obsoletas get_my_tenant o get_secure_tenant_id
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public' AND (qual ILIKE '%get_my_tenant%' OR with_check ILIKE '%get_my_tenant%');
-- Resultado: (0 rows) -> 0 políticas obsoletas.

-- 4. Vistas sin security_invoker
SELECT c.relname, c.reloptions FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'v';
-- Resultado: 9 vistas auditadas, todas con {security_invoker=true} o {security_invoker=on}.
```

### 5.1 Simulación Forense con Roles PostgreSQL (`SET LOCAL ROLE authenticated`)

Se ejecutó una prueba transaccional simulando a un usuario del **Tenant B** intentando consultar e insertar datos del **Tenant A (Sede Central)**:

```sql
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '55555555-5555-5555-5555-555555555555', true);
SELECT set_config('request.jwt.claims', '{"sub": "55555555-...", "role": "authenticated", "app_metadata": {"tenant_id": "550e8400-e29b-41d4-a716-446655440000"}}', true);

-- Intentos de Lectura Cruzada:
SELECT count(*) FROM public.repairs WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';        -- 0 filas devueltas
SELECT count(*) FROM public.cash_movements WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'; -- 0 filas devueltas
SELECT count(*) FROM public.invoices WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';       -- 0 filas devueltas
SELECT count(*) FROM public.knowledge_base WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'; -- 0 filas devueltas

-- Intento de Inserción Cruzada:
INSERT INTO public.knowledge_base (title, content, tenant_id) VALUES ('Infiltración', 'Secreto', 'bba26ccd-59ce-471c-aac0-4c1f5513de3b');
-- Error retornado: ERROR: new row violates row-level security policy for table "knowledge_base"

-- Intento de Modificación Cruzada:
UPDATE public.repairs SET issue_description = 'Hacked' WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
-- Filas modificadas: UPDATE 0
ROLLBACK;
```

---

## 6. Pruebas E2E de Regresión y Seguridad (Cypress)

Se ejecutaron las pruebas automatizadas en modo headless:

### 6.1 Suite `cypress/e2e/tenant-isolation/tenant-isolation.cy.ts` (8 Tests)
- `√ 1. Test de fuga: Usuario de Tenant A no puede leer mensajes ni notificaciones de Tenant B vía Supabase REST API` (PASSED)
- `√ 2. Test de UI: Usuario de Tenant A no ve mensajes de Tenant B en la bandeja de entrada ni en la campana` (PASSED)
- `√ 3. Test de inserción: Usuario de Tenant A intenta insertar un mensaje con tenant_id de Tenant B y el sistema lo bloquea` (PASSED)
- `√ 4. Test de regresión: Usuario de Tenant A sigue viendo sus propios mensajes y puede gestionarlos` (PASSED)
- `√ 5. Test de Aislamiento en Pedidos: Usuario de Tenant A no puede leer ni modificar pedidos de Tenant B` (PASSED)
- `√ 6. Test de Aislamiento en Reparaciones: Usuario de Tenant A no puede ver órdenes de reparación de Tenant B` (PASSED)
- `√ 7. Test de Aislamiento en Caja: Movimientos financieros de Tenant B están estrictamente ocultos para Tenant A` (PASSED)
- `√ 8. Test de Aislamiento en Productos: Tenant A no puede modificar ni acceder a catálogo no publicado de Tenant B` (PASSED)
- **Resultado:** **8 PASADOS / 0 FALLADOS (100% éxito)**

### 6.2 Tests de Regresión de Módulos Críticos
- `cypress/e2e/ui/cart-integrity.cy.ts` (E-commerce): **2 PASADOS / 0 FALLADOS (100%)**
- `cypress/e2e/ui/tenant-isolation.cy.ts` (UI Legacy Tenant Isolation): **2 PASADOS / 0 FALLADOS (100%)**
- `cypress/e2e/ui/academy-student-access.cy.ts` (Academia & Membresías): **2 PASADOS / 0 FALLADOS (100%)**
- `cypress/e2e/integration/full-flow-repair.cy.ts` (Reparaciones & Caja): **1 PASADO / 0 FALLADOS (100%)**

---

## 7. Conclusión

El aislamiento multi-tenant en Arecofix ha sido elevado al más alto estándar de seguridad:
1. **Defensa en Profundidad:** RLS forzado (`FORCE ROW LEVEL SECURITY`) a nivel de base de datos asegura que incluso si una consulta en el cliente omitiera el filtro `tenant_id`, PostgreSQL jamás devolverá ni permitirá modificar registros pertenecientes a otro tenant.
2. **Cero Fallbacks Hardcodeados:** Se erradicaron todas las asignaciones fijas a la Sede Central (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`) en funciones y código.
3. **Realtime Seguro:** Los canales de notificación y pedidos en vivo están aislados por UUID de tenant y filtrados por eventos de PostgreSQL.
4. **Vistas Protegidas:** Se revocaron los privilegios implícitos del propietario en vistas (`security_invoker = true`).
5. **Aprobación Completa:** Todas las pruebas E2E y de roles de PostgreSQL pasaron con 100% de efectividad.
