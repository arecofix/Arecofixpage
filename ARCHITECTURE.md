# Architecture Decisions & Multi-Tenant Isolation (ADR)

## ADR-001: Public Identity & Anti-Enumeration Design

### Context
In a multi-tenant SaaS architecture serving public storefronts alongside authenticated administrative backends, exposing base tables (`tenants`, `branches`) to unauthenticated `anon` roles represents a critical attack surface for cross-tenant credential and PII leakage (WhatsApp tokens, MercadoLibre tokens, bank information, tax IDs).

### Architectural Decisions

#### 1. Public Tenant Profile (`public.public_tenant_profile`)
- **Decision**: Explicitly accepted as publicly readable by `anon`, `authenticated`, and `service_role` through a secure view with `WITH (security_invoker = false)`.
- **Scope & Whitelist**: Projects strictly public metadata necessary for tenant branding and tenant resolution:
  - `id`, `name`, `slug`, `branding_settings`, `custom_domain`, `currency`, `is_active`, `created_at`, `updated_at`.
- **Security Boundary**: Runs as view owner (`security_invoker = false`) to allow anonymous resolution without granting any SELECT policy on base table `public.tenants`. Sensitive operational and integration columns (`tax_id`, `ml_*`, `whatsapp_*`, `owner_name`, `contact_email`, `contact_phone`) are strictly excluded from projection.

#### 2. Public Branch Resolution (`public.get_public_branch` RPC)
- **Decision**: Anti-enumeration pattern via Stored Procedure (`SECURITY DEFINER`).
- **Rationale**: Direct querying of `public_branch_profile` by `anon` or cross-tenant users without a specific slug filter could allow scrapers to enumerate all branch emails and phone numbers.
- **Enforcement**:
  - `public.public_branch_profile` is configured with `WITH (security_invoker = true)` and `GRANT SELECT` restricted to `authenticated` and `service_role` (REVOKED from `anon`). Authenticated users only see their own tenant's branches via `branches` RLS.
  - Anonymous storefront resolution MUST invoke `public.get_public_branch(p_slug text)`.
  - The RPC returns at most 1 matching row where `b.slug = p_slug AND b.is_active = true AND EXISTS(tenant activo)`.

#### 3. Decoupled Identity Resolvers (Clean Architecture)
- **`PublicBranchIdentityResolver`**: Domain `PublicBranchIdentity` resolved via RPC `get_public_branch`. Guaranteed to never contain `taxId` or `bankInfo`.
- **`AuthenticatedBranchIdentityResolver`**: Domain `AuthenticatedBranchIdentity` resolved via `branches` table under tenant-isolated authenticated RLS. Contains `taxId`, `bankInfo`, and `modulesConfig` for authorized tenant admins and operators.
- **Fiscal Compliance (Bloque 1.5)**: `taxId` is never resolved or used by the public storefront; receipt/invoice generation strictly requires valid 11-digit emitter CUIT from authenticated tenant context.

#### 4. Catalog Public Isolation
- **`public_brand_profile` & `public_category_profile`**: Strict whitelist views with `security_invoker = false` and `WHERE deleted_at IS NULL AND is_active = true`.
- **`get_public_services` & `get_public_courses`**: RPCs scoped by `p_tenant_slug` with anti-enumeration protection. Base tables `brands`, `categories`, `services`, `courses` have all `anon` select policies completely dropped.
