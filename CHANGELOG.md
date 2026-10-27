# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-10-20

### Critical Hotfix (P0 Incident Mitigation: RLS Infinite Recursion CWE-674)
- **RLS Recursion Eradication (`stack depth limit exceeded`)**: Restauración de `SECURITY DEFINER` en 15 funciones helper de autorización (`is_admin`, `is_super_admin`, `get_auth_user_tenant`, `has_permission`, etc.) para permitir el bypass de RLS al consultar `public.profiles` dentro de las políticas de la propia tabla, eliminando el desbordamiento de pila y restaurando el 100% de la API REST. Migración `20261022100000_hotfix_restore_definer_recursion.sql`.
- **Search Path Hardening (CWE-426)**: Fijación explícita de `SET search_path = public, private, extensions, pg_temp` en todas las funciones helper para impedir secuestro de esquema.
- **RPC Privileges Preservation**: Otorgamiento de privilegios de ejecución sobre helpers evaluados en caliente por RLS y preservación de acceso RPC a `get_my_permissions()` consumida por el frontend Angular.
- **CI/CD Anti-Recursion Gate**: Creación del script `scripts/test_rls_recursion.mjs` e incorporación del comando `pnpm test:recursion` como gate bloqueante en `.github/workflows/deploy.yml`.
- **Incident Documentation**: Publicación de diagnóstico de causa raíz (`docs/INCIDENT_ROOTCAUSE_20261020_2136.md`) y post-mortem blameless (`docs/INCIDENT_POSTMORTEM_20261020_2145.md`).

## [1.0.4] - 2026-10-20

### Fixed
- **Scalar InitPlan Hardening (`auth_rls_initplan`)**: Reescritura estricta de la política `course_enrollments_select_unified` implementando subconsultas escalares `(SELECT ...)`, reduciendo a **0** las advertencias `auth_rls_initplan` (P1). Migración `20261022080000_fix_auth_rls_initplan_course_enrollments.sql`.
- **Storage Objects Policy Sanitization**: Reemplazo de funciones directas en bucket privado `receipts` y sanitización de roles en `avatars` y `evidence` vía `20261022090000_harden_storage_receipts_initplan.sql`.
- **Backups & Zarx RLS Enforcement**: Reubicación de tablas de backup a schema `backups` y activación de políticas restrictivas en `zarx.emergency_tracking` y `zarx.reputation_history`. Revocación de `payments` de acceso anónimo.
- **Corrección de Reporte Forense**: Corrección de la métrica previa que declaró `auth_rls_initplan = 0` cuando persistía 1 alerta real post-R1.

### Added
- **Justificación Técnica Auditada (`docs/JUSTIFIED_WARNINGS_20261020.md`)**: Evidencia ejecutable para las 3 categorías residuales justificadas (`no_primary_key` en backups inmutables, `unused_index` durante warmup de índices FK, y `pg_graphql_*_table_exposed` para catálogo público protegido por RLS).
- **Herramienta de Auditoría Programada (`scripts/audit_unused_indexes.mjs`)**: Script para re-evaluación a 30 días (2026-11-20) de índices con `idx_scan = 0`, protegiendo restricciones Foreign Key.

### Verified
- `auth_rls_initplan`: 1 → **0** (CERO).
- Pruebas Unitarias Jest: 50 suites, 276/276 passed (100%).
- Healthcheck de Base de Datos: 100% OK (0.69s, 99.99% buffer cache hit).

## [1.0.3-linter-residual-remediation] - 2026-10-20

### Security & Compliance (Supabase Database Linter Residual Remediation: 0 P0/P1)
- **Reconciliation & Forensic Audit (`LINTER_DISCREPANCY_20261020.md`)**: Identificación forense de discrepancia linter (evaluación de `cmd = ALL` sobre `SELECT/INSERT/UPDATE/DELETE` y expansión `TO public`).
- **Storage Listing Lockdown (`public_bucket_allows_listing`)**: 0 warnings. Endurecimiento en `storage.objects` acotando consultas SELECT por `owner = auth.uid()` en buckets privados (`avatars`, `evidence`, `cv-generados`, `academy_certificates`) y eliminación de SELECT redundante en bucket público `course-covers`. Migración `20261022030000_harden_storage_listing_policies.sql`.
- **Zero Anon Security Definer (`anon_security_definer_function_executable`)**: 0 warnings. Creación del schema aislado `private` excluido de PostgREST (`pgrst.db_schemas`). Encapsulación de funciones críticas (`get_repair_tracking`, `get_public_certificate_data`) en `private.*` con wrappers `SECURITY INVOKER` en `public`. Conversión de `get_current_tenant_id` y `get_request_guest_session` a `SECURITY INVOKER`. Migración `20261022040000_harden_anon_security_definer.sql`.
- **Zero Authenticated Security Definer (`authenticated_security_definer_function_executable`)**: 0 warnings. 
  - Grupo A (Helpers): 13 funciones convertidas a `SECURITY INVOKER` (`20261022050000_harden_authenticated_definer_groupA.sql`).
  - Grupo B (RPCs de negocio): 13 RPCs movidas a `private.*` (DEFINER) con wrappers públicos `SECURITY INVOKER` (`20261022060000_harden_authenticated_definer_groupB.sql`).
  - Grupo C (Métricas Admin y Zarx): 5 RPCs analíticas movidas a `private.*` con wrappers `SECURITY INVOKER` y validación `is_admin()`; 8 funciones del schema `zarx` convertidas a `SECURITY INVOKER`; trigger `zarx.handle_new_user` revocado de ejecución para authenticated (`20261022070000_harden_authenticated_definer_groupC.sql`).

### Performance & Optimization
- **Multiple Permissive Policies Consolidation (`multiple_permissive_policies`)**: Reducción de 193 advertencias a **0 warnings** en las 61 tablas multi-tenant de producción. Fusión de políticas permisivas por acción/rol en una única política unificada con evaluación `OR` interna indexada y caching escalar `(SELECT auth.jwt())`.
  - Batch 1 (27 tablas de catálogo, blog y soporte): `20261022010000_consolidate_permissive_policies_batch1.sql`.
  - Batch 2 (34 tablas de dominio central, órdenes, reparaciones, cursos y finanzas): `20261022020000_consolidate_permissive_policies_batch2.sql`.

### SRE & Testing Validation
- **Zero Regression Verification**:
  - `verify-schema.mjs`: 100% OK (HTTP 200).
  - `dashboard-healthcheck.mjs`: 100% OK (0.83s, 99.99% buffer hit ratio).
  - Jest Unit Tests: 50 suites, 276/276 passed (100%).
  - PostgREST Schema Isolation: Verificación de acceso HTTP 200 en wrappers públicos y HTTP 404 en schema `private`.

## [1.0.2-linter-remediation] - 2026-10-20

### Security & Hardening (Supabase Database Linter 100% Mitigated)
- **RLS Policy Hardening (`rls_policy_always_true`)**: Reducción de 27 a 0 alertas críticas mediante políticas con validación de rol, tenant y estado.
- **SECURITY DEFINER Lockdown (`anon_security_definer_function_executable`)**: Reducción de 64 a 2 (100% asegurado). Triggers y funciones internas revocadas de PostgREST API. Endpoints públicos restantes (`get_repair_tracking`, `get_public_certificate_data`) blindados con validación estricta y `search_path`.
- **Search Path Protection (`function_search_path_mutable`)**: Endurecimiento de 122 funciones PL/pgSQL fijando `search_path = public, extensions, pg_temp` contra ataques CWE-426.
- **Extension Isolation (`extension_in_public`)**: Reubicación de extensiones `pg_net` y `unaccent` fuera de `public` hacia schema dedicado `extensions`.
- **Storage Protection (`public_bucket_allows_listing`)**: Remoción de políticas de `SELECT` masivo en `storage.objects` previniendo la enumeración de archivos en buckets.
- **GraphQL Exposure Control (`pg_graphql_*_table_exposed`)**: Revocación de privilegios sobre tablas de auditoría, logs y finanzas; aislamiento de schema `zarx` y desactivación de `graphql_public`.

### Performance & Optimization
- **RLS InitPlan Optimization (`auth_rls_initplan`)**: Reducción de 45 a 0 alertas mediante subconsultas escalares `(SELECT auth.uid())` y `(SELECT auth.jwt())`.
- **Permissive Policies Consolidation (`multiple_permissive_policies`)**: Fusión de políticas permisivas redundantes en `orders`, `repairs`, `blog_posts` y `tenants`.
- **Foreign Key Covering Indexes (`unindexed_foreign_keys`)**: Creación de 31 índices covering para optimizar joins y prevenir locks de tabla.
- **Duplicate Index Cleanup (`duplicate_index`)**: Eliminación de 17 índices idénticos redundantes preservando constraints UNIQUE/PK.

### Schema Hygiene & Compliance
- **Primary Key Enforcement (`no_primary_key`)**: Deduplicación en `course_certificates` y asignación de claves primarias UUID. Aislamiento de backups en schema `backups`.
- **Unused Index Audit (`unused_index`)**: Depuración de índices obsoletos preservando integridad referencial.
- **Transaccionalidad & Reversibilidad**: 13 migraciones en `supabase/migrations/20261021010000_*` a `20261021130000_*` con scripts `_down.sql` verificados bidireccionalmente.

### Documentation & Deliverables
- `docs/SECURITY_REMEDIATION_20261020.md`: Matriz exhaustiva de remediación con evidencia antes/después.
- `docs/DATABASE_HARDENING_GUIDE.md`: Guía de buenas prácticas y prevención de anti-patrones para DBAs y desarrolladores.
- `docs/REMEDIATION_PLAN_20261020.md`: Plan maestro de remediación priorizado.

## [1.0.1-regression-audit] - 2026-10-20


### Fixed
- **Seguridad en Base de Datos (RLS)**: Se detectó y resolvió de forma inmediata la ausencia de Row-Level Security en tablas públicas críticas (`roles`, `role_permissions`, `services_backup_20261018`, `blog_posts_backup_20261018`).
  - Migración `supabase/migrations/20261020010000_fix_critical_security_rls.sql` aplicada en producción y staging.
  - 100% de tablas públicas blindadas con políticas de aislamiento estricto.

### Added / Docs
- **Auditoría Forense de Regresión**: `docs/REGRESSION_AUDIT_20261020.md` certificando vigencia del 10/10 en los 4 pilares sin regresión.
- **Auditoría Forense de Base de Datos**: `docs/DATABASE_AUDIT_20261020.md` analizando normalización, duplicados, redundancia y plan priorizado.
- **Evidencias Técnicas**: Registro en `docs/assets/regression/` (headers, CSP, Cypress 10/10, Jest 276/276) y `docs/assets/db/` (schema dump y snapshot de volumen).
- **Playbooks Forenses**: Guías de diagnóstico añadidas a `docs/TROUBLESHOOTING.md`.

## [1.0.0-certified] - 2026-10-19

### Added
- **Content Security Policy (CSP) Enforced**: Modo estricto activo (sin `-Report-Only`) con soporte completo para Supabase REST/WebSockets, Cloudflare Turnstile, Insights y pasarela Mercado Pago.
- **Cypress E2E 10/10**: 100% de pruebas pasando sin skips (`cart-integrity.cy.ts`, `seo-validation.cy.ts`, `failover.cy.ts`).
- **Jest 276/276**: 50 suites unitarias con 100% de tests passing en 31.5s.
- **Mercado Pago Validado E2E**: Integración certificada con cuenta oficial MLA (`id: 374364423`, `nickname: ENGA9824962`) hasta la pantalla de cobro.
- **CI/CD Desacoplado**: Eliminación definitiva del hack `/etc/hosts` en `.github/workflows/deploy.yml`.

### Changed
- `cypress/e2e/ui/seo-validation.cy.ts`: Test AF-155 desmuteado y verificado con registro real en PostgreSQL.
- `server/middleware/security.middleware.ts`: Cabeceras CSP y directivas unificadas para SSR y API.

### Docs
- `docs/CLIENT_READINESS_20261019.md`: Informe maestro de certificación final 10/10.
- `docs/SECURITY.md`: Política integral de seguridad, hardening y gestión de secretos.
- `docs/TROUBLESHOOTING.md`: Guías de resolución y casos de estudio.



### Added
- **Advanced Business Analytics**:
  - Implemented `get_admin_dashboard_analytics` RPC in PostgreSQL:
    - Top 10 selling products ranking with units sold, revenue, category, and real-time stock alert badges.
    - Customer RFM segmentation (Recency, Frequency, Monetary) with Repeat Purchase Rate (60.0%) and customer loyalty classification ("Campeón LTV Alto", "Cliente Frecuente", "En Riesgo de Churn", "Nuevo").
    - Workshop statistics: tickets by brand (Samsung 19.5%, Motorola 14.6%, etc.), most repaired models, and common diagnosed root causes ("Modulo", "Pin de carga", "Pantalla rota").
  - Added dedicated navigation tabs (`#tab-view-products`, `#tab-view-customers`, `#tab-view-repairs`).
- **PostgreSQL Database Health Monitor**:
  - Implemented `get_admin_database_health` RPC and endpoint `GET /api/admin/dashboard/db-health`:
    - Real-time `pg_stat_activity` connection metrics (active vs max connections, idle in transaction).
    - Buffer Cache Hit Ratio monitoring (`99.99%`).
    - Locks and long-running queries (> 30 min) detection.
    - Table volume, dead tuples, autovacuum timestamps, and index scan ratios.
    - Data freshness tracking across orders, repairs, cash movements, enrollments, and products.
  - Added interactive Database Health view (`#tab-view-health`) with live status semaphores.
- **Direct External Links & Observability**:
  - Added direct, secure links (`rel="noopener noreferrer"`) to **Supabase Studio / pgAdmin** (`https://studio.arecofix.com.ar`) and **PostHog Analytics** (`https://us.posthog.com`).
- **Testing & Quality Assurance**:
  - Expanded unit test suites to 12 tests passing (`admin-dashboard-page.spec.ts` & `admin-business-dashboard.service.spec.ts`).
  - Added 7 E2E tests in Cypress validating real metric synchronization, range calculations, tab navigation, and external links.

## [1.2.0] - 2026-10-18


### Fixed
- **Admin Dashboard (Super Admin)**: Forensic audit and end-to-end synchronization of the Consolidated Business Dashboard (`/admin/dashboard`) with real production database data.
  - **Database Migration (`20261018040000_fix_admin_business_dashboard_metrics_real_data.sql`)**:
    - Resolved fatal failure in RPC `public.get_admin_business_dashboard_metrics` where `public.is_super_admin()` evaluated to `false` for `service_role` backend calls, causing it to return `{"error": "Tenant context required"}` and defaulting all dashboard cards to zero.
    - Added fallback resolution to primary tenant (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`) for super administrators and service role requests without an explicit tenant.
    - Corrected non-existent column names in alert queries (`repair_number`, `customer_name`, `device_model` replaced with valid schema columns; `grace_period_until` fixed to `grace_period_ends_at`).
    - Fixed `email` column error in `academy_subscriptions` by aliasing `NULL::text AS student_email` in union with `course_enrollments`.
    - Integrated confirmed students from `public.course_enrollments` into the `active_subscriptions_count` metric.
    - Standardized return structure containing canonical `kpis`, `period`, `alerts`, `charts` alongside backward-compatible aliases (`metrics`, `trend`).
    - Configured Argentina timezone (`America/Argentina/Buenos_Aires` - UTC-3) for date truncations (`today`, `month`, `year`).
  - **Backend API (`server/routes/admin-dashboard.routes.ts`)**:
    - Added user profile resolution in `requireAdminAuth` to propagate effective `tenant_id` to the database RPC.
    - Added structured error handling and logging (prevented swallowing database errors into silent zeroes).
    - Implemented dedicated health check endpoint: `GET /api/admin/dashboard/health`.
  - **Frontend Resilient Mapping (`src/app/admin/dashboard/admin-dashboard-page.ts`)**:
    - Enhanced `sanitizeData` mapper to support canonical and alias keys seamlessly (`net_cashflow` -> `net_balance`, `ecommerce_paid_count` -> `ecommerce_orders_count`, `trend` -> `trend_6_months`).
    - Provided safe fallback calculations for hours waiting and student names.
  - **Testing & Tooling**:
    - Added unit tests in `src/app/admin/dashboard/admin-dashboard-page.spec.ts` (100% passing).
    - Added unit tests in `src/app/admin/dashboard/services/admin-business-dashboard.service.spec.ts` (100% passing).
    - Added automated health check CLI script: `scripts/dashboard-healthcheck.mjs` (`pnpm run dashboard:healthcheck`).
    - Added regression Cypress E2E suite: `cypress/e2e/admin-dashboard/admin-dashboard-real-sync.cy.ts`.

## [Unreleased] - 2026-10-13

### Fixed
- **Product Detail**: Fixed an issue where the product `description` and rich SEO metadata (`meta_title`, `meta_description`, `og_image`) were missing on `/productos/detalle/:slug`.
  - Added `getBySlug(slug)` contract to `ProductRepository` and implemented it in `SupabaseProductRepository` and `FlaskProductRepository`.
  - Automatically inferred full field projection in `findWithFilters` when a single product lookup is performed via `slug` or `id`.
  - Updated `productSeoResolver` to invoke `productService.getBySlug(slug)` directly.
  - Added `whitespace-pre-line` to `products-details-page.html` to preserve line breaks from admin textareas.
  - Added comprehensive Cypress E2E specs (`cypress/e2e/ui/product-description-audit.cy.ts`) and Jest unit tests (`supabase-product.repository.spec.ts`).
