-- 1. FIX: Multiple permissive policies for role authenticated for action UPDATE en profiles.
-- Supabase advierte que tener 2 políticas de UPDATE (como "profiles_update_admin" y "Solo admins cambian tenant_id")
-- degrada el rendimiento ya que tiene que evaluar ambas.
-- Solución: Borramos la vieja ("Solo admins cambian tenant_id") ya que "profiles_update_admin" ya cubre la lógica correctamente.
DROP POLICY IF EXISTS "Solo admins cambian tenant_id" ON public.profiles;

-- 2. FIX: Function public.auto_assign_repair_branch has a role mutable search_path.
-- Supabase advierte que las funciones ejecutadas con "SECURITY DEFINER" deben especificar
-- explícitamente su search_path para ser seguras ante ataques (Search Path hijacking).
-- Solución: Re-declaramos la función forzándole el search_path = public.
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
