-- 1. Habilitar RLS en repairs (si no estaba habilitado)
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;

-- Nos aseguramos que la columna branch_id existe
ALTER TABLE public.repairs ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.branches(id);

-- 2. Eliminar políticas genéricas previas para evitar conflictos
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_select_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_insert_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_update_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_delete_policy" ON public.repairs;

-- 3. Crear Políticas Duras (Select)
CREATE POLICY "repairs_select_policy" ON public.repairs
FOR SELECT TO authenticated
USING (
    tenant_id = public.get_my_tenant()
    AND (
        -- Si es administrador, ve todo el tenant
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
        OR
        -- Si es staff/tecnico, ve solo las reparaciones de su sucursal, o las sin sucursal (por compatibilidad vieja)
        (
            branch_id IN (SELECT branch_id FROM public.profiles WHERE id = (select auth.uid()))
            OR branch_id IS NULL 
        )
    )
);

-- 4. Crear Políticas Duras (Insert)
CREATE POLICY "repairs_insert_policy" ON public.repairs
FOR INSERT TO authenticated
WITH CHECK (
    tenant_id = public.get_my_tenant()
);

-- 5. Crear Políticas Duras (Update/Delete)
CREATE POLICY "repairs_update_policy" ON public.repairs
FOR UPDATE TO authenticated
USING (
    tenant_id = public.get_my_tenant()
    AND (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
        OR
        (
            branch_id IN (SELECT branch_id FROM public.profiles WHERE id = (select auth.uid()))
            OR branch_id IS NULL
        )
    )
);

CREATE POLICY "repairs_delete_policy" ON public.repairs
FOR DELETE TO authenticated
USING (
    tenant_id = public.get_my_tenant() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
);

-- 6. TRIGGER MÁGICO para automatización de Sucursal:
-- Si un Técnico (Staff) ingresa un celular nuevo, se le clava la Sucursal del Empleado sin que se de cuenta.
CREATE OR REPLACE FUNCTION public.auto_assign_repair_branch()
RETURNS trigger AS $$
DECLARE
    v_user_role text;
    v_user_branch uuid;
BEGIN
    SELECT role, branch_id INTO v_user_role, v_user_branch FROM public.profiles WHERE id = (select auth.uid());
    
    -- Si el que carga es staff y la reparación no trae sucursal forzada, hereda la del staff.
    IF (v_user_role = 'staff' AND new.branch_id IS NULL) THEN
        new.branch_id := v_user_branch;
    END IF;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_assign_repair_branch ON public.repairs;
CREATE TRIGGER trg_auto_assign_repair_branch
    BEFORE INSERT ON public.repairs
    FOR EACH ROW EXECUTE FUNCTION public.auto_assign_repair_branch();
