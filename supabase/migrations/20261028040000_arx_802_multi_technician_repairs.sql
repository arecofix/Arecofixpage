-- Migration: 20261028040000_arx_802_multi_technician_repairs.sql
-- Description: Ticket ARX-802 - Multi-technician assignment on repair orders

-- 1. Tabla de asignación multi-técnico
CREATE TABLE IF NOT EXISTS public.repair_technicians (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
    repair_id uuid NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
    technician_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'assistant', 'specialist', 'reviewer')),
    assigned_at timestamptz NOT NULL DEFAULT now(),
    notes text,
    CONSTRAINT chk_repair_technicians_tenant_id_not_nil CHECK (tenant_id <> '00000000-0000-0000-0000-000000000000'::uuid),
    CONSTRAINT uq_repair_technician_pair UNIQUE (repair_id, technician_id)
);

-- 2. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_repair_technicians_repair_id ON public.repair_technicians(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_technicians_technician_id ON public.repair_technicians(technician_id);
CREATE INDEX IF NOT EXISTS idx_repair_technicians_tenant_id ON public.repair_technicians(tenant_id);

-- 3. RLS
ALTER TABLE public.repair_technicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "repair_technicians_tenant_isolation" ON public.repair_technicians;
CREATE POLICY "repair_technicians_tenant_isolation"
  ON public.repair_technicians
  FOR ALL
  TO authenticated
  USING ((tenant_id = get_current_tenant_id()) OR is_super_admin())
  WITH CHECK ((tenant_id = get_current_tenant_id()) OR is_super_admin());

-- 4. Triggers de sincronización bidireccional y auto-población de tenant
CREATE OR REPLACE FUNCTION public.fn_repair_technicians_set_tenant()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    IF NEW.tenant_id IS NULL THEN
        SELECT tenant_id INTO NEW.tenant_id FROM public.repairs WHERE id = NEW.repair_id;
    END IF;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_repair_technicians_set_tenant ON public.repair_technicians;
CREATE TRIGGER trg_repair_technicians_set_tenant
BEFORE INSERT ON public.repair_technicians
FOR EACH ROW
EXECUTE FUNCTION public.fn_repair_technicians_set_tenant();

-- 4.1 De repair_technicians (role = 'primary') -> repairs.assigned_technician_id
CREATE OR REPLACE FUNCTION public.fn_sync_primary_technician_to_repair()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    IF NEW.role = 'primary' THEN
        UPDATE public.repairs 
        SET assigned_technician_id = NEW.technician_id
        WHERE id = NEW.repair_id 
          AND (assigned_technician_id IS DISTINCT FROM NEW.technician_id);
    END IF;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_primary_technician_to_repair ON public.repair_technicians;
CREATE TRIGGER trg_sync_primary_technician_to_repair
AFTER INSERT OR UPDATE ON public.repair_technicians
FOR EACH ROW
EXECUTE FUNCTION public.fn_sync_primary_technician_to_repair();

-- 4.2 De repairs.assigned_technician_id -> repair_technicians
CREATE OR REPLACE FUNCTION public.fn_sync_repair_to_primary_technician()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    IF NEW.assigned_technician_id IS NOT NULL AND 
       (OLD.assigned_technician_id IS DISTINCT FROM NEW.assigned_technician_id) THEN
        INSERT INTO public.repair_technicians (
            tenant_id,
            repair_id,
            technician_id,
            role,
            assigned_at
        ) VALUES (
            NEW.tenant_id,
            NEW.id,
            NEW.assigned_technician_id,
            'primary',
            now()
        )
        ON CONFLICT (repair_id, technician_id) 
        DO UPDATE SET role = 'primary', assigned_at = now();
    END IF;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_repair_to_primary_technician ON public.repairs;
CREATE TRIGGER trg_sync_repair_to_primary_technician
AFTER UPDATE ON public.repairs
FOR EACH ROW
EXECUTE FUNCTION public.fn_sync_repair_to_primary_technician();

-- 5. Backfill de técnicos principales existentes
INSERT INTO public.repair_technicians (
    tenant_id,
    repair_id,
    technician_id,
    role,
    assigned_at
)
SELECT 
    r.tenant_id,
    r.id,
    r.assigned_technician_id,
    'primary',
    COALESCE(r.received_at, r.created_at, now())
FROM public.repairs r
WHERE r.assigned_technician_id IS NOT NULL
ON CONFLICT (repair_id, technician_id) DO NOTHING;
