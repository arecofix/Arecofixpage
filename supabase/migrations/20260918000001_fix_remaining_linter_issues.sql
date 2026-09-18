-- 1. GraphQL Exposure
COMMENT ON SCHEMA public IS '@graphql({"omit": true})';

-- 2. Extensions in Public Schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move extensions (ignore if they don't exist or are already moved, or if dependent objects block it we might need CASCADE, but let's try standard)
DO $$
BEGIN
    EXECUTE 'ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not move uuid-ossp: %', sqlerrm;
END $$;

DO $$
BEGIN
    EXECUTE 'ALTER EXTENSION pg_trgm SET SCHEMA extensions;';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not move pg_trgm: %', sqlerrm;
END $$;

DO $$
BEGIN
    EXECUTE 'ALTER EXTENSION pgcrypto SET SCHEMA extensions;';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not move pgcrypto: %', sqlerrm;
END $$;

-- Update search_path globally
ALTER DATABASE postgres SET search_path TO "$user", public, extensions;

-- Update search_path for critical roles explicitly to be safe
ALTER ROLE authenticator SET search_path = "$user", public, extensions;
ALTER ROLE postgres SET search_path = "$user", public, extensions;
ALTER ROLE anon SET search_path = "$user", public, extensions;
ALTER ROLE authenticated SET search_path = "$user", public, extensions;
ALTER ROLE service_role SET search_path = "$user", public, extensions;

-- 3. Missing RLS Policies

DO $$
BEGIN
    -- knowledge_base
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_base') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Allow authenticated read access to knowledge_base" ON public.knowledge_base FOR SELECT TO authenticated USING (true);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
        BEGIN
            EXECUTE 'CREATE POLICY "Allow authenticated delete access to knowledge_base" ON public.knowledge_base FOR DELETE TO authenticated USING (true);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- audit_logs
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on audit_logs" ON public.audit_logs FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- user_points
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_points') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on user_points" ON public.user_points FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- user_points_history
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_points_history') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on user_points_history" ON public.user_points_history FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- cash_registers
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cash_registers') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on cash_registers" ON public.cash_registers FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- cash_register_transactions
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cash_register_transactions') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on cash_register_transactions" ON public.cash_register_transactions FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- user_progress
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on user_progress" ON public.user_progress FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

    -- exam_results
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'exam_results') THEN
        BEGIN
            EXECUTE 'CREATE POLICY "Deny all client access on exam_results" ON public.exam_results FOR ALL USING (false);';
        EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;

END $$;
