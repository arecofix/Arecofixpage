-- Item 1
select c.relname, c.reloptions from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname='public' and c.relname='public_tenant_profile';

select viewname, viewowner from pg_views
where schemaname='public' and viewname='public_tenant_profile';

-- Item 2
select prosrc, prosecdef from pg_proc
where proname='get_public_tenant_info' and pronamespace='public'::regnamespace;

-- Item 5
select id, name, slug,
       (ml_access_token is not null) as has_ml,
       (whatsapp_access_token is not null) as has_wa,
       (whatsapp_phone_id is not null) as has_wa_phone
from public.tenants
order by has_ml desc, has_wa desc;

-- Item 7: Auxiliary functions
select p.proname, pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin', 'is_super_admin', 'get_auth_user_role', 'get_auth_user_branch', 'get_auth_user_tenant', 'get_current_tenant_id');
