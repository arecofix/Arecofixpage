-- Audit script for live database
\echo '=== QUESTION 1: public_tenant_profile config ==='
select c.relname, c.reloptions from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname='public' and c.relname='public_tenant_profile';

select viewname, viewowner from pg_views
where schemaname='public' and viewname='public_tenant_profile';

\echo '=== QUESTION 2: get_public_tenant_info ==='
select prosrc, prosecdef from pg_proc
where proname='get_public_tenant_info' and pronamespace='public'::regnamespace;

\echo '=== QUESTION 5: Tenants with tokens ==='
select id, name, slug,
       (ml_access_token is not null) as has_ml,
       (whatsapp_access_token is not null) as has_wa
from public.tenants
order by has_ml desc, has_wa desc;

\echo '=== QUESTION 7: Helper functions ==='
select proname, prosecdef, prosrc from pg_proc
where proname in ('is_admin', 'is_super_admin', 'get_auth_user_role', 'get_auth_user_branch', 'get_auth_user_tenant', 'get_current_tenant_id')
  and pronamespace='public'::regnamespace;

\echo '=== QUESTION 8: public.branches schema and policies ==='
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'branches'
order by ordinal_position;

select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'branches';
