-- ============================================================
-- SQL: REPARACIÓN GLOBAL DE VISIBILIDAD E INTEGRIDAD
-- Objetivo: 1. Asegurar que todos los productos tengan tenant_id (para que salgan en admin)
--           2. Corregir categorías (Módulos y Herramientas)
--           3. Fix error 'check_single_item_type' en pedidos
-- ============================================================

DO $$
DECLARE
    main_tenant_id uuid;
    module_cat_id uuid;
    tools_cat_id uuid;
BEGIN
    -- 1. Obtener Tenant Principal (Arecofix)
    SELECT id INTO main_tenant_id FROM tenants WHERE slug = 'arecofix' LIMIT 1;
    IF main_tenant_id IS NULL THEN 
        RAISE EXCEPTION 'Tenant arecofix no encontrado';
    END IF;

    -- 2. Asegurar categorías críticas para la organización
    -- Módulos
    SELECT id INTO module_cat_id FROM categories WHERE slug = 'modulos' AND tenant_id = main_tenant_id LIMIT 1;
    IF module_cat_id IS NULL THEN
        INSERT INTO categories (name, slug, type, tenant_id, is_active)
        VALUES ('Módulos / Pantallas', 'modulos', 'product', main_tenant_id, true)
        RETURNING id INTO module_cat_id;
    ELSE
        UPDATE categories SET type = 'product', is_active = true WHERE id = module_cat_id;
    END IF;

    -- Herramientas
    SELECT id INTO tools_cat_id FROM categories WHERE slug = 'repuestos/tools' AND tenant_id = main_tenant_id LIMIT 1;
    IF tools_cat_id IS NULL THEN
        INSERT INTO categories (name, slug, type, tenant_id, is_active)
        VALUES ('Herramientas / GSM', 'repuestos/tools', 'product', main_tenant_id, true)
        RETURNING id INTO tools_cat_id;
    ELSE
        UPDATE categories SET type = 'product', is_active = true WHERE id = tools_cat_id;
    END IF;

    -- 3. REPARACIÓN DE TENANT_ID (Crucial para que aparezcan en ADMIN)
    -- Muchos productos importados pueden haber quedado con tenant_id NULL o diferente.
    UPDATE products SET tenant_id = main_tenant_id WHERE tenant_id IS NULL;
    UPDATE categories SET tenant_id = main_tenant_id WHERE tenant_id IS NULL;
    UPDATE brands SET tenant_id = main_tenant_id WHERE tenant_id IS NULL;
    UPDATE product_stock_per_branch SET tenant_id = main_tenant_id WHERE tenant_id IS NULL;

    -- 4. ASEGURAR ACTIVACIÓN
    -- Si los productos aparecen en la web pero no en el admin, o viceversa, revisamos is_active.
    -- Activamos productos de las categorías principales para asegurar visibilidad.
    UPDATE products SET is_active = true 
    WHERE category_id IN (module_cat_id, tools_cat_id) AND is_active = false;

    RAISE NOTICE 'Reparación de visibilidad completada.';
END $$;

-- 5. FIX CONSTRAINT ORDER_ITEMS (Evita fallo al crear pedidos)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS check_single_item_type;
ALTER TABLE public.order_items ADD CONSTRAINT check_single_item_type 
CHECK (
    (product_id IS NOT NULL AND course_id IS NULL) OR 
    (product_id IS NULL AND course_id IS NOT NULL) OR 
    (product_id IS NULL AND course_id IS NULL)
);

-- Recargar POSTGREST para ver cambios
NOTIFY pgrst, 'reload schema';
