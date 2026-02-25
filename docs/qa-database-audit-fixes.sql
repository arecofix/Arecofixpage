-- ======================================================================================
-- AUDITORÍA QA - PARCHES DE BASE DE DATOS Y NORMALIZACIÓN
-- ======================================================================================
-- Este script corrige advertencias de integridad, aplica índices de rendimiento SaaS
-- y mejora las reglas de consistencia de la base de datos de Arecofix.
-- ======================================================================================

-- --------------------------------------------------------------------------------------
-- 1. CORRECCIÓN DE CLAVES FORÁNEAS FALTANTES (Integridad Referencial)
-- --------------------------------------------------------------------------------------
-- Encontramos que la tabla de notificaciones no tenía relación explícita (Foreign Key)
-- con la tabla tenants, lo que podría generar notificaciones huérfanas al borrar un tenant.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_notifications_tenant') THEN
    ALTER TABLE public.notifications ADD CONSTRAINT fk_notifications_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- --------------------------------------------------------------------------------------
-- 2. REGLAS DE NEGOCIO Y CONSTRAINTS (Validación de Datos)
-- --------------------------------------------------------------------------------------
-- Evita errores humanos de poner un precio de oferta más caro que el precio base.
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS check_product_sale_price;
ALTER TABLE public.products ADD CONSTRAINT check_product_sale_price CHECK (sale_price IS NULL OR sale_price <= price);

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS check_course_sale_price;
ALTER TABLE public.courses ADD CONSTRAINT check_course_sale_price CHECK (sale_price IS NULL OR sale_price <= price);

-- Validación de formato de Email en tablas críticas (Previene spam/errores)
ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS check_contact_email;
ALTER TABLE public.contact_messages ADD CONSTRAINT check_contact_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$');

ALTER TABLE public.suppliers DROP CONSTRAINT IF EXISTS check_supplier_email;
ALTER TABLE public.suppliers ADD CONSTRAINT check_supplier_email CHECK (email IS NULL OR email = '' OR email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$');

-- --------------------------------------------------------------------------------------
-- 3. ÍNDICES DE RENDIMIENTO SAAS (Crucial para Multi-Tenant rápidos)
-- --------------------------------------------------------------------------------------
-- Postgres NO indexa las Foreign Keys automáticamente. Las consultas RLS hacen WHERE tenant_id = X todo el tiempo.
-- Sin estos índices, las tablas irán brutalmente lentas cuando lleguen a 10.000+ filas.
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_repairs_tenant_id ON public.repairs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON public.services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_devices_tenant_id ON public.customer_devices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON public.notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.profiles(phone); -- Indexar teléfonos para facilitar búsquedas de clientes rápidos

-- --------------------------------------------------------------------------------------
-- 4. AUTOMATIZACIÓN DEL CAMPO UPDATED_AT (Triggers Base de Datos)
-- --------------------------------------------------------------------------------------
-- Evitamos depender de Angular para actualizar el timestamp `updated_at`. La DB debe hacerlo sola.
CREATE OR REPLACE FUNCTION public.auto_update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicamos el trigger masivamente a las tablas más editadas
DO $$ 
DECLARE
  t text;
  tables text[] := ARRAY['products', 'repairs', 'orders', 'invoices', 'profiles', 'services', 'branches', 'categories'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_update_%I_modified ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_update_%I_modified BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.auto_update_modified_column()', 
      t, t
    );
  END LOOP;
END $$;
