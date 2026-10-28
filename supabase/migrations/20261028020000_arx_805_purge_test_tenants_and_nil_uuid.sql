-- Migration: 20261028020000_arx_805_purge_test_tenants_and_nil_uuid.sql
-- Description: Ticket ARX-805 / DEF-10 - Archive and purge orphaned test tenants and enforce nil-UUID checks

DO $$
DECLARE
    target_ids UUID[] := ARRAY[
        '00000000-0000-0000-0000-000000000000'::uuid,
        '00e4e8be-6e62-4713-96ab-be14d71710ac'::uuid, -- Test Tenant
        'd35887e2-fccb-4bcb-a001-06451497a318'::uuid, -- Test Business
        'bfd0556e-4dd0-4f8c-9d2b-0970bdd5260a'::uuid, -- safefix
        'e119053c-e455-4a35-937d-ae80e008fc91'::uuid, -- safex
        '9a428885-bc79-4a01-8747-41fbe09bcaae'::uuid, -- safefe
        '75d1493a-54f0-4342-b742-76650bf81296'::uuid, -- fix
        'bb7de514-521c-4e6e-a658-e9c9cc9c9e40'::uuid, -- fixx
        '3ce6876a-dbee-48f7-8a32-d5199fc1236a'::uuid  -- Home repairs
    ];
BEGIN
    -- 1. Crear schema backups si no existe y archivar
    CREATE SCHEMA IF NOT EXISTS backups;
    
    CREATE TABLE IF NOT EXISTS backups.archived_tenants AS 
    SELECT * FROM public.tenants WHERE false;

    CREATE TABLE IF NOT EXISTS backups.archived_profiles AS 
    SELECT * FROM public.profiles WHERE false;

    CREATE TABLE IF NOT EXISTS backups.archived_branches AS 
    SELECT * FROM public.branches WHERE false;

    -- Backup de tenants
    INSERT INTO backups.archived_tenants
    SELECT * FROM public.tenants 
    WHERE id = ANY(target_ids)
    ON CONFLICT DO NOTHING;

    -- Backup de profiles asociados a esos tenants
    INSERT INTO backups.archived_profiles
    SELECT * FROM public.profiles 
    WHERE tenant_id = ANY(target_ids)
    ON CONFLICT DO NOTHING;

    -- Backup de branches asociadas a esos tenants
    INSERT INTO backups.archived_branches
    SELECT * FROM public.branches 
    WHERE tenant_id = ANY(target_ids)
    ON CONFLICT DO NOTHING;

    -- 2. Eliminar referencias hijas sin ON DELETE CASCADE
    DELETE FROM public.product_stock_per_branch WHERE tenant_id = ANY(target_ids);
    DELETE FROM public.products WHERE tenant_id = ANY(target_ids);
    DELETE FROM public.user_roles WHERE tenant_id = ANY(target_ids);
    DELETE FROM public.profiles WHERE tenant_id = ANY(target_ids);
    DELETE FROM public.branches WHERE tenant_id = ANY(target_ids);

    -- 3. Eliminar tenants huérfanos / de prueba
    DELETE FROM public.tenants 
    WHERE id = ANY(target_ids);

    -- 4. Constraint estricto en la tabla madre tenants
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_tenants_id_not_nil'
    ) THEN
        ALTER TABLE public.tenants 
        ADD CONSTRAINT chk_tenants_id_not_nil 
        CHECK (id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    -- 5. Constraints estrictos en tablas hijas
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_repairs_tenant_id_not_nil') THEN
        ALTER TABLE public.repairs ADD CONSTRAINT chk_repairs_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_tenant_id_not_nil') THEN
        ALTER TABLE public.orders ADD CONSTRAINT chk_orders_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_invoices_tenant_id_not_nil') THEN
        ALTER TABLE public.invoices ADD CONSTRAINT chk_invoices_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_tenant_id_not_nil') THEN
        ALTER TABLE public.products ADD CONSTRAINT chk_products_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_stock_history_tenant_id_not_nil') THEN
        ALTER TABLE public.stock_history ADD CONSTRAINT chk_stock_history_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_customer_devices_tenant_id_not_nil') THEN
        ALTER TABLE public.customer_devices ADD CONSTRAINT chk_customer_devices_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_purchases_tenant_id_not_nil') THEN
        ALTER TABLE public.purchases ADD CONSTRAINT chk_purchases_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_payments_tenant_id_not_nil') THEN
        ALTER TABLE public.payments ADD CONSTRAINT chk_payments_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000');
    END IF;
END $$;
