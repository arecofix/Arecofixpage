WITH base AS (
    SELECT schemaname, tablename, policyname, cmd, roles
    FROM pg_policies
    WHERE schemaname IN ('public', 'zarx') AND permissive = 'PERMISSIVE'
),
with_actions AS (
    SELECT b.schemaname, b.tablename, b.policyname, b.roles, act.action
    FROM base b,
    LATERAL unnest(CASE WHEN b.cmd = 'ALL' THEN ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'] ELSE ARRAY[b.cmd] END) AS act(action)
),
expanded_policies AS (
    SELECT wa.schemaname, wa.tablename, wa.policyname, wa.action, r.role
    FROM with_actions wa,
    LATERAL unnest(CASE WHEN wa.roles = ARRAY['public'::name] THEN ARRAY['anon'::name, 'authenticated'::name, 'authenticator'::name, 'dashboard_user'::name] ELSE wa.roles END) AS r(role)
),
overlaps AS (
    SELECT schemaname, tablename, action, role, count(*) as n, string_agg(policyname, ' | ') as policies
    FROM expanded_policies
    GROUP BY schemaname, tablename, action, role
    HAVING count(*) > 1
)
SELECT tablename, action, role, n, policies
FROM overlaps
ORDER BY tablename, role, action;
