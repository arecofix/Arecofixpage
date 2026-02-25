-- SOLUCIÓN DEL ERROR AL GUARDAR REPARACIONES (RLS - repair_status_history)
-- Explicación: Cuando Angular intenta crear una reparación o guardar un cambio de estado,
-- la base de datos aborta la carga porque, por seguridad "por defecto" (Default Deny),
-- Supabase bloquea los INSERTs en tablas que no tienen una Política de Aislamiento definida explícitamente.

-- 1. Políticas de Inserción, Actualización y Lectura para el LOG de Estados (repair_status_history)
ALTER TABLE public.repair_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Repair Status History" ON public.repair_status_history;
CREATE POLICY "Tenant Isolation Repair Status History" ON public.repair_status_history
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 2. Asegurar también las Imágenes de la Separación para prevenir errores en Uploads
ALTER TABLE public.repair_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Repair Images" ON public.repair_images;
CREATE POLICY "Tenant Isolation Repair Images" ON public.repair_images
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 3. Asegurar los Repuestos utilizados en cada Service
ALTER TABLE public.repair_parts_used ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Repair Parts" ON public.repair_parts_used;
CREATE POLICY "Tenant Isolation Repair Parts" ON public.repair_parts_used
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 4. Repasar que la Tabla Principal de Reparaciones también autorice Inserts
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant Isolation Repairs" ON public.repairs;
CREATE POLICY "Tenant Isolation Repairs" ON public.repairs
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());
