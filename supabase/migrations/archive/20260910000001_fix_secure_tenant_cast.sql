CREATE OR REPLACE FUNCTION public.get_secure_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    t_id uuid;
    raw_tenant_id text;
BEGIN
    raw_tenant_id := current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id';
    
    IF raw_tenant_id IS NOT NULL AND raw_tenant_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        t_id := raw_tenant_id::uuid;
    END IF;

    IF t_id IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT tenant_id INTO t_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;
    
    RETURN t_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_secure_branch_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    b_id uuid;
    raw_branch_id text;
BEGIN
    raw_branch_id := current_setting('request.jwt.claims', true)::jsonb ->> 'branch_id';
    
    IF raw_branch_id IS NOT NULL AND raw_branch_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        b_id := raw_branch_id::uuid;
    END IF;

    IF b_id IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO b_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;
    
    RETURN b_id;
END;
$function$;
