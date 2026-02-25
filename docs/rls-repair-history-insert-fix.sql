-- SOLUCION DEFINITIVA PARA ERROR 403 INSERT: repair_status_history
-- Problema: Postgres aborta el INSERT porque la política evaluaba el tenant_id de la fila entrante contra get_my_tenant(), pero desde el Frontend probablemente el tenant_id venía nulo o ausente.
-- Solución: Asignar a la columna el valor por defecto basado en el token del usuario y aplicar la política RLS unificada.

-- 1. Establecemos el valor por defecto automatizado a nivel tabla para que el frontend no tenga que enviarlo.
ALTER TABLE public.repair_status_history 
ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();

-- 2. Limpieza de politicas redundantes
DROP POLICY IF EXISTS "Tenant Isolation Repair Status History" ON public.repair_status_history;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repair_status_history;
DROP POLICY IF EXISTS "Permitir INSERT a autenticados" ON public.repair_status_history;

-- 3. Volvemos a levantar la politica unificada estricta pero eficiente
CREATE POLICY "tenant_isolation_policy" ON public.repair_status_history
  FOR ALL TO authenticated
  USING (tenant_id = public.get_my_tenant())
  WITH CHECK (tenant_id = public.get_my_tenant());
