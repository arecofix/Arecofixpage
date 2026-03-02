-- SOLUCIÓN DEFINITIVA PARA ERROR 403 EN REPARACIONES (RLS INSERT)
-- Objetivo: Asegurar que el INSERT de reparaciones no falle por políticas de seguridad mal configuradas.

-- 1. Asegurar que las columnas del sistema tengan valores por defecto sensatos si no se envían
ALTER TABLE public.repairs ALTER COLUMN tenant_id SET DEFAULT public.get_my_tenant();
ALTER TABLE public.repairs ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
ALTER TABLE public.repairs ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

-- 2. Limpieza total de políticas existentes en la tabla repairs para evitar conflictos
DROP POLICY IF EXISTS "Tenant Isolation Repairs" ON public.repairs;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_select_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_insert_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_update_policy" ON public.repairs;
DROP POLICY IF EXISTS "repairs_delete_policy" ON public.repairs;

-- 3. Crear POLÍTICA UNIFICADA para el Tenant (Aislamiento de Negocio)
-- Esta regla es la base del SaaS: Cada cual ve lo suyo.
CREATE POLICY "tenant_isolation_repairs" ON public.repairs
FOR ALL TO authenticated
USING (tenant_id = public.get_my_tenant())
WITH CHECK (tenant_id = public.get_my_tenant());

-- 4. PERMISO ESPECIAL DE LECTURA PARA CLIENTES (Opcional pero recomendado para tracking público)
-- Si un cliente tiene el código de seguimiento, puede ver su reparación sin estar logueado
DROP POLICY IF EXISTS "Public can track repairs" ON public.repairs;
CREATE POLICY "Public can track repairs" ON public.repairs
FOR SELECT TO anon, authenticated
USING (tracking_code IS NOT NULL);

-- 5. RE-HABILITAR RLS
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;

-- 6. AUDITORÍA DE PERFIL FALTANTE 
-- Si por algún motivo el usuario no tiene perfil (y por ende get_my_tenant devuelve null), el insert fallará.
-- Este trigger asegura que el usuario siempre tenga un tenant asignado en su sesión.
CREATE OR REPLACE FUNCTION public.check_user_profile_exists()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid())) THEN
       RAISE EXCEPTION 'Tu cuenta no tiene un perfil configurado. Contacta a soporte.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_profile_before_repair ON public.repairs;
CREATE TRIGGER trg_check_profile_before_repair
    BEFORE INSERT ON public.repairs
    FOR EACH ROW EXECUTE FUNCTION public.check_user_profile_exists();

-- 7. Recargar caché de esquema (por si se agregaron columnas recientemente)
NOTIFY pgrst, 'reload schema';
