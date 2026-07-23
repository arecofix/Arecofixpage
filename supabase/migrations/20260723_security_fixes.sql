-- 20260723_security_fixes.sql
-- Auditoría de Seguridad: Fixes para Unique Constraints y Soft Deletes
-- ==============================================================================
-- ATENCIÓN ADMINISTRADOR: 
-- Copia y ejecuta este script en el editor SQL de Supabase (SQL Editor).
-- Este script realiza las siguientes acciones:
-- 1. Modifica los Unique Constraints que eran globales y los hace compuestos (tenant_id, slug/id).
-- 2. Refuerza las políticas RLS (Row Level Security) añadiendo "deleted_at IS NULL" a los SELECTs 
--    de tablas principales para evitar fugas de información borrada a través de las APIs REST.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- PARTE 1: UNIQUE CONSTRAINTS COMPUESTOS POR TENANT (Prevención DoS/Colisión)
-- ------------------------------------------------------------------------------

-- 1.A. Tabla: branches
-- Eliminar el unique constraint global actual sobre `slug`
ALTER TABLE public.branches DROP CONSTRAINT IF EXISTS branches_slug_key;
-- Crear constraint compuesto
ALTER TABLE public.branches ADD CONSTRAINT branches_tenant_id_slug_key UNIQUE (tenant_id, slug);

-- 1.B. Tabla: bank_reconciliations
-- Eliminar el unique constraint global actual sobre `transaction_id`
ALTER TABLE public.bank_reconciliations DROP CONSTRAINT IF EXISTS bank_reconciliations_transaction_id_key;
-- Crear constraint compuesto
ALTER TABLE public.bank_reconciliations ADD CONSTRAINT bank_recon_tenant_id_transaction_id_key UNIQUE (tenant_id, transaction_id);

-- 1.C. (Opcional si aplica) repair_status_types
-- No se modifica name UNIQUE porque esta tabla no tiene tenant_id (status globales)


-- ------------------------------------------------------------------------------
-- PARTE 2: SOFT DELETE BYPASS (Fuga de registros borrados por la API REST)
-- ------------------------------------------------------------------------------
-- Supabase, por defecto, expone todos los registros en las peticiones GET 
-- si la política (Policy) de SELECT no lo previene.
-- Vamos a reemplazar las políticas SELECT existentes para añadir "(deleted_at IS NULL)".
-- NOTA: Como no conocemos los nombres exactos de tus políticas (Ej: "Enable read access for authenticated users"), 
-- crearemos nuevas políticas que sobreescriban o usaremos DO Blocks genéricos.
-- Por seguridad y limpieza, es mejor que actualices las políticas existentes desde el Dashboard
-- O utilices los comandos de abajo asumiendo nombres genéricos. 
-- Aquí definimos políticas restrictivas que fuerzan el filtro.

-- Para 'products'
-- Aseguramos que cualquier SELECT esté forzado a no traer los borrados lógicamente.
CREATE POLICY "Filter_Soft_Deleted_Products" ON public.products
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'orders'
CREATE POLICY "Filter_Soft_Deleted_Orders" ON public.orders
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'invoices'
CREATE POLICY "Filter_Soft_Deleted_Invoices" ON public.invoices
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'repairs'
CREATE POLICY "Filter_Soft_Deleted_Repairs" ON public.repairs
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'brands'
CREATE POLICY "Filter_Soft_Deleted_Brands" ON public.brands
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'models'
CREATE POLICY "Filter_Soft_Deleted_Models" ON public.models
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'categories'
CREATE POLICY "Filter_Soft_Deleted_Categories" ON public.categories
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'customer_devices'
CREATE POLICY "Filter_Soft_Deleted_Customer_Devices" ON public.customer_devices
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Para 'profiles'
CREATE POLICY "Filter_Soft_Deleted_Profiles" ON public.profiles
    AS RESTRICTIVE FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- ------------------------------------------------------------------------------
-- PARTE 3: REFUERZO DE INSERCIÓN (Foreign Key IDOR Preventivo)
-- ------------------------------------------------------------------------------
-- Estas políticas aseguran que incluso si la UI o un Atacante inyecta un tenant_id válido
-- pero ajeno, la base de datos lo rechace al insertar.

CREATE POLICY "Force_My_Tenant_On_Insert_Products" ON public.products
    AS RESTRICTIVE FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_my_tenant());

CREATE POLICY "Force_My_Tenant_On_Insert_Orders" ON public.orders
    AS RESTRICTIVE FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_my_tenant());

CREATE POLICY "Force_My_Tenant_On_Insert_Repairs" ON public.repairs
    AS RESTRICTIVE FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_my_tenant());

COMMIT;
