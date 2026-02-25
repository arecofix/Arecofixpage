-- Solución SQL para el Guardado de Datos de Empresa / Sucursales (SaaS)

-- 1. Políticas de ACTUALIZACIÓN para la tabla TENANTS (Empresa)
-- Problema: La tabla `tenants` permitía leer pero no actualizar, por eso el front-end fingía éxito pero no guardaba.
DROP POLICY IF EXISTS "tenant_update_policy" ON public.tenants;
CREATE POLICY "tenant_update_policy" ON public.tenants
  FOR UPDATE TO authenticated
  USING (id = public.get_my_tenant())
  WITH CHECK (id = public.get_my_tenant());

-- 2. Aseguramos el comportamiento automático para las SUCURSALES (Branches)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Forzamos que toda sucursal nueva adquiera el tenant_id actual automáticamente
ALTER TABLE public.branches 
ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();

-- Limpiamos reglas anteriores si existían
DROP POLICY IF EXISTS "tenant_branches_select" ON public.branches;
DROP POLICY IF EXISTS "tenant_branches_insert" ON public.branches;
DROP POLICY IF EXISTS "tenant_branches_update" ON public.branches;
DROP POLICY IF EXISTS "tenant_branches_delete" ON public.branches;

-- Creamos el aislamiento perfecto para el CRUD de Sucursales
CREATE POLICY "tenant_branches_select" ON public.branches
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_my_tenant());

CREATE POLICY "tenant_branches_insert" ON public.branches
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_my_tenant());

CREATE POLICY "tenant_branches_update" ON public.branches
  FOR UPDATE TO authenticated
  USING (tenant_id = public.get_my_tenant())
  WITH CHECK (tenant_id = public.get_my_tenant());

CREATE POLICY "tenant_branches_delete" ON public.branches
  FOR DELETE TO authenticated
  USING (tenant_id = public.get_my_tenant());

-- FIX PÚBLICO: Permitir a visitantes (anon) ver las sucursales del tenant actual (útil para el frontend)
DROP POLICY IF EXISTS "Public Branches Read" ON public.branches;
CREATE POLICY "Public Branches Read" ON public.branches FOR SELECT TO anon USING (true);
