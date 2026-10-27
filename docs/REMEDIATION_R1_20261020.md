# Remediación Bloque R1: `multiple_permissive_policies`

**Proyecto**: Arecofix SaaS Multi-Tenant Ecosystem  
**Fecha**: 20 de Octubre de 2026  
**Responsables**: Performance Engineer, DBA Senior, SRE Senior  
**Estado**: **Cerrado al 100% (0 Warnings Residuales)**

---

## 1. Resumen Ejecutivo

El linter de Supabase (`splinter`) reportaba **193 advertencias de políticas permisivas múltiples** distribuidas en 61 tablas de los esquemas `public` y `zarx`.

En PostgreSQL RLS, cuando múltiples políticas permisivas coexisten para la misma acción (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) y rol (`anon`, `authenticated`), el motor de base de datos compila cada política como una condición separada y las combina mediante operadores `OR`:
$$\text{Filtro RLS} = \text{Policy}_1 \lor \text{Policy}_2 \lor \dots \lor \text{Policy}_n$$

Esto provoca:
1. **Degradación de rendimiento**: Evaluación repetida de funciones en cada fila escaneada.
2. **Planes de ejecución subóptimos**: Incapacidad del optimizador para usar índices cuando se mezclan condiciones complejas.
3. **Superficie de auditoría confusa**: Dificultad para determinar qué política otorgó el acceso a un registro.

### Causa de la Discrepancia Previa
El reporte inicial de remediación declaró únicamente 34 advertencias porque agrupaba por `cmd = 'ALL'` sin expandir dicho comando a las cuatro acciones atómicas que afecta (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) ni expandir la pseudo-función de roles `{public}` a todos los roles del cluster (`anon`, `authenticated`, `authenticator`, `dashboard_user`).

---

## 2. Estrategia de Consolidación Aplicada

Se implementó el **Patrón A (Consolidación Unificada con OR Interno)** y **Patrón B (Políticas de Escritura Acotadas)**:

### 2.1. Batch 1 (`20261022010000_consolidate_permissive_policies_batch1.sql`)
- **27 Tablas Estándar**: `audit_logs`, `auth_logs`, `bank_reconciliations`, `customer_devices`, `invoices`, `page_templates`, `pages`, `purchase_items`, `repair_images`, `repair_number_sequences`, `repair_parts_used`, `repair_status_history`, `stock_history`, `technical_solutions`, `purchases`, `cash_movements`, `suppliers`, `blog_categories`, `blog_post_tags`, `blog_posts`, `blog_tags`, `brands`, `categories`, `models`, `product_images`, `product_reviews`, `repair_status_types`.
- **Acción**:
  - Eliminación de la política redundante `super_admin_all_access` en tablas donde la política de aislamiento multi-tenant ya incluía `OR is_super_admin()`.
  - Consolidación de aislamiento para staff, tenant owner y superadmin en una única política permisiva por tabla (`purchases`, `cash_movements`, `suppliers`).
  - Restricción de políticas de administración de `ALL` a `INSERT`, `UPDATE`, `DELETE` en tablas con lectura pública o anónima (`brands`, `categories`, `repair_status_types`).

### 2.2. Batch 2 (`20261022020000_consolidate_permissive_policies_batch2.sql`)
- **34 Tablas Complejas y Especializadas**:
  - **Academia**: `academy_payments`, `academy_plans`, `academy_subscriptions`, `course_certificates`, `course_enrollments`, `course_exam_submissions`, `course_instructors`, `course_lessons`, `course_modules`, `courses`, `educacion_y_skills`, `experiencia_laboral`.
  - **Servicios y Contenidos**: `service_blocks`, `service_categories`, `service_features`, `service_leads`, `services`, `slug_redirects`, `post_comments`.
  - **Operaciones y Seguridad**: `notifications`, `contact_messages`, `product_stock_per_branch`, `role_permissions`, `roles`.
  - **Núcleo Transaccional y Perfiles**: `order_items`, `orders`, `payments`, `repairs`, `branches`, `tenants`, `profiles`.
  - **Zarx**: `zarx.active_news`, `zarx.public_alerts`, `zarx.zones`, `zarx.profiles`.
- **Acción**:
  - Consolidación de políticas dispersas de carritos de compras, pedidos de clientes y gestión de staff en `orders` y `order_items`.
  - Sustitución de 8 políticas heredadas en `profiles` por 4 políticas unificadas y estrictas para `{authenticated}` (SELECT, INSERT, UPDATE, DELETE).
  - Eliminación de comodines `TO public` que contaminaban a roles no operativos.

---

## 3. Matriz de Resultados Antes vs. Después

| Métrica | Estado Inicial (Volcado Residual) | Post Batch 1 | Post Batch 2 & Limpieza | Estado Final |
| :--- | :---: | :---: | :---: | :---: |
| **Advertencias `multiple_permissive_policies`** | **193** | 94 | **0** | **0 (100% Cerrado)** |
| **Tablas con Advertencias** | **61** | 34 | **0** | **0** |
| **Roles Afectados** | `anon`, `authenticated`, `authenticator`, `dashboard_user` | `authenticated` | **Ninguno** | **0** |

---

## 4. Query de Validación Definitiva

```sql
SELECT count(*) AS total_overlaps, count(DISTINCT tablename) AS distinct_tables
FROM (
  SELECT schemaname, tablename, action, role, count(*) AS n
  FROM (
    SELECT b.schemaname, b.tablename, b.policyname, act.action, r.role
    FROM pg_policies b
    CROSS JOIN LATERAL unnest(CASE WHEN b.cmd = 'ALL' THEN ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'] ELSE ARRAY[b.cmd] END) AS act(action)
    CROSS JOIN LATERAL unnest(CASE WHEN b.roles = ARRAY['public'::name] THEN ARRAY['anon'::name, 'authenticated'::name, 'authenticator'::name, 'dashboard_user'::name] ELSE b.roles END) AS r(role)
    WHERE b.schemaname IN ('public', 'zarx') AND b.permissive = 'PERMISSIVE'
  ) AS expanded
  GROUP BY schemaname, tablename, action, role
  HAVING count(*) > 1
) AS overlap_records;
```

**Resultado en Producción (`db.arecofix.com.ar`)**:
```
 total_overlaps | distinct_tables 
----------------+-----------------
              0 |               0
(1 row)
```
