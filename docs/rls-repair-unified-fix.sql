-- SOLUCIÓN DEFINITIVA PARA LAS REPARACIONES (RLS - INSERTS Y MULTIPLES POLÍTICAS)
-- Explicación: Para evitar el error de "multiple permissive policies" que marca el Advisor, 
-- y al mismo tiempo permitir que los INSERTS se guarden sin error 403, 
-- vamos a ELIMINAR las políticas viejas duplicadas ("tenant_isolation_policy") y dejar una sola unificada FOR ALL.

-- 1. REPAIR_STATUS_HISTORY (Historial de estados)
DROP POLICY IF EXISTS "Tenant Isolation Repair Status History" ON public.repair_status_history;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repair_status_history;

CREATE POLICY "tenant_isolation_policy" ON public.repair_status_history
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 2. REPAIR_IMAGES (Imágenes adjuntas)
DROP POLICY IF EXISTS "Tenant Isolation Repair Images" ON public.repair_images;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repair_images;

CREATE POLICY "tenant_isolation_policy" ON public.repair_images
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 3. REPAIR_PARTS_USED (Repuestos utilizados)
DROP POLICY IF EXISTS "Tenant Isolation Repair Parts" ON public.repair_parts_used;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repair_parts_used;

CREATE POLICY "tenant_isolation_policy" ON public.repair_parts_used
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 4. REPAIRS (Tabla principal de reparaciones)
DROP POLICY IF EXISTS "Tenant Isolation Repairs" ON public.repairs;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repairs;

CREATE POLICY "tenant_isolation_policy" ON public.repairs
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());

-- 5. SERVICES (Limpieza de duplicados públicos)
DROP POLICY IF EXISTS "Anon can see active services" ON public.services;
DROP POLICY IF EXISTS "Public read access to active services" ON public.services;

CREATE POLICY "Public read access to active services" 
  ON public.services FOR SELECT TO public
  USING (is_active = true);
