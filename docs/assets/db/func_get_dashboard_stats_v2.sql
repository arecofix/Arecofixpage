CREATE OR REPLACE FUNCTION public.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
    result json;
    v_tenant_id uuid;
    v_central_branch_id uuid;
BEGIN
    v_tenant_id := public.get_current_tenant_id();

    IF v_tenant_id IS NULL AND NOT public.is_super_admin() THEN
        RETURN '{}'::json;
    END IF;

    SELECT id INTO v_central_branch_id
    FROM public.branches
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND is_active = true
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
    LIMIT 1;

    SELECT json_build_object(
        'users', (SELECT count(*) FROM public.profiles WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)),
        'products', (SELECT count(*) FROM public.products WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND deleted_at IS NULL),
        'sales', (SELECT count(*) FROM public.orders
                  WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                    AND status IN ('paid', 'shipped', 'completed', 'delivered')
                    AND (
                        p_branch_id IS NULL
                        OR branch_id = p_branch_id
                        OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                    )),
        'devices_fixed', (SELECT count(*) FROM public.repairs
                          WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                            AND current_status_id IN (5, 6)
                            AND (
                                p_branch_id IS NULL
                                OR branch_id = p_branch_id
                                OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                            )),
        'active_repairs', (SELECT count(*) FROM public.repairs
                           WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
                             AND current_status_id NOT IN (5, 6)
                             AND (
                                 p_branch_id IS NULL
                                 OR branch_id = p_branch_id
                                 OR (branch_id IS NULL AND p_branch_id = v_central_branch_id)
                             ))
    ) INTO result;

    RETURN result;
END;
$function$
