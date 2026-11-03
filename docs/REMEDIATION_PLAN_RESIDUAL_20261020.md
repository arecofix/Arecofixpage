# Plan de Remediación de Warnings Residuales del Supabase Database Linter

**Proyecto**: Arecofix SaaS Multi-Tenant Ecosystem  
**Fecha**: 20 de Octubre de 2026  
**Versión**: 1.0.0-RESIDUAL-PLAN  
**Alcance**: Producción (`db.arecofix.com.ar`, puerto 5432) y Staging (`supabase-staging-db`, puerto 5433)  
**Objetivo**: Erradicar el 100% de advertencias residuales en 4 categorías detectadas por el linter oficial.

---

## 1. Inventario de Bloques y Prioridades de Remediación

```
   ┌────────────────────────────────────────────────────────┐
   │ PRIORIDAD P0: R3 — anon SECURITY DEFINER Functions     │
   │ (Rediseño con Esquema 'private' + Wrappers Invoker)    │
   └───────────────────────────┬────────────────────────────┘
                               │
   ┌───────────────────────────▼────────────────────────────┐
   │ PRIORIDAD P1: R2 — Storage Bucket Listing Policies     │
   │ (Remoción de SELECT amplio y scoping por owner/admin)  │
   └───────────────────────────┬────────────────────────────┘
                               │
   ┌───────────────────────────▼────────────────────────────┐
   │ PRIORIDAD P1: R4 — authenticated SECURITY DEFINER      │
   │ (Helpers a INVOKER; RPCs de negocio y analytics a     │
   │  esquema 'private' con wrappers INVOKER y validación)  │
   └───────────────────────────┬────────────────────────────┘
                               │
   ┌───────────────────────────▼────────────────────────────┐
   │ PRIORIDAD P2: R1 — multiple_permissive_policies        │
   │ (Consolidación sistemática de 193 políticas en         │
   │  políticas únicas unificadas con OR interno)           │
   └────────────────────────────────────────────────────────┘
```

| Bloque | Categoría Linter | Severidad | Warnings Reales | Estrategia de Remediación | Archivos de Migración |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **R3** | `anon_security_definer_function_executable` | **Crítica (P0)** | 4 | 2 helpers a `SECURITY INVOKER`. 2 endpoints públicos a `private.*` (DEFINER) con wrapper público `SECURITY INVOKER`. | `20261022040000_harden_anon_security_definer.sql` (+ `_down.sql`) |
| **R2** | `public_bucket_allows_listing` | **Alta (P1)** | 5 | Dropear SELECT masivo en buckets públicos. En buckets privados/usuario (`avatars`, `evidence`, `cv-generados`, `academy_certificates`), scoping estricto `owner = (SELECT auth.uid())::text OR is_admin()`. | `20261022030000_harden_storage_listing_policies.sql` (+ `_down.sql`) |
| **R4** | `authenticated_security_definer_function_executable` | **Alta (P1)** | 35 | **Grupo A (13 helpers)**: a `SECURITY INVOKER`.<br>**Grupo B (13 RPCs)**: a `private.*` (DEFINER) + wrapper público `SECURITY INVOKER`.<br>**Grupo C (5 analytics)**: a `private.*` (DEFINER con verificación admin) + wrapper público `SECURITY INVOKER`. | `20261022050000_harden_authenticated_definer_groupA.sql`<br>`20261022060000_harden_authenticated_definer_groupB.sql`<br>`20261022070000_harden_authenticated_definer_groupC.sql` |
| **R1** | `multiple_permissive_policies` | **Media (P2)** | 193 | Fusión de políticas permisivas redundantes en políticas unificadas con `OR` interno por tabla y rol (`authenticated` y `anon`). | `20261022010000_consolidate_permissive_policies_batch1.sql`<br>`20261022020000_consolidate_permissive_policies_batch2.sql` |

---

## 2. Metodología de Ejecución Zero-Downtime

1. **Backup Físico de Seguridad**: Generación de volcado binario en el host VPS antes de aplicar en producción.
2. **Dry-Run en Staging**: Aplicación secuencial UP y verificación DOWN de reversión en `supabase-staging-db`.
3. **Aplicación en Producción**: Ejecución transaccional (`BEGIN ... COMMIT`) bajo el rol superusuario `supabase_admin`.
4. **Recarga de PostgREST**: Envío de señales `NOTIFY pgrst, 'reload schema';` y `NOTIFY pgrst, 'reload config';`.
5. **Validación de Regresión**:
   - `node scripts/verify-schema.mjs`: Contrato de esquema 100% OK.
   - `node scripts/healthcheck.mjs`: Servidor online y latency < 700ms.
   - `node scripts/dashboard-healthcheck.mjs`: Sincronización de analíticas y cache hit 99.99%.
   - `pnpm test`: 276/276 tests pasando en Jest.
   - Linter post-audit: Verificación de 0 warnings en R1, R2, R3, R4.
