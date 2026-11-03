SELECT polname, polcmd, polpermissive, pg_get_expr(polqual, polrelid) as polqual FROM pg_policy WHERE polrelid = 'public.profiles'::regclass;
