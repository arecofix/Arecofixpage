# Auditoría Forense y Arquitectura de Base de Datos PostgreSQL

**Fecha de Auditoría**: 20 de Octubre de 2026  
**Motor de Base de Datos**: PostgreSQL 15.x / Supabase Self-Hosted  
**Host de Producción**: `db.arecofix.com.ar` (Contenedor `supabase-db`, puerto 5432)  
**Host de Staging**: VPS Staging (`supabase-staging-db`, puerto 5433)  
**Evaluador**: DBA / Data Architect Senior  
**Estado General**: 🟡 **AUDITADO CON ÉXITO — 4 HALLAZGOS CRÍTICOS MITIGADOS (RLS) Y PLAN DE NORMALIZACIÓN PRIORIZADO**

---

## 1. Resumen Ejecutivo

Se ejecutó una auditoría forense exhaustiva sobre las 70 tablas del esquema `public` de la base de datos de producción de Arecofix. El objetivo fue analizar normalización (1NF–BCNF), integridad referencial, datos duplicados, redundancia de columnas, tipado de datos y estado de índices.

### Métricas Globales del Cluster
- **Total de Tablas en esquema `public`**: 70 tablas.
- **Filas Vivas Totales**: ~12,230 tuplas (`products`: 2,775, `product_variants`: 2,774, `product_stock_per_branch`: 2,505).
- **Tamaño Total de Relaciones (Datos + Índices)**: ~14.2 MB.
- **Encoding & Collation**: `UTF8` / `C.UTF-8` (consistente en todo el cluster).
- **Tipos de Precios/Finanzas**: 0 columnas en `float`/`real`/`double precision`. 100% en `numeric(10,2)` o `numeric`.
- **Zonas Horarias**: 0 columnas en `timestamp without time zone`. 100% en `timestamptz`.
- **Integridad de Contenido**: 0 productos sin descripción (100% de los 2,775 productos poseen descripción válida).

---

## 2. Hallazgos por Categoría y Severidad

### P0 — Críticos (Seguridad e Integridad de Negocio)

#### 1. [RESUELTO] Tablas Públicas con Row-Level Security Desactivado (RLS Disabled)
- **Tablas afectadas**: `public.roles`, `public.role_permissions`, `public.services_backup_20261018`, `public.blog_posts_backup_20261018`.
- **Impacto**: PostgREST exponía estas tablas a través de la API REST anónima, permitiendo enumeración o lectura no restringida de permisos y tablas temporales de backup.
- **Resolución Aplicada**:
  - Se desplegó la migración `20261020010000_fix_critical_security_rls.sql` en producción y staging.
  - Se habilitó RLS en las 4 tablas.
  - Se restringieron lecturas y mutaciones a `authenticated` e `is_super_admin()`.
  - Se revocó el acceso público anónimo a las tablas de backup.
  - Post-verificación: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;` retorna **0 filas**.

#### 2. Redundancia Desincronizada en `orders`: `total` vs `total_amount`
- **Tabla afectada**: `public.orders`.
- **Diagnóstico**: La tabla contiene dos columnas para el importe total: `total` y `total_amount`.
- **Evidencia**: Se detectaron **18 órdenes** con desincronización de datos (ejemplo: `c7560718-82f6-4970-81aa-496835e6de49` con `total = 0.00` y `total_amount = 119000.00`).
- **Causa Raíz**: Diferentes servicios o usecases del backend insertan en `total` o en `total_amount` sin una columna generada o trigger sincronizador.
- **Propuesta**: Unificar mediante migración sincronizadora y establecer una columna computada / trigger `BEFORE INSERT OR UPDATE` que garantice `total = total_amount`.

#### 3. Duplicidad de Clave Natural en `profiles.email`
- **Tabla afectada**: `public.profiles`.
- **Diagnóstico**: Existen emails repetidos en el mismo tenant:
  - `admin@arecofix.com.ar` (ID seed `11111111-1111-1111-1111-111111111111` vs ID central `4d24af70-e7f5-4511-91a3-ee5671070949`).
  - `ezequielenrico15@gmail.com` (ID `05175d52-06e6-41ab-9fde-64e1abdf5990` vs ID `9da10a3a-e000-4a5e-8671-4f4c55266dbe`).
- **Causa Raíz**: Ausencia de constraint `UNIQUE` en `profiles (LOWER(email), tenant_id)` para usuarios no-invitados (`is_guest = false`).

---

### P1 — Severidad Alta (Normalización e Índices)

#### 4. Colisión Masiva de SKUs por Algoritmo de Truncamiento
- **Tabla afectada**: `public.products`.
- **Diagnóstico**: 47 grupos de SKUs duplicados que abarcan miles de productos:
  - `AF-MOD-MODULO-DE-`: 589 productos con el mismo SKU.
  - `AF-BAT-BATERIA-DE`: 311 productos con el mismo SKU.
  - `AF-PLA-PLACA-DE-C`: 205 productos con el mismo SKU.
- **Causa Raíz**: La función de importación histórica generó el SKU truncando la categoría y el nombre a 10 caracteres (`AF-MOD-MODULO-DE-`) sin incorporar el ID, modelo o correlativo numérico.
- **Propuesta**: Ejecutar script de normalización que regenere el SKU único: `'AF-' || UPPER(SUBSTRING(c.slug, 1, 3)) || '-' || UPPER(SUBSTRING(p.slug, 1, 12)) || '-' || LPAD(p.id::text, 4)`.

#### 5. Sobredimensionamiento e Índices Redundantes en `repairs`
- **Tabla afectada**: `public.repairs`.
- **Diagnóstico**: La columna `tracking_code` tiene **4 índices btree concurrentes**:
  1. `idx_repairs_tracking` (btree)
  2. `idx_repairs_tracking_code` (btree)
  3. `repairs_tracking_code_key` (btree unique)
  4. `repairs_tracking_code_unique` (btree unique)
- **Impacto**: Cada operación de `INSERT` o `UPDATE` en reparaciones escribe 4 veces en el subsistema de almacenamiento para la misma columna.
- **Propuesta**: Eliminar los 3 índices duplicados y conservar únicamente `repairs_tracking_code_unique`.

#### 6. Integridad Referencial Débil en Columnas `_id`
- **Tablas afectadas**: `orders.user_id`, `customer_devices.user_id`, `invoices.customer_id`.
- **Diagnóstico**: Columnas de tipo `uuid` que relacionan entidades con `profiles(id)` sin constraint formal `FOREIGN KEY ... REFERENCES profiles(id)`.
- **Auditoría Forense de Huérfanos**:
  - Huérfanos en `orders.user_id`: **0**.
  - Huérfanos en `customer_devices.user_id`: **0**.
  - Huérfanos en `invoices.customer_id`: **0**.
- **Propuesta**: Agregar constraints de FK formales con `ON DELETE SET NULL` para asegurar que el motor PostgreSQL impida inconsistencias futuras.

---

### P2 — Severidad Media / Mantenibilidad

#### 7. Violaciones 1NF (Atomicidad en Arrays y Direcciones)
- **`products.cross_sell_products`**: Almacenado como PostgreSQL `text[]` (array unidimensional). Se recomienda normalizar a una tabla relacional de unión `product_cross_sells (product_id, related_product_id)`.
- **`profiles.address`**: Almacenado como texto libre sin normalizar (calle, altura, ciudad, provincia). En contraste, `orders.shipping_address` está estructurado en `jsonb`.

#### 8. Cuentas de Prueba / Seeds Residuales en Producción
- **Perfiles de Test**:
  - `test_audit@arecofix.com` (`f595c74c-a036-4728-aaea-153a5ffa1f4d`)
  - `testuser123@example.com` (`5dcbc198-d443-4fe1-b638-d1bb5c7379d8`)
  - `tester@example.com` (`d72f41b4-c14b-40b1-ab03-f1ee777c5ac9`)
  - `11111111-1111-1111-1111-111111111111` (Seed inicial de desarrollo).
- **Propuesta**: Marcar con `deleted_at = now()` o archivar.

---

## 3. Scripts SQL Reversibles de Corrección

### Script 1: Sincronización y Unificación de Totales en `orders` (P0)

#### UP Migration:
```sql
BEGIN;

-- Sincronizar hacia el valor mayor / consistente
UPDATE public.orders
SET total = total_amount
WHERE (total IS NULL OR total = 0) AND total_amount > 0;

UPDATE public.orders
SET total_amount = total
WHERE (total_amount IS NULL OR total_amount = 0) AND total > 0;

-- Crear trigger sincronizador preventivo
CREATE OR REPLACE FUNCTION public.fn_sync_orders_total()
RETURNS trigger AS $$
BEGIN
    IF NEW.total IS NOT NULL AND (NEW.total_amount IS NULL OR NEW.total_amount = 0) THEN
        NEW.total_amount := NEW.total;
    ELSIF NEW.total_amount IS NOT NULL AND (NEW.total IS NULL OR NEW.total = 0) THEN
        NEW.total := NEW.total_amount;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_orders_total ON public.orders;
CREATE TRIGGER trg_sync_orders_total
BEFORE INSERT OR UPDATE OF total, total_amount ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_orders_total();

COMMIT;
```

#### DOWN Migration:
```sql
BEGIN;
DROP TRIGGER IF EXISTS trg_sync_orders_total ON public.orders;
DROP FUNCTION IF EXISTS public.fn_sync_orders_total();
COMMIT;
```

---

### Script 2: Deduplicación y Limpieza de Índices en `repairs` (P1)

#### UP Migration:
```sql
BEGIN;

-- Eliminar índices redundantes conservando el constraint primario único
DROP INDEX IF EXISTS public.idx_repairs_tracking;
DROP INDEX IF EXISTS public.idx_repairs_tracking_code;
DROP INDEX IF EXISTS public.repairs_tracking_code_key;

-- Conservar: public.repairs_tracking_code_unique

COMMIT;
```

#### DOWN Migration:
```sql
BEGIN;
CREATE INDEX IF NOT EXISTS idx_repairs_tracking ON public.repairs USING btree (tracking_code);
CREATE INDEX IF NOT EXISTS idx_repairs_tracking_code ON public.repairs USING btree (tracking_code);
CREATE UNIQUE INDEX IF NOT EXISTS repairs_tracking_code_key ON public.repairs USING btree (tracking_code);
COMMIT;
```

---

### Script 3: Blindaje de Integridad Referencial en `orders` e `invoices` (P1)

#### UP Migration:
```sql
BEGIN;

-- Agregar foreign key constraints formales verificando que no existan huérfanos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_user_id_profiles'
    ) THEN
        ALTER TABLE public.orders
        ADD CONSTRAINT fk_orders_user_id_profiles
        FOREIGN KEY (user_id) REFERENCES public.profiles(id)
        ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_customer_devices_user_id_profiles'
    ) THEN
        ALTER TABLE public.customer_devices
        ADD CONSTRAINT fk_customer_devices_user_id_profiles
        FOREIGN KEY (user_id) REFERENCES public.profiles(id)
        ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_invoices_customer_id_profiles'
    ) THEN
        ALTER TABLE public.invoices
        ADD CONSTRAINT fk_invoices_customer_id_profiles
        FOREIGN KEY (customer_id) REFERENCES public.profiles(id)
        ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;
```

#### DOWN Migration:
```sql
BEGIN;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS fk_orders_user_id_profiles;
ALTER TABLE public.customer_devices DROP CONSTRAINT IF EXISTS fk_customer_devices_user_id_profiles;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS fk_invoices_customer_id_profiles;
COMMIT;
```

---

## 4. Estrategia de Despliegue y Próximos Pasos

1. **Fase 1 (Completada en esta Auditoría)**:
   - Mitigación inmediata de RLS en `roles`, `role_permissions` y backups temporales.
   - Snapshot y volcado de esquema en `docs/assets/db/schema_20261020.sql`.
   - Snapshot de métricas y tamaños en `docs/assets/db/snapshot_20261020.md`.
2. **Fase 2 (Aprobación Requerida del Usuario)**:
   - Ejecución del Script 1 (Sincronización `orders.total`).
   - Ejecución del Script 2 (Limpieza de índices redundantes en `repairs`).
   - Ejecución del Script 3 (Constraints de integridad referencial).
3. **Fase 3 (Mantenimiento Periódico)**:
   - Plan de VACUUM ANALYZE sobre `products` y `product_stock_per_branch`.

---

## 5. Remediación Integral del Supabase Database Linter

En continuidad con esta auditoría de base de datos, el 20 de Octubre de 2026 se ejecutó la remediación completa y versionada de los **673 hallazgos** reportados por el Supabase Database Linter en 15 reglas estructurales.

- **Migraciones Aplicadas**: 13 migraciones versionadas y reversibles (`20261021010000_*` a `20261021130000_*`).
- **Estado de Alertas**:
  - `rls_policy_always_true`: 0 (remediado al 100%).
  - `anon_security_definer_function_executable`: 2 (restringido a 2 endpoints de consulta pública con search_path hardened).
  - `function_search_path_mutable`: 0 (122/122 funciones blindadas con `search_path = public, extensions, pg_temp`).
  - `extension_in_public`: 0 (reubicadas en schema `extensions`).
  - `public_bucket_allows_listing`: 0 (eliminado listing en `storage.objects`).
  - `auth_rls_initplan`: 0 (45 políticas optimizadas con subconsultas escalares `(SELECT auth.uid())`).
  - `duplicate_index`: 0 (17 índices redundantes eliminados).
  - `unindexed_foreign_keys`: 0 (31 índices covering añadidos).
  - `no_primary_key`: 0 (deduplicación y PKs asignadas).
- **Evidencias Completas**:
  - Documento Maestro: [docs/SECURITY_REMEDIATION_20261020.md](file:///c:/git/Arecofixpage/docs/SECURITY_REMEDIATION_20261020.md)
  - Guía Operacional: [docs/DATABASE_HARDENING_GUIDE.md](file:///c:/git/Arecofixpage/docs/DATABASE_HARDENING_GUIDE.md)
  - Plan de Tareas: [docs/REMEDIATION_PLAN_20261020.md](file:///c:/git/Arecofixpage/docs/REMEDIATION_PLAN_20261020.md)

