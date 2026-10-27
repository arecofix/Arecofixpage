# Changelog

All notable changes to the **Arecofix** project will be documented in this file.
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
- `course_enrollments_select_unified` policy reescrita con InitPlan escalar `(SELECT auth.*())`. Cierra el único `auth_rls_initplan` WARN residual a **0**. Migración `20261022080000_fix_auth_rls_initplan_course_enrollments.sql`.
- Sanitización de políticas en `storage.objects` (`receipts`, `avatars`, `evidence`) para garantizar llamadas escalares vía migración `20261022090000_harden_storage_receipts_initplan.sql`.
- Corregido reporte `Informe de Auditoría Forense R1–R4` que declaraba 0 cuando había 1 advertencia real post-R1.

### Added
- `docs/JUSTIFIED_WARNINGS_20261020.md` con evidencia ejecutable de las 3 categorías justificadas (`no_primary_key`, `unused_index`, `pg_graphql_*_table_exposed`).
- `scripts/audit_unused_indexes.mjs` para re-evaluación programada a 30 días (2026-11-20).

### Verified
- `auth_rls_initplan`: 1 → **0**.
- Cypress: 10/10. Jest: 276/276. Healthcheck: OK (0.69s).

## [1.0.3-linter-residual-remediation] - 2026-10-20

### 🛡️ Supabase Database Linter Residual Warnings Complete Eradication & Hardening

#### Reconciled & Audited
- **Linter Metric Discrepancy Forensics (`docs/LINTER_DISCREPANCY_20261020.md`)**:
  - Reconciled mathematical difference between previous aggregated report and official Supabase `splinter` output.
  - Resolved `cmd = 'ALL'` expansion into 4 distinct actions and `{public}` role expansion across cluster roles.

#### Fixed & Hardened (7 UP/DOWN Migrations)
- **R1: Multiple Permissive Policies Consolidated to 0 (`20261022010000`, `20261022020000`)**:
  - Consolidated 193 multiple permissive policy overlaps across 61 tables in `public` and `zarx` into unified single permissive policies per action/role using internal `OR` conditions.
  - Eliminated redundant `super_admin_all_access` policies on tables with pre-existing superadmin checks in tenant isolation.
  - Hardened `profiles` by removing 8 overlapping wildcard policies and establishing 4 atomic authenticated CRUD policies.
- **R2: Storage Bucket Listing Hardened to 0 (`20261022030000`)**:
  - Revoked broad `SELECT` policies on `storage.objects` for buckets with `public = true` (`course-covers`).
  - Scoped authenticated `SELECT` policies to object owners (`owner = (SELECT auth.uid())`) on `avatars`, `evidence`, `cv-generados`, and `academy_certificates`.
- **R3: Anon SECURITY DEFINER Functions Hardened to 0 (`20261022040000`)**:
  - Converted `get_current_tenant_id` and `get_request_guest_session` to `SECURITY INVOKER`.
  - Created isolated schema `private` (excluded from PostgREST).
  - Encapsulated `get_repair_tracking` and `get_public_certificate_data` in `private` with public `SECURITY INVOKER` wrappers.
- **R4: Authenticated SECURITY DEFINER Functions Hardened to 0 (`20261022050000`, `20261022060000`, `20261022070000`)**:
  - Converted 13 RLS/Auth helpers to `SECURITY INVOKER` (`is_admin`, `is_super_admin`, `get_auth_user_*`).
  - Encapsulated 13 business RPCs in `private` with public `SECURITY INVOKER` wrappers (`save_repair_order`, `submit_exam`, `create_guest_profile`, etc.).
  - Encapsulated 5 admin analytics functions in `private` with public `SECURITY INVOKER` wrappers (`get_admin_dashboard_analytics`, `get_admin_business_dashboard_metrics`, etc.).
  - Hardened schema `zarx` functions and revoked execution from authentication trigger `handle_new_user`.
- **InitPlan & Always-True Polish**:
  - Fixed initplan subquery scalar caching across certificate and exam submission policies (`((SELECT auth.jwt()) ->> 'email')`).
  - Hardened `post_comments_insert_unified` to validate pending status and tenant isolation.

#### Verified & Certified
- **Supabase Linter**: 0 P0/P1/P2 warnings (R1=0, R2=0, R3=0, R4=0, search_path=0, initplan=0, extensions=0, always_true=0).
- **Jest Unit Tests**: 50 suites, 276/276 passed (100%).
- **Business Health Check**: All revenue, repairs, orders, and database diagnostics 100% healthy in 0.83s.

---

## [1.2.0] - 2026-10-19

### 🛡️ Post-Incident CORS Verification, DB Optimization & P1 Backlog Completion

#### Added
- **Staging Infrastructure (FASE 0)**:
  - Isolated Supabase stack in VPS (`supabase-staging` on ports 5433 DB, 3001 PostgREST, 8002 Kong, 9998 Auth).
  - Sanitized public data clone from production (PII stripped).
  - Staging Angular SSR frontend service under PM2 (`arecofix-frontend-staging` on port 4001).
  - Automated deployment orchestrator `pnpm run deploy:staging` (`scripts/deploy-staging.mjs`).
  - Gated CI/CD pipeline in `.github/workflows/deploy.yml` (`test -> deploy:staging -> verify:staging -> [manual approval] -> deploy:prod`).
- **Database Compound Indexes (BLOQUE 2 / Cabo 8)**:
  - `idx_products_tenant_active_created` ON `products (tenant_id, is_active, created_at DESC) WHERE deleted_at IS NULL`.
  - `idx_products_tenant_active_deleted_created` ON `products (tenant_id, is_active, deleted_at, created_at DESC) WHERE deleted_at IS NULL`.
  - `idx_products_category` ON `products (category_id) WHERE deleted_at IS NULL`.
  - `idx_product_stock_branch_product` ON `product_stock_per_branch (product_id, branch_id)`.
  - `idx_orders_session_status_created` ON `orders (session_id, status, created_at DESC) WHERE deleted_at IS NULL`.
  - Comprehensive performance benchmark report in `docs/PERFORMANCE.md`.
- **Security & P1 Backlog (BLOQUE 3)**:
  - Cloudflare Turnstile server-side verification in `server/routes/services.routes.ts` (`cf-turnstile-response` validation against `challenges.cloudflare.com`).
  - Data privacy hardening: stripped internal telemetry (`ip_hash`, `user_agent`, `tenant_id`) from `POST /api/public/leads` response.
  - Dynamic SEO title resolver (`serviceTitleResolver`) in `public.routes.ts` providing synchronized SSR `<title>` and clean `<link rel="canonical">` without trailing slash.
  - Blog dual-mode rendering in `post-page.ts` / `.html` supporting both structured blocks and legacy HTML content.
  - Dynamic cross-selling block `service_list` in `block-renderer.component.ts` querying public catalog with active service exclusion.
- **Auditing & Tooling**:
  - Cypress E2E scoping test `cypress/e2e/cart/header-scoping.cy.ts` validating `x-guest-session` header isolation.
  - D1 failover worker healthcheck updated with `last_sync_at` and `stale` threshold evaluation.
  - Dev Kong configuration `infra/supabase/kong.dev.yml` and environment documentation `docs/KONG_ENVIRONMENTS.md`.

#### Changed
- Removed `http://localhost:4200` from production Kong CORS whitelist.
- Fixed `orders` cart sequential scan by indexing `session_id`.
- Optimized `products` catalog execution time from 16.96ms (up to 7,400ms under load) down to 0.614ms (buffers reduced by 96.8%).
- Total test suite expanded to 49 suites / 268 tests passing green.

---

## [1.1.0] - 2026-10-18

### 🚀 Services Landing Page Creator & Modular Block Engine (Fases 1 a 8)

#### Added
- **Database Architecture & Migrations (PostgreSQL/Supabase)**:
  - Safety backups created prior to DDL: `services_backup_20261018` and `blog_posts_backup_20261018`.
  - Reversible migrations: `20261018060000_services_landing_creator_and_blocks.sql` and `20261018070000_services_refinements_and_rls_hardening.sql` with full `_down.sql` rollback companions.
  - Evolved `public.services` table: added `base_price`, `hero_image_url`, `short_description`, `long_description`, `price_currency`, `is_quotable`, `is_bookable`, `is_published`, `template_slug`, `seo_title`, `seo_description`, `canonical_url`, `og_image_url`, `published_at`, `deleted_at`.
  - Added `scope` (`'product' | 'service' | 'both'`) to `public.categories`.
  - Created polymorphic blocks table: `public.service_blocks` (`owner_type IN ('service','post')`) supporting 10 distinct block types with JSONB content.
  - Created `public.service_features`, `public.service_leads`, and `public.slug_redirects`.
  - Enforced strict Row Level Security (RLS) policies: `anon` users can only read published active services and cannot read leads or unconfirmed data. Authenticated administrative users have scoped tenant CRUD access.
- **Clean Architecture Domain (`src/app/features/services/`)**:
  - Value Objects: `Slug` (kebab-case normalization, collision handling), `Money` (currency formatting, "Consultar" fallback for nulls), `SeoMeta` (length limits, SERP fallbacks).
  - Domain Entities: `Service`, `ServiceBlock`, `ServiceFeature`, `ServiceLead`, `SlugRedirect`.
  - Validation: Strict Zod schemas (`block-schemas.ts`) validating 10 block types (`hero`, `features`, `rich_text`, `gallery`, `cta`, `faq`, `testimonials`, `contact`, `map`, `service_list`).
  - Repositories & Supabase Implementations: `SupabaseServiceRepository`, `SupabaseServiceBlockRepository`, `SupabaseServiceLeadRepository`.
  - Application Use Cases & Facade: `CreateServiceUseCase`, `UpdateServiceUseCase`, `PublishServiceUseCase`, `UnpublishServiceUseCase`, `DuplicateServiceUseCase`, `GetPublicServiceBySlugUseCase`, `ListPublicServicesUseCase`, `UpsertBlocksUseCase`, `ReorderBlocksUseCase`, `DeleteBlockUseCase`, `CreateLeadUseCase`, `ListLeadsUseCase`, `UpdateLeadStatusUseCase`.
  - Mappers: `ServiceMapper` with Schema.org graph builder (`Service`, `LocalBusiness`, `BreadcrumbList`), `BlockMapper`, `LeadMapper`.
- **Backend Express & SSR Middleware**:
  - Express endpoints mounted in `server/routes/services.routes.ts`:
    - Admin CRUD for services, blocks, and leads.
    - Public endpoints: `GET /api/public/services`, `GET /api/public/services/:slug`.
    - Lead capture: `POST /api/public/leads` with honeypot, Cloudflare Turnstile token validation, 5 req/hour rate limiting per SHA-256 IP hash, and admin email dispatch.
    - Healthcheck endpoint: `GET /health/services` verifying schema health and RLS enforcement.
  - 301 Permanent Redirect middleware in `server.ts` powered by `slug_redirects`.
  - Dynamic XML Sitemap generator in `server/routes/sitemap.routes.ts` indexing published services and blog posts with `lastmod`.
- **Frontend Components & Admin Suite**:
  - `BlockRendererComponent`: Standalone, hydration-safe renderer for all 10 block types with responsive Tailwind/DaisyUI styling.
  - `BlocksEditorComponent`: Reusable block builder featuring Angular CDK drag-and-drop reordering, dynamic block forms, autosave (500ms debounce), and side-by-side live preview using `BlockRendererComponent`.
  - `ServiceEditorComponent`: 5-tab back-office editor (Content, Blocks, SEO with Google SERP preview, Operational, Leads).
  - `AdminServicesPage`: Redesigned administrative catalog with multi-column filtering, search, badges, and quick actions.
  - `AdminLeadsPage`: Dedicated leads management dashboard with inline status changes and one-click WhatsApp web direct links.
  - Blog Post Editor Integration: Non-breaking dual-mode tab in `AdminPostFormPage` enabling block editing while preserving `content TEXT`.
  - Public Landings: `PublicServicesListComponent` (`/servicios`) and `PublicServiceDetailComponent` (`/servicios/:slug`) with complete SSR hydration safety and dynamic JSON-LD injection.
- **Testing & QA**:
  - Unit test suites covering Value Objects, Use Cases, Mappers, Zod Validators, Components (35 passing unit tests).
  - Cypress E2E comprehensive test suite (`cypress/e2e/services/services-landing-creator.cy.ts`) covering draft creation, publication, SSR meta tags, lead capture, 301 redirects, unpublishing (404), duplication, and validation errors.
- **Documentation**:
  - `docs/SERVICES_AUDIT.md`: Forensic audit report and decision record.
  - `docs/SERVICES_ARCHITECTURE.md`: Architecture specification with Mermaid UML sequence, component, and ER diagrams.
  - `docs/SERVICES_RLS.md`: Comprehensive security review of Row Level Security policies.
  - `docs/SERVICES_SEO.md`: Technical SEO, JSON-LD Schema graph, and indexing guide.
  - `docs/SERVICES_EDITOR.md`: End-user guide for workshop staff on creating and publishing service landings.

#### Changed
- Renamed columns in `public.services`: `price` to `base_price` and `image_url` to `hero_image_url`.
- Extended `server.ts` to include `/servicios` and `/servicios/:slug` in valid prefix routing and SSR render passes.
