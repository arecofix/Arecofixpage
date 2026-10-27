--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.4 (Ubuntu 15.4-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA _realtime;


--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: backups; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA backups;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '@graphql({"omit": true})';


--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgsodium;


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: zarx; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA zarx;


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat access method';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: aal_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: access_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.access_type AS ENUM (
    'one_time',
    'subscription',
    'trial'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.factor_type AS ENUM (
    'totp',
    'webauthn'
);


--
-- Name: repair_financial_stats; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.repair_financial_stats AS (
	total_facturado numeric,
	costo_repuestos numeric,
	ganancia_neta numeric,
	margen_porcentaje numeric,
	ticket_promedio numeric,
	total_reparaciones integer,
	reparaciones_vidrio integer,
	ingreso_extra_vidrio numeric,
	monthly_data json
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $_$
  SELECT 
    CASE 
      WHEN coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
      ) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      THEN coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
      )::uuid
      ELSE NULL
    END
$_$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  schema_is_cron bool;
BEGIN
  schema_is_cron = (
    SELECT n.nspname = 'cron'
    FROM pg_event_trigger_ddl_commands() AS ev
    LEFT JOIN pg_catalog.pg_namespace AS n
      ON ev.objid = n.oid
  );

  IF schema_is_cron
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;

  END IF;

END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: -
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


--
-- Name: accept_upsell_vidrio(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.accept_upsell_vidrio(p_tracking_code text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    UPDATE public.repairs
    SET upsell_vidrio = true
    WHERE tracking_code = p_tracking_code;
END;
$$;


--
-- Name: add_upsell_item_to_repair(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_upsell_item_to_repair(p_tracking_code text, p_product_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_repair_id uuid;
    v_product_price numeric;
BEGIN
    -- Get repair id based on tracking code
    SELECT id INTO v_repair_id
    FROM repairs
    WHERE tracking_code = p_tracking_code;

    IF v_repair_id IS NULL THEN
        RAISE EXCEPTION 'Repair not found';
    END IF;

    -- Get product price
    SELECT price INTO v_product_price
    FROM products
    WHERE id = p_product_id AND is_active = true;

    IF v_product_price IS NULL THEN
        RAISE EXCEPTION 'Product not found or inactive';
    END IF;

    -- Insert into repair_parts_used
    INSERT INTO repair_parts_used (
        repair_id,
        product_id,
        quantity,
        unit_price,
        tenant_id
    )
    SELECT
        v_repair_id,
        p_product_id,
        1,
        v_product_price,
        tenant_id
    FROM repairs
    WHERE id = v_repair_id;

    -- Note: updating the repairs table (final_cost / balance_to_pay)
    -- should be handled by the trigger `trg_update_repair_costs` which
    -- recalculates the costs whenever a part is added.

    RETURN true;
END;
$$;


--
-- Name: admin_reactivate_certificate(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_reactivate_certificate(p_cert_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
        ) INTO v_is_admin;
    ELSE
        v_is_admin := true;
    END IF;

    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'error', 'No autorizado.');
    END IF;

    UPDATE public.course_certificates
    SET 
        status = 'valid',
        updated_at = timezone('utc', now())
    WHERE id = p_cert_id;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', p_cert_id,
        'status', 'valid',
        'message', 'Certificado reactivado exitosamente.'
    );
END;
$$;


--
-- Name: admin_revoke_certificate(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_revoke_certificate(p_cert_id uuid, p_reason text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN := false;
    v_cert RECORD;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    -- Verificar que el usuario tenga rol administrativo
    IF v_admin_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = v_admin_id AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
        ) INTO v_is_admin;
    ELSE
        -- Permitir invocación desde service_role
        v_is_admin := true;
    END IF;

    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'error', 'No autorizado. Se requieren permisos de administrador.');
    END IF;

    -- Obtener datos del certificado
    SELECT * INTO v_cert FROM public.course_certificates WHERE id = p_cert_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Certificado no encontrado.');
    END IF;

    -- Actualizar a estado 'revoked'
    UPDATE public.course_certificates
    SET 
        status = 'revoked',
        updated_at = timezone('utc', now())
    WHERE id = p_cert_id;

    -- Registrar notificación administrativa para auditoría
    BEGIN
        INSERT INTO public.admin_notifications (
            tenant_id,
            title,
            message,
            type,
            source,
            is_read
        ) VALUES (
            v_cert.tenant_id,
            '🚫 Certificado Revocado',
            'El certificado de ' || v_cert.student_name || ' (ID: ' || v_cert.id || ') fue revocado por un administrador.' || COALESCE(' Motivo: ' || p_reason, ''),
            'warning',
            'academy',
            false
        );
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar si la tabla admin_notifications no está disponible
    END;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', p_cert_id,
        'status', 'revoked',
        'message', 'Certificado revocado exitosamente. La validación pública ahora es inválida.'
    );
END;
$$;


--
-- Name: assign_invoice_number_by_tenant(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_invoice_number_by_tenant() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := public.get_next_tenant_sequence(NEW.tenant_id, 'invoices', 'invoice_number');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: assign_user_as_employee(uuid, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid) RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Actualizar el perfil del usuario existente para que sea empleado
    UPDATE public.profiles 
    SET 
        role = p_role,
        tenant_id = p_tenant_id,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Retornar los datos actualizados usando alias explícitos
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.phone,
        p.role,
        p.avatar_url,
        p.tenant_id,
        p.created_at
    FROM public.profiles p
    WHERE p.id = p_user_id;
    
END;
$$;


--
-- Name: FUNCTION assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.assign_user_as_employee(p_user_id uuid, p_role text, p_tenant_id uuid) IS 'Asigna un usuario existente como empleado';


--
-- Name: auto_assign_cash_branch(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_assign_cash_branch() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_branch uuid;
BEGIN
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    IF v_branch IS NULL THEN
        SELECT id INTO v_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_branch;
    RETURN NEW;
END;
$$;


--
-- Name: auto_assign_order_branch(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_assign_order_branch() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_branch uuid;
BEGIN
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    IF v_branch IS NULL THEN
        SELECT id INTO v_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_branch;
    RETURN NEW;
END;
$$;


--
-- Name: auto_assign_repair_branch(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_assign_repair_branch() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_user_branch uuid;
BEGIN
    -- 1. Si ya viene con branch_id asignado, lo respetamos
    IF NEW.branch_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- 2. Obtenemos la sucursal del usuario actual
    IF auth.uid() IS NOT NULL THEN
        SELECT branch_id INTO v_user_branch FROM public.profiles WHERE id = auth.uid();
    END IF;

    -- 3. Fallback a la sucursal matriz del tenant si no tiene sucursal
    IF v_user_branch IS NULL THEN
        SELECT id INTO v_user_branch 
        FROM public.branches 
        WHERE tenant_id = NEW.tenant_id AND is_active = true
        ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC
        LIMIT 1;
    END IF;

    NEW.branch_id := v_user_branch;
    RETURN NEW;
END;
$$;


--
-- Name: can_edit_profile(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_edit_profile(target_role text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (
        p.role IN ('super_admin', 'tenant_owner', 'admin')
        OR (p.role IN ('staff', 'technician') AND target_role = 'user')
      )
  );
$$;


--
-- Name: check_and_notify_expiring_subscriptions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_and_notify_expiring_subscriptions() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_sub RECORD;
    v_count INT := 0;
    v_results JSONB := '[]'::jsonb;
BEGIN
    FOR v_sub IN 
        SELECT 
            s.id AS subscription_id,
            s.user_id,
            s.status,
            s.expires_at,
            s.grace_period_ends_at,
            p.email,
            COALESCE(NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Alumno Arecofix') AS student_name
        FROM public.academy_subscriptions s
        JOIN public.profiles p ON p.id = s.user_id
        WHERE s.expires_at <= now() 
          AND s.grace_period_ends_at > now()
          AND s.status IN ('grace_period', 'active')
          -- Asegurar idempotencia: no enviar más de una notificación de gracia para la misma expiración
          AND NOT EXISTS (
              SELECT 1 FROM public.academy_email_notifications n
              WHERE n.reference_id = s.id::text
                AND n.notification_type = 'grace_period_warning'
                AND n.sent_at >= s.expires_at
          )
    LOOP
        -- Actualizar estado a grace_period si aún figuraba active
        IF v_sub.status = 'active' THEN
            UPDATE public.academy_subscriptions
            SET status = 'grace_period', updated_at = now()
            WHERE id = v_sub.subscription_id;
        END IF;

        -- Registrar registro de notificación pendiente/enviada
        INSERT INTO public.academy_email_notifications (
            user_id,
            recipient_email,
            notification_type,
            subject,
            status,
            reference_id,
            metadata
        ) VALUES (
            v_sub.user_id,
            v_sub.email,
            'grace_period_warning',
            'Tu membresía de Arecofix Academy venció. Tienes 7 días de gracia.',
            'pending',
            v_sub.subscription_id::text,
            jsonb_build_object(
                'student_name', v_sub.student_name,
                'expires_at', v_sub.expires_at,
                'grace_period_ends_at', v_sub.grace_period_ends_at
            )
        );

        v_count := v_count + 1;
        v_results := v_results || jsonb_build_object(
            'subscription_id', v_sub.subscription_id,
            'email', v_sub.email,
            'student_name', v_sub.student_name,
            'expires_at', v_sub.expires_at,
            'grace_period_ends_at', v_sub.grace_period_ends_at
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'notifications_queued', v_count,
        'subscriptions', v_results
    );
END;
$$;


--
-- Name: check_and_update_membership_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_and_update_membership_status(p_user_id uuid DEFAULT auth.uid()) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_target_user UUID;
    v_sub RECORD;
    v_new_status TEXT;
    v_now TIMESTAMPTZ := now();
    v_plan_name TEXT := 'Sin Plan';
    v_plan_price NUMERIC := 0;
BEGIN
    v_target_user := COALESCE(p_user_id, auth.uid());

    IF v_target_user IS NULL THEN
        RETURN jsonb_build_object(
            'has_subscription', false,
            'status', 'none',
            'is_allowed', false,
            'error', 'Usuario no especificado'
        );
    END IF;

    -- Admins y superadmins siempre tienen acceso total
    IF EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = v_target_user
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        RETURN jsonb_build_object(
            'has_subscription', true,
            'status', 'active',
            'is_allowed', true,
            'is_admin', true,
            'expires_at', (v_now + INTERVAL '365 days')
        );
    END IF;

    -- Obtener la suscripción del usuario
    SELECT s.*, p.name as plan_name, p.price as plan_price
    INTO v_sub
    FROM public.academy_subscriptions s
    LEFT JOIN public.academy_plans p ON p.id = s.plan_id
    WHERE s.user_id = v_target_user
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'has_subscription', false,
            'status', 'none',
            'is_allowed', false
        );
    END IF;

    -- Evaluación temporal estricta con now() del servidor (previene manipulación del reloj cliente)
    IF v_now < v_sub.expires_at THEN
        v_new_status := 'active';
    ELSIF v_now <= v_sub.grace_period_ends_at THEN
        v_new_status := 'grace_period';
    ELSIF v_now <= (v_sub.grace_period_ends_at + INTERVAL '30 days') THEN
        v_new_status := 'suspended';
    ELSE
        v_new_status := 'expired';
    END IF;

    -- Actualizar estado si cambió
    IF v_new_status IS DISTINCT FROM v_sub.status THEN
        UPDATE public.academy_subscriptions
        SET status = v_new_status,
            updated_at = v_now
        WHERE id = v_sub.id;
    END IF;

    RETURN jsonb_build_object(
        'has_subscription', true,
        'subscription_id', v_sub.id,
        'status', v_new_status,
        'expires_at', v_sub.expires_at,
        'grace_period_ends_at', v_sub.grace_period_ends_at,
        'plan_name', COALESCE(v_sub.plan_name, 'Membresía Academia'),
        'plan_price', COALESCE(v_sub.plan_price, 0),
        'is_allowed', (v_new_status IN ('active', 'grace_period'))
    );
END;
$$;


--
-- Name: check_user_profile_exists(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_user_profile_exists() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid())) THEN
       RAISE EXCEPTION 'Tu cuenta no tiene un perfil configurado. Contacta a soporte.';
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: create_client(text, text, text, text, text, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_client(p_first_name text, p_last_name text, p_email text, p_phone text, p_address text, p_dni text, p_tenant_id uuid) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_new_id uuid;
BEGIN
    INSERT INTO public.clients (first_name, last_name, email, phone, address, dni, tenant_id)
    VALUES (p_first_name, p_last_name, NULLIF(p_email, ''), p_phone, p_address, p_dni, p_tenant_id)
    RETURNING id INTO v_new_id;
    RETURN json_build_object('id', v_new_id, 'status', 'created_success');
END;
$$;


--
-- Name: create_employee(text, text, text, text, text, text, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid) RETURNS TABLE(id uuid, email text, first_name text, last_name text, phone text, role text, avatar_url text, tenant_id uuid, created_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Crear usuario mediante la API de Supabase Auth (es el método estándar)
    -- Para evitar inyectar manualmente hashes, usamos la función interna de Supabase
    v_user_id := extensions.uuid_generate_v4(); -- O usa un trigger si prefieres
    
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
    VALUES (v_user_id, p_email, crypt(p_password, gen_salt('bf')), NOW(), 'authenticated');

    INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, avatar_url, tenant_id, created_at)
    VALUES (v_user_id, p_email, p_first_name, p_last_name, p_phone, p_role, p_avatar_url, p_tenant_id, NOW());

    RETURN QUERY SELECT p.id, p.email, p.first_name, p.last_name, p.phone, p.role, p.avatar_url, p.tenant_id, p.created_at
                 FROM public.profiles p WHERE p.id = v_user_id;
END;
$$;


--
-- Name: FUNCTION create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.create_employee(p_first_name text, p_last_name text, p_email text, p_phone text, p_role text, p_password text, p_avatar_url text, p_tenant_id uuid) IS 'Crea un nuevo empleado con usuario y perfil, usando crypt() en lugar de gen_salt()';


--
-- Name: create_guest_profile(text, text, text, text, text, text, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_guest_profile(p_first_name text, p_last_name text DEFAULT ''::text, p_email text DEFAULT ''::text, p_phone text DEFAULT ''::text, p_address text DEFAULT ''::text, p_dni text DEFAULT ''::text, p_tenant_id uuid DEFAULT NULL::uuid, p_branch_id uuid DEFAULT NULL::uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_caller_role   text;
  v_caller_tenant uuid;
  v_new_id        uuid := gen_random_uuid();
  v_tenant_id     uuid;
  v_result        json;
BEGIN
  -- 1. Verificar rol del usuario
  SELECT role, tenant_id
    INTO v_caller_role, v_caller_tenant
    FROM public.profiles
   WHERE id = auth.uid()
   LIMIT 1;

  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: caller has no profile';
  END IF;

  IF v_caller_role NOT IN ('admin', 'staff', 'technician', 'tenant_owner', 'super_admin') THEN
    RAISE EXCEPTION 'Forbidden: role % cannot create guest profiles', v_caller_role;
  END IF;

  -- 2. Resolver tenant_id
  v_tenant_id := COALESCE(p_tenant_id, v_caller_tenant);
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Cannot resolve tenant_id for guest profile';
  END IF;

  -- 3. Insertar en auth.users primero (esto dispara el trigger handle_new_user)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    CASE WHEN p_email IS NULL OR TRIM(p_email) = '' THEN NULL ELSE p_email END,
    '{"is_guest": true}'::jsonb,
    now(), now()
  );

  -- 4. Insertar perfil invitado (con ON CONFLICT por si el trigger ya lo insertó)
  INSERT INTO public.profiles (
    id, first_name, last_name, email, phone,
    address, dni, is_guest, role,
    tenant_id, branch_id, is_active,
    created_at, updated_at
  ) VALUES (
    v_new_id, p_first_name, COALESCE(p_last_name, ''), COALESCE(p_email, ''),
    COALESCE(p_phone, ''), COALESCE(p_address, ''), COALESCE(p_dni, ''),
    true, 'user', v_tenant_id, p_branch_id, true, now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    dni = EXCLUDED.dni,
    is_guest = EXCLUDED.is_guest,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    branch_id = EXCLUDED.branch_id;

  -- 5. Retornar JSON
  SELECT row_to_json(p)
    INTO v_result
    FROM public.profiles p
   WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;


--
-- Name: custom_access_token_hook(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.custom_access_token_hook(event jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $_$
DECLARE
    claims jsonb;
    user_record record;
    parsed_uuid uuid;
BEGIN
    -- Validamos que el user_id sea un UUID válido antes de hacer el cast
    IF event->>'user_id' IS NULL OR event->>'user_id' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        -- Si no es un UUID válido (por ej. ID de Google), devolvemos el event tal cual
        RETURN event;
    END IF;

    parsed_uuid := (event->>'user_id')::uuid;

    -- Buscamos los datos del usuario en Profiles
    SELECT role, tenant_id, branch_id INTO user_record 
    FROM public.profiles 
    WHERE id = parsed_uuid;

    claims := event->'claims';

    -- Si el usuario tiene perfil, inyectamos los datos en el JWT
    IF user_record.tenant_id IS NOT NULL THEN
        claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_record.tenant_id));
        claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(user_record.role, 'user')));
        
        IF user_record.branch_id IS NOT NULL THEN
            claims := jsonb_set(claims, '{branch_id}', to_jsonb(user_record.branch_id));
        END IF;
    END IF;

    -- Devolvemos el token con la metadata inyectada
    RETURN jsonb_set(event, '{claims}', claims);
END;
$_$;


--
-- Name: decrement_stock(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_stock(row_id uuid, amount integer) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  UPDATE products
  SET stock = stock - amount
  WHERE id = row_id;
END;
$$;


--
-- Name: deduct_product_stock_v3(uuid, uuid, integer, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.deduct_product_stock_v3(p_product_id uuid, p_branch_id uuid, p_quantity_to_deduct integer, p_tenant_id uuid DEFAULT NULL::uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Inserción/Actualización atómica
    INSERT INTO public.product_stock_per_branch (product_id, branch_id, tenant_id, quantity, updated_at)
    VALUES (p_product_id, p_branch_id, p_tenant_id, 0, NOW())
    ON CONFLICT (product_id, branch_id) 
    DO UPDATE SET 
        quantity = GREATEST(0, product_stock_per_branch.quantity - p_quantity_to_deduct),
        updated_at = NOW();

    -- Sincronización global
    UPDATE public.products
    SET stock = (SELECT COALESCE(SUM(quantity), 0) FROM public.product_stock_per_branch WHERE product_id = p_product_id),
        updated_at = NOW()
    WHERE id = p_product_id;
END;
$$;


--
-- Name: delete_old_audit_logs(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_old_audit_logs(end_date timestamp without time zone) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    DELETE FROM audit_logs WHERE created_at < end_date;
END;
$$;


--
-- Name: enforce_retail_price_for_guests(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enforce_retail_price_for_guests() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    current_uid uuid;
    prod public.products;
    calculated_retail_price numeric;
BEGIN
    current_uid := auth.uid();
    
    -- If guest (not logged in)
    IF current_uid IS NULL THEN
        -- Fetch the product
        SELECT * INTO prod FROM public.products WHERE id = NEW.product_id;
        
        IF FOUND THEN
            calculated_retail_price := public.retail_price(prod);
            NEW.unit_price := calculated_retail_price;
            NEW.subtotal := calculated_retail_price * NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: expire_stale_enrollments(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.expire_stale_enrollments() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Marca como sin acceso a aquellos enrollments cuyo expires_at pasó y que aún tienen acceso
  UPDATE public.enrollments
  SET 
    has_access = false,
    revoked_at = now(),
    reason = 'Subscription or access time expired (Auto-cron)'
  WHERE 
    has_access = true 
    AND expires_at IS NOT NULL 
    AND expires_at < now();
END;
$$;


--
-- Name: fix_repair_aggregates(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fix_repair_aggregates() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN NEW;
END;
$$;


--
-- Name: fn_assign_tracking_code(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_assign_tracking_code() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
        NEW.tracking_code := 'AF-' || lpad(nextval('repair_tracking_seq')::text, 3, '0');
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_auto_generate_invoice(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_auto_generate_invoice() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Only generate if it's marked as completed/paid
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
       INSERT INTO public.invoices (tenant_id, branch_id, customer_id, reference_type, reference_id, subtotal)
       VALUES (NEW.tenant_id, NEW.branch_id, NEW.customer_id, 'sale', NEW.id, NEW.price_final);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_calculate_invoice_taxes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calculate_invoice_taxes() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Si no hay subtotal, asumimos cero temporalmente
    IF NEW.subtotal IS NULL THEN NEW.subtotal := 0; END IF;
    IF NEW.discount IS NULL THEN NEW.discount := 0; END IF;
    
    -- Calcula base imponible
    NEW.net_amount := NEW.subtotal - NEW.discount;
    -- Calcula el 21% de IVA
    NEW.tax_amount := NEW.net_amount * 0.21;
    -- Calcula el Total
    NEW.total_amount := NEW.net_amount + NEW.tax_amount;
    
    RETURN NEW;
END;
$$;


--
-- Name: fn_calculate_repair_margins(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calculate_repair_margins() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Calculate margin purely from NEW row fields — no subquery on repairs
    -- This avoids any FOR UPDATE + aggregate conflict
    RETURN NEW;
END;
$$;


--
-- Name: fn_calculate_repair_profit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calculate_repair_profit() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Calculate profit purely from NEW row fields — no subquery on repairs
    RETURN NEW;
END;
$$;


--
-- Name: fn_manage_stock_on_repair_part(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_manage_stock_on_repair_part() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_branch_id uuid;
    v_current_stock INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;
        
        SELECT quantity INTO v_current_stock 
        FROM public.product_stock_per_branch 
        WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        
        IF v_current_stock IS NULL OR v_current_stock < NEW.quantity THEN
            RAISE EXCEPTION 'Stock insuficiente para el repuesto ID %. Disponible: %, Requerido: %', NEW.product_id, COALESCE(v_current_stock, 0), NEW.quantity;
        END IF;

        UPDATE public.product_stock_per_branch 
        SET quantity = quantity - NEW.quantity, updated_at = NOW()
        WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = OLD.repair_id;
        
        UPDATE public.product_stock_per_branch 
        SET quantity = quantity + OLD.quantity, updated_at = NOW()
        WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
        
        RETURN OLD;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Only if quantity or product changed
        IF OLD.quantity != NEW.quantity OR OLD.product_id != NEW.product_id THEN
            SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;
            
            -- Restore old stock
            UPDATE public.product_stock_per_branch 
            SET quantity = quantity + OLD.quantity
            WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
            
            -- Deduct new stock
            SELECT quantity INTO v_current_stock 
            FROM public.product_stock_per_branch 
            WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
            
            IF v_current_stock IS NULL OR v_current_stock < NEW.quantity THEN
                RAISE EXCEPTION 'Stock insuficiente para el repuesto ID %. Disponible: %, Requerido: %', NEW.product_id, COALESCE(v_current_stock, 0), NEW.quantity;
            END IF;
            
            UPDATE public.product_stock_per_branch 
            SET quantity = quantity - NEW.quantity, updated_at = NOW()
            WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        END IF;
        
        RETURN NEW;
    END IF;
END;
$$;


--
-- Name: fn_notify_repair_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_notify_repair_update() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    INSERT INTO public.notifications (user_id, branch_id, tenant_id, title, message, type, link)
    SELECT 
        p.id, 
        NEW.branch_id, 
        NEW.tenant_id, 
        'Reparación Actualizada', 
        'La orden #' || NEW.tracking_code || ' ha pasado a: ' || COALESCE((SELECT name FROM public.repair_status_types WHERE id = NEW.current_status_id), 'Desconocido'),
        'info',
        '/admin/repairs/edit/' || NEW.id
    FROM public.profiles p
    WHERE p.branch_id = NEW.branch_id AND p.role IN ('admin', 'manager', 'staff');
    
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_d1_webhook(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_d1_webhook() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  payload jsonb;
  target_record jsonb;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_record := row_to_json(OLD)::jsonb;
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'old_record', target_record,
      'record', target_record
    );
  ELSE
    target_record := row_to_json(NEW)::jsonb;
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', target_record,
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END
    );
  END IF;

  PERFORM net.http_post(
    url := 'https://arecofix-d1-failover.ezequielenrico15.workers.dev/sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer arecofix-d1-sync-secret-20261019'
    ),
    body := payload,
    timeout_milliseconds := 5000
  );

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'D1 Sync webhook dispatch failed: %', SQLERRM;
    IF (TG_OP = 'DELETE') THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
END;
$$;


--
-- Name: fn_sync_repair_part_costs(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_repair_part_costs() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Si es INSERT o UPDATE, actualiza la reparación del NEW.repair_id
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.repairs 
        SET costo_repuesto = (
            SELECT COALESCE(SUM(quantity * unit_price_at_time), 0) 
            FROM public.repair_parts_used 
            WHERE repair_id = NEW.repair_id
        )
        WHERE id = NEW.repair_id;
    END IF;

    -- Si es DELETE, actualiza usando el OLD.repair_id
    IF (TG_OP = 'DELETE') THEN
        UPDATE public.repairs 
        SET costo_repuesto = (
            SELECT COALESCE(SUM(quantity * unit_price_at_time), 0) 
            FROM public.repair_parts_used 
            WHERE repair_id = OLD.repair_id
        )
        WHERE id = OLD.repair_id;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_repair_part_stock(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_repair_part_stock() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    SET row_security TO 'off'
    AS $$
DECLARE
    _branch_id uuid;
BEGIN
    SELECT branch_id INTO _branch_id FROM public.repairs WHERE id = COALESCE(NEW.repair_id, OLD.repair_id);
    
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.product_stock_per_branch SET quantity = quantity - NEW.quantity WHERE product_id = NEW.product_id AND branch_id = _branch_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.product_stock_per_branch SET quantity = quantity + OLD.quantity WHERE product_id = OLD.product_id AND branch_id = _branch_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE public.product_stock_per_branch SET quantity = quantity - (NEW.quantity - OLD.quantity) WHERE product_id = NEW.product_id AND branch_id = _branch_id;
    END IF;
    RETURN COALESCE(NEW, OLD); -- Retorno seguro
END;
$$;


--
-- Name: fn_update_product_search(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_update_product_search() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  NEW.search_tsv := 
    setweight(to_tsvector('spanish', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.barcode, '')), 'C');
  RETURN NEW;
END;
$$;


--
-- Name: force_tenant_isolation(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.force_tenant_isolation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    context_tenant_id uuid;
    v_user_role text;
BEGIN
    context_tenant_id := public.get_current_tenant_id();
    
    v_user_role := current_setting('request.jwt.claims', true)::jsonb ->> 'user_role';
    IF v_user_role IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT role INTO v_user_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    END IF;

    IF v_user_role = 'super_admin' OR public.is_super_admin() THEN
        IF TG_OP = 'INSERT' AND NEW.tenant_id IS NULL THEN
            NEW.tenant_id := context_tenant_id;
        END IF;
        RETURN NEW;
    END IF;

    IF context_tenant_id IS NOT NULL THEN
        IF TG_OP = 'INSERT' THEN
            NEW.tenant_id := context_tenant_id;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.tenant_id != NEW.tenant_id THEN
                RAISE EXCEPTION 'Aislamiento crítico: Prohibido mover registros entre Tenants.';
            END IF;
            NEW.tenant_id := OLD.tenant_id;
        END IF;
    ELSE
        IF TG_OP = 'INSERT' THEN
            IF NEW.tenant_id IS NULL THEN
                RAISE EXCEPTION 'Aislamiento crítico: Usuario sin tenant asignado y no se proporcionó tenant_id explícito.';
            END IF;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.tenant_id IS NOT NULL AND NEW.tenant_id IS NOT NULL AND OLD.tenant_id != NEW.tenant_id THEN
                RAISE EXCEPTION 'Aislamiento crítico: Prohibido mover registros entre Tenants.';
            END IF;
            NEW.tenant_id := OLD.tenant_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: get_admin_business_dashboard_metrics(uuid, text, timestamp with time zone, timestamp with time zone, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_business_dashboard_metrics(p_tenant_id uuid DEFAULT NULL::uuid, p_range text DEFAULT 'month'::text, p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_branch_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_is_service_role boolean := false;
    v_is_super_admin boolean := false;
    v_tenant_id uuid;
    v_start timestamptz;
    v_end timestamptz;
    v_income numeric := 0;
    v_expense numeric := 0;
    v_net_balance numeric := 0;
    v_ecommerce_orders_count bigint := 0;
    v_ecommerce_amount numeric := 0;
    v_active_repairs_count bigint := 0;
    v_delayed_repairs_count bigint := 0;
    v_active_subscriptions_count bigint := 0;
    v_academy_revenue numeric := 0;
    v_critical_stock_count bigint := 0;
    v_critical_stock_items jsonb := '[]'::jsonb;
    v_overdue_pickup_repairs jsonb := '[]'::jsonb;
    v_expiring_grace_subscriptions jsonb := '[]'::jsonb;
    v_trend_6_months jsonb := '[]'::jsonb;
    v_repairs_revenue numeric := 0;
    v_revenue_by_origin jsonb;
    v_primary_tenant_id uuid;
BEGIN
    -- 0. Detectar Tenant Principal de Arecofix como fallback seguro
    SELECT id INTO v_primary_tenant_id
    FROM public.tenants
    WHERE custom_domain = 'arecofix.com.ar' OR slug = 'arecofix'
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_primary_tenant_id IS NULL THEN
        v_primary_tenant_id := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid;
    END IF;

    -- 1. Identificar permisos del llamador (Service Role o Super Admin)
    BEGIN
        v_is_service_role := (
            current_user = 'postgres'
            OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
            OR auth.jwt() ->> 'role' = 'service_role'
        );
    EXCEPTION WHEN OTHERS THEN
        v_is_service_role := (current_user = 'postgres');
    END;

    v_is_super_admin := v_is_service_role OR public.is_super_admin();

    -- 2. Resolución de Tenant estricta y segura
    IF v_is_super_admin THEN
        -- Si es super_admin o backend service, puede especificar tenant o ver el principal
        v_tenant_id := COALESCE(p_tenant_id, public.get_current_tenant_id(), v_primary_tenant_id);
    ELSE
        -- Si es un usuario regular o administrador de sucursal, aislar en su tenant
        v_tenant_id := public.get_current_tenant_id();
        IF v_tenant_id IS NULL AND auth.uid() IS NOT NULL THEN
            SELECT p.tenant_id INTO v_tenant_id FROM public.profiles p WHERE p.id = auth.uid();
        END IF;

        IF v_tenant_id IS NULL THEN
            RETURN jsonb_build_object(
                'error', 'Tenant context required'
            );
        END IF;

        IF p_tenant_id IS NOT NULL AND p_tenant_id != v_tenant_id THEN
            RETURN jsonb_build_object(
                'error', 'Acceso denegado a métricas de otro tenant'
            );
        END IF;
    END IF;

    -- 3. Rango de Fechas respetando zona horaria de Argentina (America/Argentina/Buenos_Aires - UTC-3)
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        v_start := p_start_date;
        v_end := p_end_date;
    ELSIF p_range = 'today' THEN
        v_start := date_trunc('day', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    ELSIF p_range = '7days' THEN
        v_start := now() - INTERVAL '7 days';
        v_end := now();
    ELSIF p_range = 'year' THEN
        v_start := date_trunc('year', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    ELSE -- 'month' por defecto
        v_start := date_trunc('month', now() AT TIME ZONE 'America/Argentina/Buenos_Aires') AT TIME ZONE 'America/Argentina/Buenos_Aires';
        v_end := now();
    END IF;

    -- 4. Caja (Ingresos, Egresos y Balance de Tesorería)
    SELECT 
        COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0),
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)
    INTO v_income, v_expense
    FROM public.cash_movements
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR branch_id IS NULL)
      AND created_at >= v_start
      AND created_at <= v_end;

    v_net_balance := v_income - v_expense;

    -- 5. Ventas E-commerce
    SELECT 
        COUNT(id),
        COALESCE(SUM(COALESCE(total_amount, total, 0)), 0)
    INTO v_ecommerce_orders_count, v_ecommerce_amount
    FROM public.orders
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND status IN ('paid', 'shipped', 'completed', 'delivered')
      AND created_at >= v_start
      AND created_at <= v_end;

    -- 6. Reparaciones Activas y en Demora (> 7 días)
    SELECT 
        COUNT(id),
        COUNT(id) FILTER (WHERE COALESCE(received_at, created_at) < (now() - INTERVAL '7 days'))
    INTO v_active_repairs_count, v_delayed_repairs_count
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND deleted_at IS NULL
      AND current_status_id NOT IN (6, 7); -- 6=Entregado, 7=Cancelado

    -- Facturación de reparaciones entregadas/completadas en el período
    SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost, 0)), 0)
    INTO v_repairs_revenue
    FROM public.repairs
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND current_status_id IN (5, 6)
      AND COALESCE(completed_at, updated_at, created_at) >= v_start
      AND COALESCE(completed_at, updated_at, created_at) <= v_end;

    -- 7. Alumnos en Academia y Facturación
    SELECT COUNT(DISTINCT COALESCE(user_id::text, student_email))
    INTO v_active_subscriptions_count
    FROM (
        SELECT user_id, NULL::text AS student_email FROM public.academy_subscriptions
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND status = 'active'
        UNION
        SELECT user_id, email AS student_email FROM public.course_enrollments
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id) AND status IN ('confirmed', 'active')
    ) active_students;

    SELECT COALESCE(SUM(amount), 0)
    INTO v_academy_revenue
    FROM (
        SELECT amount FROM public.academy_payments
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
          AND status IN ('approved', 'paid')
          AND created_at >= v_start
          AND created_at <= v_end
        UNION ALL
        SELECT amount FROM public.cash_movements
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
          AND type = 'income'
          AND category IN ('beca', 'academy', 'curso', 'cursos', 'academia')
          AND created_at >= v_start
          AND created_at <= v_end
    ) ap;

    -- 8. Stock Crítico
    SELECT COUNT(id)
    INTO v_critical_stock_count
    FROM public.products
    WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
      AND (p_branch_id IS NULL OR branch_id = p_branch_id OR is_global = true)
      AND deleted_at IS NULL
      AND is_active = true
      AND COALESCE(stock, 0) <= COALESCE(min_stock_alert, 5);

    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_critical_stock_items
    FROM (
        SELECT 
            p.id, 
            p.name, 
            COALESCE(p.sku, 'S/SKU') AS sku, 
            COALESCE(p.stock, 0) AS stock, 
            COALESCE(p.min_stock_alert, 5) AS min_stock_alert, 
            COALESCE(p.price, 0) AS price
        FROM public.products p
        WHERE (v_tenant_id IS NULL OR p.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR p.branch_id = p_branch_id OR p.is_global = true)
          AND p.deleted_at IS NULL
          AND p.is_active = true
          AND COALESCE(p.stock, 0) <= COALESCE(min_stock_alert, 5)
        ORDER BY p.stock ASC, p.name ASC
        LIMIT 10
    ) sub;

    -- 9. Reparaciones Listas para Retirar Demoradas (> 48hs)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_overdue_pickup_repairs
    FROM (
        SELECT 
            r.id,
            COALESCE(r.tracking_code, 'REP-' || r.repair_number::text, 'S/N') AS tracking_code,
            COALESCE(NULLIF(TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')), ''), 'Cliente') AS client_name,
            COALESCE(r.completed_at, r.updated_at, r.created_at) AS ready_since,
            GREATEST(0, ROUND(EXTRACT(EPOCH FROM (now() - COALESCE(r.completed_at, r.updated_at, r.created_at))) / 3600))::integer AS hours_waiting,
            COALESCE(r.final_cost, r.estimated_cost, 0) AS final_cost
        FROM public.repairs r
        LEFT JOIN public.profiles p ON p.id = r.client_id
        WHERE (v_tenant_id IS NULL OR r.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
          AND r.deleted_at IS NULL
          AND r.current_status_id = 5
          AND COALESCE(r.completed_at, r.updated_at, r.created_at) < (now() - INTERVAL '48 hours')
        ORDER BY COALESCE(r.completed_at, r.updated_at, r.created_at) ASC
        LIMIT 10
    ) sub;

    -- 10. Suscripciones en Grace Period por Vencer (<= 3 días)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_expiring_grace_subscriptions
    FROM (
        SELECT 
            s.id,
            s.user_id,
            COALESCE(prof.email, u.email, '') AS user_email,
            COALESCE(NULLIF(TRIM(COALESCE(prof.first_name, '') || ' ' || COALESCE(prof.last_name, '')), ''), u.raw_user_meta_data->>'full_name', split_part(COALESCE(prof.email, u.email, ''), '@', 1), 'Alumno') AS student_name,
            s.grace_period_ends_at,
            GREATEST(0, ROUND(EXTRACT(EPOCH FROM (s.grace_period_ends_at - now())) / 86400))::integer AS days_left
        FROM public.academy_subscriptions s
        LEFT JOIN auth.users u ON u.id = s.user_id
        LEFT JOIN public.profiles prof ON prof.id = s.user_id
        WHERE (v_tenant_id IS NULL OR s.tenant_id = v_tenant_id)
          AND s.status = 'grace_period'
          AND s.grace_period_ends_at IS NOT NULL
          AND s.grace_period_ends_at <= (now() + INTERVAL '3 days')
        ORDER BY s.grace_period_ends_at ASC
        LIMIT 10
    ) sub;

    -- 11. Gráfico de Tendencia Histórica (Últimos 6 meses)
    WITH months AS (
        SELECT 
            to_char(d, 'YYYY-MM') AS period,
            to_char(d, 'Mon') AS label
        FROM generate_series(
            date_trunc('month', now() - INTERVAL '5 months'),
            date_trunc('month', now()),
            '1 month'::interval
        ) d
    ),
    monthly_cash AS (
        SELECT 
            to_char(cm.created_at, 'YYYY-MM') AS period,
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'income'), 0) AS income,
            COALESCE(SUM(cm.amount) FILTER (WHERE cm.type = 'expense'), 0) AS expense
        FROM public.cash_movements cm
        WHERE (v_tenant_id IS NULL OR cm.tenant_id = v_tenant_id)
          AND (p_branch_id IS NULL OR cm.branch_id = p_branch_id OR cm.branch_id IS NULL)
          AND cm.created_at >= (date_trunc('month', now() - INTERVAL '5 months'))
        GROUP BY 1
    )
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'period', m.period,
        'label', m.label,
        'month', m.period,
        'income', COALESCE(mc.income, 0),
        'expense', COALESCE(mc.expense, 0),
        'net_balance', COALESCE(mc.income, 0) - COALESCE(mc.expense, 0)
    ) ORDER BY m.period ASC), '[]'::jsonb)
    INTO v_trend_6_months
    FROM months m
    LEFT JOIN monthly_cash mc ON mc.period = m.period;

    -- 12. Origen de Ingresos
    v_revenue_by_origin := jsonb_build_object(
        'ecommerce', v_ecommerce_amount,
        'repairs', v_repairs_revenue,
        'academy', v_academy_revenue
    );

    -- 13. Consolidación de Respuesta (Completa y con aliases retrocompatibles)
    RETURN jsonb_build_object(
        'period', jsonb_build_object(
            'range', p_range,
            'start_date', v_start,
            'end_date', v_end
        ),
        'kpis', jsonb_build_object(
            'total_income', v_income,
            'total_expense', v_expense,
            'net_balance', v_net_balance,
            'ecommerce_orders_count', v_ecommerce_orders_count,
            'ecommerce_amount', v_ecommerce_amount,
            'active_repairs_count', v_active_repairs_count,
            'delayed_repairs_count', v_delayed_repairs_count,
            'has_delayed_alert', (v_delayed_repairs_count > 5),
            'active_subscriptions_count', v_active_subscriptions_count,
            'academy_revenue', v_academy_revenue,
            'critical_stock_count', v_critical_stock_count
        ),
        'alerts', jsonb_build_object(
            'critical_stock_count', v_critical_stock_count,
            'critical_stock_items', v_critical_stock_items,
            'overdue_pickup_repairs', v_overdue_pickup_repairs,
            'expiring_grace_subscriptions', v_expiring_grace_subscriptions
        ),
        'charts', jsonb_build_object(
            'trend_6_months', v_trend_6_months,
            'revenue_by_origin', v_revenue_by_origin
        ),
        -- Aliases para clientes o tests que consuman 'metrics' o 'trend'
        'metrics', jsonb_build_object(
            'total_income', v_income,
            'total_expense', v_expense,
            'net_cashflow', v_net_balance,
            'ecommerce_paid_count', v_ecommerce_orders_count,
            'ecommerce_paid_revenue', v_ecommerce_amount,
            'active_repairs_count', v_active_repairs_count,
            'delayed_repairs_count', v_delayed_repairs_count,
            'active_subscriptions_count', v_active_subscriptions_count,
            'academy_revenue', v_academy_revenue
        ),
        'revenue_by_origin', v_revenue_by_origin,
        'trend', v_trend_6_months
    );
END;
$$;


--
-- Name: get_admin_dashboard_analytics(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_dashboard_analytics(p_range text DEFAULT 'month'::text, p_branch_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_start_date timestamptz;
  v_end_date timestamptz;
  v_now_arg timestamptz;
  v_top_products jsonb;
  v_customer_rfm jsonb;
  v_repairs_by_brand jsonb;
  v_repairs_by_model jsonb;
  v_common_issues jsonb;
  v_total_customers int;
  v_repeat_customers int;
  v_repeat_rate numeric;
  v_role text;
  v_current_user text;
BEGIN
  v_current_user := CURRENT_USER;
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'anon'
  ) INTO v_role;

  IF v_current_user NOT IN ('postgres', 'supabase_admin') 
     AND v_role NOT IN ('super_admin', 'service_role') 
     AND NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('error', 'Acceso denegado. Se requieren privilegios de Super Administrador.');
  END IF;

  -- Timezone Argentina UTC-3
  v_now_arg := now() AT TIME ZONE 'America/Argentina/Buenos_Aires';
  v_end_date := now();

  IF p_range = 'today' THEN
    v_start_date := date_trunc('day', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  ELSIF p_range = '7days' THEN
    v_start_date := (v_now_arg - interval '7 days');
  ELSIF p_range = 'year' THEN
    v_start_date := date_trunc('year', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  ELSE -- 'month'
    v_start_date := date_trunc('month', v_now_arg) AT TIME ZONE 'America/Argentina/Buenos_Aires';
  END IF;

  -- 1. Top 10 Selling Products
  SELECT jsonb_agg(row_to_json(tp))
  INTO v_top_products
  FROM (
    SELECT 
      p.id AS product_id,
      COALESCE(oi.product_name, p.name, 'Producto Desconocido') AS product_name,
      COALESCE(p.sku, 'S/SKU') AS sku,
      COALESCE(c.name, 'General') AS category_name,
      SUM(oi.quantity)::int AS units_sold,
      SUM(COALESCE(oi.subtotal, oi.quantity * oi.unit_price))::numeric AS revenue,
      COALESCE(p.stock, 0)::int AS current_stock
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
      AND (p_range = 'year' OR o.created_at >= v_start_date)
      AND (p_branch_id IS NULL OR o.branch_id = p_branch_id)
    GROUP BY p.id, oi.product_name, p.name, p.sku, c.name, p.stock
    ORDER BY units_sold DESC, revenue DESC
    LIMIT 10
  ) tp;

  -- If no sales in current period, fallback to all-time top products so UI has real context
  IF v_top_products IS NULL OR jsonb_array_length(v_top_products) = 0 THEN
    SELECT jsonb_agg(row_to_json(tp_all))
    INTO v_top_products
    FROM (
      SELECT 
        p.id AS product_id,
        COALESCE(oi.product_name, p.name, 'Producto Desconocido') AS product_name,
        COALESCE(p.sku, 'S/SKU') AS sku,
        COALESCE(c.name, 'General') AS category_name,
        SUM(oi.quantity)::int AS units_sold,
        SUM(COALESCE(oi.subtotal, oi.quantity * oi.unit_price))::numeric AS revenue,
        COALESCE(p.stock, 0)::int AS current_stock
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
      GROUP BY p.id, oi.product_name, p.name, p.sku, c.name, p.stock
      ORDER BY units_sold DESC, revenue DESC
      LIMIT 10
    ) tp_all;
  END IF;

  -- 2. Customer RFM Segmentation & Repeat Purchase Rate
  WITH customer_stats AS (
    SELECT 
      COALESCE(NULLIF(o.customer_name, ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Cliente') AS customer_name,
      COALESCE(NULLIF(o.customer_email, ''), p.email, 'Sin Email') AS customer_email,
      count(*)::int AS frequency,
      sum(o.total)::numeric AS monetary,
      max(o.created_at) AS last_order_date
    FROM orders o
    LEFT JOIN profiles p ON o.user_id = p.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
    GROUP BY 1, 2
  )
  SELECT 
    count(*),
    count(*) FILTER (WHERE frequency > 1),
    ROUND(100.0 * count(*) FILTER (WHERE frequency > 1) / NULLIF(count(*), 0), 1)
  INTO v_total_customers, v_repeat_customers, v_repeat_rate
  FROM customer_stats;

  WITH customer_stats AS (
    SELECT 
      COALESCE(NULLIF(o.customer_name, ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Cliente') AS customer_name,
      COALESCE(NULLIF(o.customer_email, ''), p.email, 'Sin Email') AS customer_email,
      count(*)::int AS frequency,
      sum(o.total)::numeric AS monetary,
      max(o.created_at) AS last_order_date
    FROM orders o
    LEFT JOIN profiles p ON o.user_id = p.id
    WHERE o.status IN ('paid', 'completed', 'shipped', 'delivered')
    GROUP BY 1, 2
  )
  SELECT jsonb_agg(row_to_json(rfm_top))
  INTO v_customer_rfm
  FROM (
    SELECT 
      customer_name,
      customer_email,
      frequency,
      monetary,
      to_char(last_order_date AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS last_order_date,
      CASE 
        WHEN frequency >= 3 OR monetary >= 50000 THEN 'Campeón (LTV Alto)'
        WHEN frequency >= 2 THEN 'Cliente Frecuente'
        WHEN last_order_date < now() - interval '60 days' THEN 'En Riesgo de Churn'
        ELSE 'Nuevo / Ocasional'
      END AS segment
    FROM customer_stats
    ORDER BY monetary DESC, frequency DESC
    LIMIT 10
  ) rfm_top;

  -- 3. Repairs by Brand
  SELECT jsonb_agg(row_to_json(rb))
  INTO v_repairs_by_brand
  FROM (
    SELECT 
      COALESCE(b.name, 'Sin Marca') AS brand_name,
      count(*)::int AS repair_count,
      ROUND(100.0 * count(*) / NULLIF((SELECT count(*) FROM repairs WHERE deleted_at IS NULL), 0), 1) AS percentage
    FROM repairs r
    LEFT JOIN customer_devices cd ON r.device_id = cd.id
    LEFT JOIN models m ON cd.model_id = m.id
    LEFT JOIN brands b ON m.brand_id = b.id
    WHERE r.deleted_at IS NULL
      AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
    GROUP BY b.name
    ORDER BY repair_count DESC
    LIMIT 8
  ) rb;

  -- 4. Repairs by Model
  SELECT jsonb_agg(row_to_json(rm))
  INTO v_repairs_by_model
  FROM (
    SELECT 
      COALESCE(m.name, 'Sin Modelo') AS model_name,
      COALESCE(b.name, 'Sin Marca') AS brand_name,
      count(*)::int AS repair_count
    FROM repairs r
    LEFT JOIN customer_devices cd ON r.device_id = cd.id
    LEFT JOIN models m ON cd.model_id = m.id
    LEFT JOIN brands b ON m.brand_id = b.id
    WHERE r.deleted_at IS NULL
      AND (p_branch_id IS NULL OR r.branch_id = p_branch_id)
    GROUP BY m.name, b.name
    ORDER BY repair_count DESC
    LIMIT 8
  ) rm;

  -- 5. Common Workshop Issues
  SELECT jsonb_agg(row_to_json(ci))
  INTO v_common_issues
  FROM (
    SELECT 
      COALESCE(NULLIF(TRIM(issue_description), ''), 'Sin especificar') AS issue,
      count(*)::int AS count
    FROM repairs
    WHERE deleted_at IS NULL 
      AND issue_description IS NOT NULL 
      AND issue_description <> ''
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    GROUP BY issue
    ORDER BY count DESC
    LIMIT 5
  ) ci;

  RETURN jsonb_build_object(
    'period', jsonb_build_object(
      'range', p_range,
      'start_date', v_start_date,
      'end_date', v_end_date
    ),
    'top_products', COALESCE(v_top_products, '[]'::jsonb),
    'customer_analytics', jsonb_build_object(
      'total_customers', COALESCE(v_total_customers, 0),
      'repeat_customers', COALESCE(v_repeat_customers, 0),
      'repeat_purchase_rate', COALESCE(v_repeat_rate, 0.0),
      'top_customers', COALESCE(v_customer_rfm, '[]'::jsonb)
    ),
    'repair_analytics', jsonb_build_object(
      'by_brand', COALESCE(v_repairs_by_brand, '[]'::jsonb),
      'by_model', COALESCE(v_repairs_by_model, '[]'::jsonb),
      'common_issues', COALESCE(v_common_issues, '[]'::jsonb)
    )
  );
END;
$$;


--
-- Name: get_admin_database_health(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_database_health() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_active_conn int;
  v_max_conn int;
  v_idle_in_tx int;
  v_active_queries int;
  v_cache_hit numeric;
  v_total_locks int;
  v_blocked_locks int;
  v_long_queries int;
  v_table_stats jsonb;
  v_freshness jsonb;
  v_status text := 'healthy';
  v_role text;
  v_current_user text;
BEGIN
  v_current_user := CURRENT_USER;
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'anon'
  ) INTO v_role;

  -- Security check: super_admin or service_role or postgres internal caller
  IF v_current_user NOT IN ('postgres', 'supabase_admin') 
     AND v_role NOT IN ('super_admin', 'service_role') 
     AND NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('error', 'Acceso denegado. Se requieren privilegios de Super Administrador.');
  END IF;

  -- A. Connections & Transactions
  SELECT count(*) INTO v_active_conn FROM pg_stat_activity;
  v_max_conn := current_setting('max_connections')::int;
  SELECT count(*) INTO v_idle_in_tx FROM pg_stat_activity WHERE state = 'idle in transaction';
  SELECT count(*) INTO v_active_queries FROM pg_stat_activity WHERE state = 'active' AND pid <> pg_backend_pid();

  -- B. Buffer Cache Hit Ratio
  SELECT ROUND(100.0 * sum(blks_hit) / NULLIF(sum(blks_hit + blks_read), 0), 2)
  INTO v_cache_hit
  FROM pg_stat_database WHERE datname = current_database();

  -- C. Locks & Long Queries
  SELECT count(*) INTO v_total_locks FROM pg_locks;
  SELECT count(*) INTO v_blocked_locks FROM pg_locks WHERE NOT granted;
  SELECT count(*) INTO v_long_queries FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '30 minutes' AND pid <> pg_backend_pid();

  -- Health status resolution
  IF (v_blocked_locks > 0 OR v_long_queries > 0 OR (v_active_conn::numeric / NULLIF(v_max_conn, 1) > 0.85)) THEN
    v_status := 'warning';
  END IF;
  IF (v_active_conn::numeric / NULLIF(v_max_conn, 1) > 0.95 OR v_cache_hit < 85.0) THEN
    v_status := 'critical';
  END IF;

  -- D. Table Sizes & Vacuum Stats
  SELECT jsonb_agg(jsonb_build_object(
    'table_name', relname,
    'row_count', n_live_tup,
    'dead_tuples', n_dead_tup,
    'last_autovacuum', to_char(last_autovacuum, 'YYYY-MM-DD HH24:MI:SS'),
    'idx_scan_pct', COALESCE(ROUND(100.0 * idx_scan / NULLIF(idx_scan + seq_scan, 0), 1), 0),
    'total_size', pg_size_pretty(pg_total_relation_size(relid))
  ))
  INTO v_table_stats
  FROM pg_stat_user_tables
  WHERE relname IN ('products', 'orders', 'repairs', 'cash_movements', 'order_items', 'profiles', 'course_enrollments');

  -- E. Data Freshness
  SELECT jsonb_build_object(
    'last_order', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM orders),
    'last_repair', (SELECT to_char(MAX(received_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM repairs WHERE deleted_at IS NULL),
    'last_cash_movement', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM cash_movements),
    'last_enrollment', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM course_enrollments),
    'last_product', (SELECT to_char(MAX(created_at) AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS') FROM products WHERE deleted_at IS NULL)
  ) INTO v_freshness;

  RETURN jsonb_build_object(
    'status', v_status,
    'connections', jsonb_build_object(
      'active', v_active_conn,
      'max', v_max_conn,
      'percentage', ROUND(100.0 * v_active_conn / NULLIF(v_max_conn, 1), 1),
      'idle_in_transaction', v_idle_in_tx,
      'active_queries', v_active_queries
    ),
    'performance', jsonb_build_object(
      'cache_hit_ratio', COALESCE(v_cache_hit, 100),
      'total_locks', v_total_locks,
      'blocked_locks', v_blocked_locks,
      'long_running_queries', v_long_queries
    ),
    'table_stats', COALESCE(v_table_stats, '[]'::jsonb),
    'data_freshness', v_freshness,
    'links', jsonb_build_object(
      'studio_url', 'https://studio.arecofix.com.ar',
      'db_host', 'db.arecofix.com.ar',
      'posthog_url', 'https://us.posthog.com'
    ),
    'timestamp', to_char(now() AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD HH24:MI:SS')
  );
END;
$$;


--
-- Name: get_auth_user_branch(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_auth_user_branch() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: get_auth_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_auth_user_role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: get_auth_user_tenant(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_auth_user_tenant() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: get_current_tenant_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_tenant_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT COALESCE(
    NULLIF(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid,
    NULLIF(auth.jwt() ->> 'tenant_id', '')::uuid,
    (SELECT p.tenant_id FROM public.profiles p WHERE p.id = auth.uid())
  );
$$;


--
-- Name: get_current_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_user_role() RETURNS text
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: FUNCTION get_current_user_role(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_current_user_role() IS 'Helper RBAC: retorna el rol del usuario autenticado.';


--
-- Name: get_dashboard_stats_v2(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_dashboard_stats_v2(p_branch_id uuid DEFAULT NULL::uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
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
$$;


--
-- Name: get_exam_questions(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_exam_questions(p_content_id uuid) RETURNS TABLE(id uuid, question_text text, options jsonb, order_index integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_has_access BOOLEAN := false;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    -- 1. Verificar si es administrador o staff
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        v_has_access := true;
    ELSE
        -- 2. Verificar si el estudiante está matriculado y confirmado
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id 
              AND ce.status = 'confirmed'
              AND (
                (v_email IS NOT NULL AND lower(ce.email) = lower(v_email))
                OR (ce.user_id IS NOT NULL AND ce.user_id = v_uid)
              )
        ) THEN
            v_has_access := true;
        END IF;
    END IF;

    IF NOT v_has_access THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT q.id, q.question_text, q.options, q.order_index
    FROM public.course_exam_questions q
    WHERE q.content_id = p_content_id
    ORDER BY q.order_index ASC;
END;
$$;


--
-- Name: get_financial_analytics_v2(uuid, timestamp with time zone, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_financial_analytics_v2(p_tenant_id uuid, p_start_date timestamp with time zone, p_branch_id uuid DEFAULT NULL::uuid) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    result json;
BEGIN
    WITH RECURSIVE months AS (
        SELECT date_trunc('month', p_start_date) as month_date
        UNION ALL
        SELECT month_date + interval '1 month'
        FROM months
        WHERE month_date < date_trunc('month', now())
    ),
    repair_stats AS (
        SELECT 
            date_trunc('month', created_at) as month,
            SUM(COALESCE(final_cost, 0)) as gross,
            SUM(COALESCE(costo_repuesto, 0)) as cost
        FROM repairs
        WHERE tenant_id = p_tenant_id
        AND created_at >= p_start_date
        AND (p_branch_id IS NULL OR branch_id = p_branch_id)
        GROUP BY 1
    ),
    order_stats AS (
        SELECT 
            date_trunc('month', created_at) as month,
            SUM(COALESCE(total_amount, 0)) as gross,
            0 as cost -- Ajustar si tienes costo en orders
        FROM orders
        WHERE tenant_id = p_tenant_id
        AND created_at >= p_start_date
        AND (p_branch_id IS NULL OR branch_id = p_branch_id)
        GROUP BY 1
    ),
    monthly_data AS (
        SELECT 
            to_char(m.month_date, 'YYYY-MM') as period,
            to_char(m.month_date, 'Mon YYYY') as label,
            COALESCE(r.gross, 0) + COALESCE(o.gross, 0) as gross_revenue,
            COALESCE(r.cost, 0) + COALESCE(o.cost, 0) as cost,
            (COALESCE(r.gross, 0) + COALESCE(o.gross, 0)) - (COALESCE(r.cost, 0) + COALESCE(o.cost, 0)) as net_profit
        FROM months m
        LEFT JOIN repair_stats r ON r.month = m.month_date
        LEFT JOIN order_stats o ON o.month = m.month_date
    )
    SELECT json_build_object(
        'total_gross_revenue', SUM(gross_revenue),
        'total_cost', SUM(cost),
        'total_net_profit', SUM(net_profit),
        'current_month_gross', (SELECT gross_revenue FROM monthly_data ORDER BY period DESC LIMIT 1),
        'monthly_breakdown', json_agg(monthly_data ORDER BY period ASC)
    ) INTO result
    FROM monthly_data;

    RETURN result;
END;
$$;


--
-- Name: get_financial_analytics_v3(uuid, timestamp with time zone, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_financial_analytics_v3(p_tenant_id uuid, p_start_date timestamp with time zone DEFAULT (now() - '1 year'::interval), p_branch_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    final_output jsonb;
    v_central_branch_id uuid;
BEGIN
    -- Determinar sucursal central para fallback transparente si p_branch_id es la matriz
    SELECT id INTO v_central_branch_id 
    FROM public.branches 
    WHERE tenant_id = p_tenant_id 
      AND is_active = true 
    ORDER BY (slug IN ('arecofix', 'principal', 'central', 'main')) DESC, id ASC 
    LIMIT 1;

    WITH monthly_series AS (
        SELECT to_char(date_trunc('month', d), 'YYYY-MM') AS period,
               to_char(date_trunc('month', d), 'Mon YYYY') AS label_month
        FROM generate_series(date_trunc('month', p_start_date), date_trunc('month', now()), '1 month'::interval) d
    ),
    orders_data AS (
        SELECT 
            to_char(date_trunc('month', o.created_at), 'YYYY-MM') AS period,
            COALESCE(SUM(o.total_amount), 0) AS sales_revenue,
            COALESCE(SUM(oi_agg.total_cost), 0) AS sales_cost
        FROM public.orders o
        LEFT JOIN (
            SELECT order_id, SUM(COALESCE(unit_cost_at_time, 0) * COALESCE(quantity, 1)) AS total_cost 
            FROM public.order_items 
            GROUP BY order_id
        ) oi_agg ON oi_agg.order_id = o.id
        WHERE o.tenant_id = p_tenant_id 
          AND o.created_at >= p_start_date
          AND (
              p_branch_id IS NULL 
              OR o.branch_id = p_branch_id 
              OR (o.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
          AND o.status IN ('paid', 'shipped', 'completed', 'delivered')
        GROUP BY 1
    ),
    repairs_data AS (
        SELECT 
            to_char(date_trunc('month', COALESCE(r.completed_at, r.created_at)), 'YYYY-MM') AS period,
            COALESCE(SUM(COALESCE(r.final_cost, r.estimated_cost, 0)), 0) AS repairs_revenue,
            COALESCE(SUM(COALESCE(r.spare_part_cost, 0)), 0) AS repairs_cost
        FROM public.repairs r
        WHERE r.tenant_id = p_tenant_id 
          AND COALESCE(r.completed_at, r.created_at) >= p_start_date
          AND r.current_status_id IN (5, 6) -- Solo reparaciones listas o entregadas
          AND (
              p_branch_id IS NULL 
              OR r.branch_id = p_branch_id 
              OR (r.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
        GROUP BY 1
    ),
    cash_expenses AS (
        SELECT 
            to_char(date_trunc('month', cm.created_at), 'YYYY-MM') AS period,
            COALESCE(SUM(cm.amount), 0) AS extra_costs
        FROM public.cash_movements cm
        WHERE cm.tenant_id = p_tenant_id 
          AND cm.type = 'expense' 
          AND cm.category IN ('purchase', 'insumos', 'gasto_fijo') 
          AND cm.created_at >= p_start_date
          AND (
              p_branch_id IS NULL 
              OR cm.branch_id = p_branch_id 
              OR (cm.branch_id IS NULL AND p_branch_id = v_central_branch_id)
          )
        GROUP BY 1
    ),
    consolidated_monthly AS (
        SELECT 
            ms.period,
            COALESCE(o.sales_revenue, 0) AS sales_revenue,
            COALESCE(o.sales_cost, 0) AS sales_cost,
            COALESCE(r.repairs_revenue, 0) AS repairs_revenue,
            COALESCE(r.repairs_cost, 0) AS repairs_cost,
            COALESCE(c.extra_costs, 0) AS extra_costs
        FROM monthly_series ms
        LEFT JOIN orders_data o ON ms.period = o.period
        LEFT JOIN repairs_data r ON ms.period = r.period
        LEFT JOIN cash_expenses c ON ms.period = c.period
        ORDER BY ms.period ASC
    )
    SELECT 
        jsonb_build_object(
            'total_gross_revenue', COALESCE(SUM(sales_revenue + repairs_revenue), 0),
            'total_cost', COALESCE(SUM(sales_cost + repairs_cost + extra_costs), 0),
            'total_net_profit', COALESCE(SUM(sales_revenue + repairs_revenue) - SUM(sales_cost + repairs_cost + extra_costs), 0),
            'current_month_gross', COALESCE(SUM(sales_revenue + repairs_revenue) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 0),
            'current_month_cost', COALESCE(SUM(sales_cost + repairs_cost + extra_costs) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 0),
            'current_month_profit', COALESCE(
                SUM(sales_revenue + repairs_revenue) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')) - 
                SUM(sales_cost + repairs_cost + extra_costs) FILTER (WHERE period = to_char(date_trunc('month', now()), 'YYYY-MM')), 
                0
            ),
            'monthly_breakdown', COALESCE(jsonb_agg(
                jsonb_build_object(
                    'period', period,
                    'sales_revenue', sales_revenue,
                    'sales_cost', sales_cost,
                    'repairs_revenue', repairs_revenue,
                    'repairs_cost', repairs_cost,
                    'extra_costs', extra_costs,
                    'gross_revenue', sales_revenue + repairs_revenue,
                    'cost', sales_cost + repairs_cost + extra_costs,
                    'net_profit', (sales_revenue + repairs_revenue) - (sales_cost + repairs_cost + extra_costs)
                )
            ), '[]'::jsonb)
        )
    INTO final_output
    FROM consolidated_monthly;

    RETURN final_output;
END;
$$;


--
-- Name: get_master_analytics(uuid, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_master_analytics(p_tenant_id uuid, p_start_date date) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_counters JSON;
    v_monthly JSON;
BEGIN
    -- [1] CONTADORES GLOBALES (Usuarios, Productos, Equipos Reparados)
    SELECT json_build_object(
        'users', (SELECT count(*) FROM public.profiles WHERE tenant_id = p_tenant_id AND deleted_at IS NULL),
        'products', (SELECT count(*) FROM public.products WHERE tenant_id = p_tenant_id AND deleted_at IS NULL),
        'sales_total', (SELECT count(*) FROM public.orders WHERE tenant_id = p_tenant_id AND status = 'completed' AND deleted_at IS NULL),
        'devices_fixed', (SELECT count(*) FROM public.repairs WHERE tenant_id = p_tenant_id AND current_status_id IN (SELECT id FROM public.repair_status_types WHERE name ILIKE '%entregado%' OR name ILIKE '%terminado%') AND deleted_at IS NULL)
    ) INTO v_counters;

    -- [2] DESGLOSE MENSUAL UNIFICADO (Tienda + Taller)
    WITH calendar AS (
        SELECT to_char(d, 'YYYY-MM') as period
        FROM generate_series(p_start_date::timestamp, now()::timestamp, '1 month') d
    ),
    rep_st AS (
        -- Taller: Usa 'final_cost' como ingreso y 'costo_repuesto' como gasto
        SELECT 
            to_char(created_at, 'YYYY-MM') as m,
            SUM(final_cost) as r_gross,
            SUM(costo_repuesto) as r_cost
        FROM public.repairs
        WHERE tenant_id = p_tenant_id AND deleted_at IS NULL
        GROUP BY 1
    ),
    ord_st AS (
        -- Tienda: Usa 'total' como ingreso y suma 'unit_cost_at_time' de los items como gasto
        SELECT 
            to_char(o.created_at, 'YYYY-MM') as m,
            SUM(o.total) as o_gross,
            SUM(COALESCE(i.costs, 0)) as o_cost
        FROM public.orders o
        LEFT JOIN (
            SELECT order_id, SUM(unit_cost_at_time * quantity) as costs
            FROM public.order_items
            GROUP BY order_id
        ) i ON o.id = i.order_id
        WHERE o.tenant_id = p_tenant_id AND o.status = 'completed' AND o.deleted_at IS NULL
        GROUP BY 1
    )
    SELECT json_agg(res) INTO v_monthly
    FROM (
        SELECT 
            c.period,
            (COALESCE(rs.r_gross, 0) + COALESCE(os.o_gross, 0)) as gross_revenue,
            (COALESCE(rs.r_cost, 0) + COALESCE(os.o_cost, 0)) as total_cost,
            ((COALESCE(rs.r_gross, 0) + COALESCE(os.o_gross, 0)) - (COALESCE(rs.r_cost, 0) + COALESCE(os.o_cost, 0))) as net_profit,
            COALESCE(rs.r_gross, 0) as repair_revenue,
            COALESCE(os.o_gross, 0) as sales_revenue,
            COALESCE(rs.r_cost, 0) as repair_cost,
            COALESCE(os.o_cost, 0) as sales_cost
        FROM calendar c
        LEFT JOIN rep_st rs ON c.period = rs.m
        LEFT JOIN ord_st os ON c.period = os.m
        ORDER BY c.period DESC
    ) res;

    RETURN json_build_object(
        'counters', v_counters,
        'monthly_breakdown', v_monthly
    );
END;
$$;


--
-- Name: get_my_branch(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_branch() RETURNS uuid
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid();
$$;


--
-- Name: get_my_permissions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_permissions() RETURNS TABLE(permission text)
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT rp.permission 
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = auth.uid();
$$;


--
-- Name: get_my_tenant(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_tenant() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT public.get_current_tenant_id();
$$;


--
-- Name: get_next_tenant_sequence(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_next_tenant_sequence(p_tenant_id uuid, p_table_name text, p_column_name text) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $_$
DECLARE
  next_val INTEGER;
BEGIN
  EXECUTE format(
    'SELECT COALESCE(MAX(%I), 0) + 1 FROM public.%I WHERE tenant_id = $1',
    p_column_name, p_table_name
  ) INTO next_val USING p_tenant_id;
  RETURN next_val;
END;
$_$;


--
-- Name: get_public_certificate_data(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_public_certificate_data(p_cert_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_record RECORD;
    v_instructor_name TEXT;
BEGIN
    IF p_cert_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de certificado requerido.');
    END IF;

    SELECT 
        cc.id AS certificate_id,
        cc.student_name,
        cc.status,
        cc.issued_at,
        cc.pdf_url,
        c.title AS course_title,
        COALESCE(NULLIF(TRIM(c.instructor_name), ''), NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Arecofix Academy') AS instructor_name
    INTO v_record
    FROM public.course_certificates cc
    JOIN public.courses c ON c.id = cc.course_id
    LEFT JOIN public.profiles p ON p.id = c.instructor_id
    WHERE cc.id = p_cert_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'not_found',
            'message', 'Certificado no encontrado o inexistente.'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'certificate_id', v_record.certificate_id,
        'student_name', v_record.student_name,
        'course_title', v_record.course_title,
        'instructor_name', v_record.instructor_name,
        'issued_at', v_record.issued_at,
        'status', v_record.status,
        'pdf_url', v_record.pdf_url,
        'is_valid', (v_record.status = 'valid')
    );
END;
$$;


--
-- Name: get_recommended_accessories(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_recommended_accessories(p_tracking_code text) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_repair record;
    v_model_id uuid;
    v_result json;
BEGIN
    SELECT r.id, r.device_model, r.device_id, r.branch_id, r.tenant_id 
    INTO v_repair
    FROM public.repairs r
    WHERE r.tracking_code = p_tracking_code;

    IF NOT FOUND THEN
        RETURN '[]'::json;
    END IF;

    -- Extraemos el Model ID si existe en customer_devices
    IF v_repair.device_id IS NOT NULL THEN
        SELECT model_id INTO v_model_id FROM public.customer_devices WHERE id = v_repair.device_id;
    END IF;

    WITH recommendations AS (
        SELECT 
            p.id,
            p.name,
            p.image_url,
            COALESCE(p.sale_price, p.price) as price,
            p.price as original_price,
            p.stock,
            pb.quantity as branch_stock
        FROM public.products p
        -- Cruce con stock por sucursal donde hay disponibilidad de funda o accesorio
        LEFT JOIN public.product_stock_per_branch pb 
            ON pb.product_id = p.id AND (pb.branch_id = v_repair.branch_id OR pb.branch_id IS NULL)
        WHERE p.tenant_id = v_repair.tenant_id
          AND p.is_active = true
          AND (p.stock > 0 OR pb.quantity > 0)
          AND (
              -- Match preciso o mediante palabras claves (Primera palabra del modelo del técnico ej: "iPhone")
              (v_model_id IS NOT NULL AND p.model_id = v_model_id)
              OR p.name ILIKE '%' || v_repair.device_model || '%'
              OR p.name ILIKE '%' || split_part(v_repair.device_model, ' ', 1) || '%'
          )
        LIMIT 6
    )
    SELECT COALESCE(json_agg(row_to_json(r)), '[]'::json) INTO v_result FROM recommendations r;

    RETURN v_result;
END;
$$;


--
-- Name: get_repair_by_tracking(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_repair_by_tracking(t_code text) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    result json;
BEGIN
    SELECT row_to_json(r) INTO result
    FROM (
        SELECT 
            rp.*,
            (
                SELECT COALESCE(json_agg(ri.image_url), '[]'::json) 
                FROM public.repair_images ri 
                WHERE ri.repair_id = rp.id
            ) as images
        FROM public.repairs rp
        WHERE rp.tracking_code = t_code
        LIMIT 1
    ) r;
    
    RETURN result;
END;
$$;


--
-- Name: get_repair_financial_stats(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_repair_financial_stats(p_tenant_id uuid, p_date_range text) RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
    end_date TIMESTAMP WITH TIME ZONE;
    
    -- Variables principales
    v_total_facturado NUMERIC := 0;
    v_costo_repuestos NUMERIC := 0;
    v_ganancia_neta NUMERIC := 0;
    v_margen_porcentaje NUMERIC := 0;
    v_ticket_promedio NUMERIC := 0;
    v_total_reparaciones INT := 0;
    v_reparaciones_vidrio INT := 0;
    v_ingreso_extra_vidrio NUMERIC := 0;
    
    -- Nuevas variables (7 métricas)
    v_equipos_recibidos INT := 0;
    v_equipos_entregados INT := 0;
    v_garantias_efectivas INT := 0;
    v_equipos_espera INT := 0;
    v_devoluciones_cantidad INT := 0;
    v_devoluciones_monto NUMERIC := 0;
    v_venta_total_global NUMERIC := 0;
    v_orders_amount NUMERIC := 0;
    
    v_monthly_data JSON;
BEGIN
    -- 1. Rango de Fechas
    IF p_date_range = 'this_month' THEN
        start_date := date_trunc('month', now());
        end_date := start_date + interval '1 month';
    ELSIF p_date_range = 'last_month' THEN
        start_date := date_trunc('month', now()) - interval '1 month';
        end_date := date_trunc('month', now());
    ELSE
        start_date := '1970-01-01'::TIMESTAMP WITH TIME ZONE;
        end_date := '2100-01-01'::TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 2. Calcular Totales Base (Facturación y Costos)
    SELECT 
        COALESCE(SUM(rpu.unit_price_at_time * rpu.quantity), 0),
        COALESCE(SUM(rpu.cost_at_time * rpu.quantity), 0)
    INTO v_total_facturado, v_costo_repuestos
    FROM public.repair_parts_used rpu
    JOIN public.repairs r ON r.id = rpu.repair_id
    WHERE r.tenant_id = p_tenant_id 
      AND r.current_status_id NOT IN (7)
      AND r.created_at >= start_date AND r.created_at < end_date;
      
    SELECT COUNT(id), COALESCE(SUM(technical_labor_cost), 0), COUNT(id) FILTER (WHERE upsell_vidrio = true)
    INTO v_total_reparaciones, v_ganancia_neta, v_reparaciones_vidrio
    FROM public.repairs
    WHERE tenant_id = p_tenant_id 
      AND current_status_id NOT IN (7)
      AND created_at >= start_date AND created_at < end_date;

    v_total_facturado := v_total_facturado + v_ganancia_neta;
    v_ganancia_neta := v_total_facturado - v_costo_repuestos;

    -- 3. Métricas Nuevas (Equipos Recibidos, Entregados, Espera, Devoluciones, Garantías)
    SELECT 
        COUNT(id), 
        COUNT(id) FILTER (WHERE current_status_id = 6)
    INTO v_equipos_recibidos, v_equipos_entregados
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id
      AND created_at >= start_date AND created_at < end_date;
      
    SELECT COUNT(id) INTO v_equipos_espera
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id AND current_status_id IN (1, 2);

    SELECT COUNT(id), COALESCE(SUM(deposit_amount), 0)
    INTO v_devoluciones_cantidad, v_devoluciones_monto
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id AND current_status_id = 7
      AND created_at >= start_date AND created_at < end_date;
      
    SELECT COUNT(id) INTO v_garantias_efectivas
    FROM public.repairs
    WHERE tenant_id = p_tenant_id AND current_status_id NOT IN (7) 
      AND (issue_description ILIKE '%garantia%' OR issue_description ILIKE '%garantía%')
      AND created_at >= start_date AND created_at < end_date;

    SELECT COALESCE(SUM(total_amount), 0) INTO v_orders_amount
    FROM public.orders 
    WHERE tenant_id = p_tenant_id AND status = 'completed'
      AND created_at >= start_date AND created_at < end_date;
      
    v_venta_total_global := v_total_facturado + v_orders_amount;
    v_ingreso_extra_vidrio := v_reparaciones_vidrio * 5000;

    IF v_total_facturado > 0 THEN
        v_margen_porcentaje := (v_ganancia_neta / v_total_facturado) * 100;
        v_ticket_promedio := v_total_facturado / v_total_reparaciones;
    END IF;

    -- Monthly Series (Genera meses en histórico)
    SELECT json_agg(months)
    INTO v_monthly_data
    FROM (
        SELECT 
            TO_CHAR(r.created_at, 'YYYY-MM') AS mes,
            COALESCE(SUM(r.final_cost), 0) AS ingreso,
            COALESCE(SUM((SELECT COALESCE(SUM(cost_at_time * quantity), 0) FROM public.repair_parts_used rpu WHERE rpu.repair_id = r.id)), 0) AS costo,
            COALESCE(SUM(r.final_cost), 0) - COALESCE(SUM((SELECT COALESCE(SUM(cost_at_time * quantity), 0) FROM public.repair_parts_used rpu WHERE rpu.repair_id = r.id)), 0) AS ganancia
        FROM public.repairs r
        WHERE r.tenant_id = p_tenant_id AND r.current_status_id NOT IN (7)
          AND r.created_at >= start_date AND r.created_at < end_date
        GROUP BY TO_CHAR(r.created_at, 'YYYY-MM')
        ORDER BY TO_CHAR(r.created_at, 'YYYY-MM') ASC
    ) months;

    IF v_monthly_data IS NULL THEN
        v_monthly_data := '[]'::JSON;
    END IF;

    RETURN json_build_object(
        'total_facturado', v_total_facturado,
        'costo_repuestos', v_costo_repuestos,
        'ganancia_neta', v_ganancia_neta,
        'margen_porcentaje', COALESCE(v_margen_porcentaje, 0),
        'ticket_promedio', COALESCE(v_ticket_promedio, 0),
        'total_reparaciones', v_total_reparaciones,
        'reparaciones_vidrio', v_reparaciones_vidrio,
        'ingreso_extra_vidrio', v_ingreso_extra_vidrio,
        'equipos_recibidos', v_equipos_recibidos,
        'equipos_entregados', v_equipos_entregados,
        'garantias_efectivas', v_garantias_efectivas,
        'equipos_espera', v_equipos_espera,
        'devoluciones_cantidad', v_devoluciones_cantidad,
        'devoluciones_monto', v_devoluciones_monto,
        'venta_total_global', v_venta_total_global,
        'monthly_data', v_monthly_data
    );
END;
$$;


--
-- Name: get_repair_tracking(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_repair_tracking(p_code text) RETURNS TABLE(id uuid, tracking_code text, customer_id uuid, client_id uuid, device_id uuid, device_type text, device_model text, brand_id uuid, imei text, issue_description text, current_status_id integer, estimated_cost numeric, final_cost numeric, deposit_amount numeric, technical_labor_cost numeric, technician_notes text, technical_report text, received_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone, completed_at timestamp with time zone, images json, parts json, branch_id uuid, received_by uuid, assigned_technician_id uuid, checklist jsonb, security_pin text, security_pattern text, glass_upsell boolean, spare_part_cost numeric, whatsapp_notifications boolean, supplier_id uuid, warranty text, client json, device json)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.tracking_code,
    r.client_id as customer_id,
    r.client_id,
    r.device_id,
    NULL::text as device_type,
    m.name as device_model,    
    m.brand_id as brand_id,    
    cd.imei as imei,           
    r.issue_description,       
    r.current_status_id,
    r.estimated_cost,
    r.final_cost,
    r.deposit_amount,
    r.technical_labor_cost,
    r.technician_notes,
    r.technical_report,
    r.received_at,
    r.created_at,
    r.updated_at,
    r.completed_at,
    (SELECT COALESCE(json_agg(json_build_object('image_url', ri.image_url)), '[]'::json) FROM repair_images ri WHERE ri.repair_id = r.id) as images,
    (SELECT COALESCE(json_agg(row_to_json(rpu.*)), '[]'::json) FROM repair_parts_used rpu WHERE rpu.repair_id = r.id) as parts,
    r.branch_id,
    r.received_by,
    r.assigned_technician_id,
    r.checklist,
    COALESCE(r.security_pin, cd.passcode) as security_pin, 
    r.security_pattern,        
    r.glass_upsell,
    r.spare_part_cost,
    r.whatsapp_notifications,
    r.supplier_id,
    r.warranty,
    json_build_object(
      'id', p.id, 
      'first_name', p.first_name, 
      'last_name', p.last_name, 
      'phone', p.phone, 
      'email', p.email, 
      'dni', p.dni
    ) as client,
    json_build_object(
      'id', cd.id, 
      'imei', cd.imei, 
      'passcode', cd.passcode,
      'model', CASE WHEN m.id IS NOT NULL THEN 
        json_build_object(
          'id', m.id,
          'name', m.name, 
          'brand_id', m.brand_id, 
          'brand', CASE WHEN b.id IS NOT NULL THEN 
                     json_build_object('id', b.id, 'name', b.name) 
                   ELSE NULL END
        )
      ELSE NULL END
    ) as device
  FROM repairs r
  LEFT JOIN profiles p ON p.id = r.client_id
  LEFT JOIN customer_devices cd ON cd.id = r.device_id
  LEFT JOIN models m ON m.id = cd.model_id
  LEFT JOIN brands b ON b.id = m.brand_id
  WHERE r.tracking_code = p_code
  AND r.deleted_at IS NULL;
END;
$$;


--
-- Name: get_request_guest_session(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_request_guest_session() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
$$;


--
-- Name: get_secure_branch_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_secure_branch_id() RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $_$
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
$_$;


--
-- Name: get_secure_tenant_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_secure_tenant_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT public.get_current_tenant_id();
$$;


--
-- Name: get_unified_clients_list(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_unified_clients_list(p_tenant_id uuid) RETURNS TABLE(id uuid, first_name text, last_name text, full_name text, email text, phone text, dni text, address text, tenant_id uuid, source text, created_at timestamp with time zone, repair_count bigint, order_count bigint)
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN QUERY
    WITH r_counts AS (
        SELECT client_id, count(*) as cnt FROM public.repairs GROUP BY client_id
    ),
    o_counts AS (
        SELECT user_id, count(*) as cnt FROM public.orders GROUP BY user_id
    )
    SELECT 
        u.id, u.first_name, u.last_name, u.full_name, u.email, u.phone, u.dni, u.address, u.tenant_id, 
        u.source, u.created_at,
        COALESCE(rc.cnt, 0) as repair_count,
        COALESCE(oc.cnt, 0) as order_count
    FROM public.unified_customers u
    LEFT JOIN r_counts rc ON u.id = rc.client_id
    LEFT JOIN o_counts oc ON u.id = oc.user_id
    WHERE u.tenant_id = p_tenant_id
    ORDER BY u.created_at DESC;
END;
$$;


--
-- Name: get_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role() RETURNS text
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: get_user_tenant_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_tenant_id() RETURNS uuid
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $_$
DECLARE
  v_first_name text;
  v_last_name text;
  v_full_name text;
  v_avatar_url text;
  v_phone text;
  v_role text;
  v_tenant_id uuid;
  v_branch_id uuid;
  v_raw_meta jsonb;
  v_email text;
BEGIN
  v_raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_email := COALESCE(NEW.email, v_raw_meta->>'email', '');

  -- 1.1 Extracción de Nombre Completo
  v_full_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'full_name',
    v_raw_meta->>'name',
    ''
  )), '');

  v_first_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'first_name',
    v_raw_meta->>'given_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN split_part(v_full_name, ' ', 1)
      ELSE v_full_name
    END,
    split_part(v_email, '@', 1)
  )), '');

  v_last_name := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'last_name',
    v_raw_meta->>'family_name',
    CASE 
      WHEN v_full_name IS NOT NULL AND position(' ' IN v_full_name) > 0 
      THEN substr(v_full_name, length(split_part(v_full_name, ' ', 1)) + 2)
      ELSE ''
    END
  )), '');

  -- 1.2 Avatar y Teléfono
  v_avatar_url := NULLIF(TRIM(COALESCE(
    v_raw_meta->>'avatar_url',
    v_raw_meta->>'picture',
    ''
  )), '');

  v_phone := NULLIF(TRIM(COALESCE(
    NEW.phone,
    v_raw_meta->>'phone',
    ''
  )), '');

  -- 1.3 Asignación de Rol
  IF v_email IN ('ezequielenrico15@gmail.com', 'ezequielenrico1015@hotmail.com') THEN
    v_role := 'super_admin';
  ELSIF v_raw_meta->>'role' IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician', 'instructor') THEN
    v_role := v_raw_meta->>'role';
  ELSE
    v_role := 'user';
  END IF;

  -- 1.4 Resolución de Tenant ID Dinámica (Sin fallbacks hardcodeados)
  IF v_raw_meta->>'tenant_id' IS NOT NULL AND v_raw_meta->>'tenant_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE id = (v_raw_meta->>'tenant_id')::uuid;
  END IF;

  IF v_tenant_id IS NULL OR v_tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
    v_tenant_id := public.get_current_tenant_id();
  END IF;

  -- 1.5 Resolución de Branch ID Dinámica (Perteneciente al tenant resuelto)
  IF v_raw_meta->>'branch_id' IS NOT NULL AND v_raw_meta->>'branch_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT id INTO v_branch_id FROM public.branches WHERE id = (v_raw_meta->>'branch_id')::uuid;
  END IF;

  IF v_branch_id IS NULL AND v_tenant_id IS NOT NULL THEN
    SELECT id INTO v_branch_id 
    FROM public.branches 
    WHERE tenant_id = v_tenant_id
    ORDER BY is_active DESC, created_at ASC
    LIMIT 1;
  END IF;

  -- 1.6 Inserción o Actualización Atómica (UPSERT)
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    phone,
    role,
    tenant_id,
    branch_id,
    is_active,
    is_guest,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_email,
    v_first_name,
    v_last_name,
    v_avatar_url,
    v_phone,
    v_role,
    v_tenant_id,
    v_branch_id,
    true,
    false,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    tenant_id = COALESCE(public.profiles.tenant_id, EXCLUDED.tenant_id),
    branch_id = COALESCE(public.profiles.branch_id, EXCLUDED.branch_id),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error en handle_new_user() para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$_$;


--
-- Name: handle_order_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_order_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  payload jsonb;
  webhook_url text;
BEGIN
  -- Only trigger if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  webhook_url := current_setting('app.settings.webhook_url', true);
  
  -- Fallback to local URL for testing if not set
  IF webhook_url IS NULL OR webhook_url = '' THEN
    webhook_url := 'http://host.docker.internal:54421/functions/v1/webhook-whatsapp';
  END IF;

  payload := jsonb_build_object(
    'type', 'UPDATE',
    'table', 'orders',
    'schema', 'public',
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD)
  );

  PERFORM net.http_post(
    url := webhook_url,
    body := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to trigger webhook: %', SQLERRM;
    RETURN NEW;
END;
$$;


--
-- Name: handle_order_status_stock_transition(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_order_status_stock_transition() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    r RECORD;
    v_prev_stock INTEGER;
    v_new_stock INTEGER;
BEGIN
    -- Transición desde 'cart' hacia estado activo (pending, paid, etc.) -> Descontar stock y registrar en histórico
    IF (OLD.status = 'cart' AND NEW.status != 'cart' AND NEW.status != 'cancelled') THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                SELECT COALESCE(stock, 0) INTO v_prev_stock FROM public.products WHERE id = r.product_id;
                v_new_stock := GREATEST(v_prev_stock - r.quantity, 0);

                UPDATE public.products
                SET stock = v_new_stock,
                    updated_at = NOW()
                WHERE id = r.product_id;

                INSERT INTO public.stock_history (
                    product_id, delta, previous_stock, new_stock, reason, order_id, branch_id, tenant_id, created_at
                ) VALUES (
                    r.product_id, -r.quantity, v_prev_stock, v_new_stock, 'sale', NEW.id, NEW.branch_id, NEW.tenant_id, NOW()
                );
            END IF;
        END LOOP;
    END IF;

    -- Transición a 'cancelled' o 'refunded' desde un estado activo -> Reponer stock y registrar en histórico
    IF (OLD.status != 'cart' AND OLD.status != 'cancelled' AND (NEW.status = 'cancelled' OR NEW.status = 'refunded')) THEN
        FOR r IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                SELECT COALESCE(stock, 0) INTO v_prev_stock FROM public.products WHERE id = r.product_id;
                v_new_stock := v_prev_stock + r.quantity;

                UPDATE public.products
                SET stock = v_new_stock,
                    updated_at = NOW()
                WHERE id = r.product_id;

                INSERT INTO public.stock_history (
                    product_id, delta, previous_stock, new_stock, reason, order_id, branch_id, tenant_id, created_at
                ) VALUES (
                    r.product_id, r.quantity, v_prev_stock, v_new_stock,
                    CASE WHEN NEW.status = 'refunded' THEN 'return' ELSE 'cancellation' END,
                    NEW.id, NEW.branch_id, NEW.tenant_id, NOW()
                );
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: handle_repair_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_repair_status_change() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    IF (OLD.current_status_id IS DISTINCT FROM NEW.current_status_id) THEN
        INSERT INTO public.repair_status_history (repair_id, status_type_id, changed_by, notes)
        VALUES (NEW.id, NEW.current_status_id, auth.uid(), 'Cambio de estado automático por sistema');
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: handle_repair_status_history(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_repair_status_history() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Si es una reparación nueva (INSERT)
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.repair_status_history (repair_id, status_type_id, changed_by, tenant_id)
        VALUES (NEW.id, COALESCE(NEW.current_status_id, 1), auth.uid(), NEW.tenant_id);
    
    -- Si se actualiza una reparación (UPDATE)
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.current_status_id IS DISTINCT FROM OLD.current_status_id THEN
            INSERT INTO public.repair_status_history (repair_id, status_type_id, changed_by, tenant_id)
            VALUES (NEW.id, NEW.current_status_id, auth.uid(), NEW.tenant_id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: has_permission(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_permission(p_permission text, p_branch_id uuid DEFAULT NULL::uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
      AND (ur.tenant_id = public.get_current_tenant_id() OR public.is_super_admin())
      AND (ur.branch_id = p_branch_id OR ur.branch_id IS NULL OR p_branch_id IS NULL)
      AND rp.permission = p_permission
  );
$$;


--
-- Name: increment_product_sales(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_product_sales(p_product_id uuid, amount integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  UPDATE public.products
  SET total_units_sold = COALESCE(total_units_sold, 0) + amount
  WHERE id = p_product_id;
END;
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff', 'tenant_owner', 'super_admin')
  );
END;
$$;


--
-- Name: is_admin_of_tenant(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_of_tenant(target_tenant_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role IN ('admin', 'tenant_owner') AND tenant_id = target_tenant_id AND target_tenant_id IS NOT NULL)
      )
  );
$$;


--
-- Name: is_admin_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_user() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'tenant_owner', 'admin')
  );
$$;


--
-- Name: is_global_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_global_admin() RETURNS boolean
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN coalesce(v_role = 'admin', false);
END;
$$;


--
-- Name: is_platform_owner(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_platform_owner() RETURNS boolean
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenants
    WHERE owner_id = auth.uid()
  );
$$;


--
-- Name: FUNCTION is_platform_owner(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_platform_owner() IS 'Helper: true si el usuario es owner del tenant.';


--
-- Name: is_super_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    (SELECT p.role = 'super_admin' FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;


--
-- Name: is_tenant_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_tenant_admin() RETURNS boolean
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT COALESCE(role = 'admin', FALSE) FROM public.profiles WHERE id = auth.uid();
$$;


--
-- Name: FUNCTION is_tenant_admin(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_tenant_admin() IS 'Helper RBAC: true si el usuario es admin.';


--
-- Name: is_tenant_staff_or_above(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_tenant_staff_or_above() RETURNS boolean
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
  SELECT COALESCE(role IN ('admin', 'staff'), FALSE) FROM public.profiles WHERE id = auth.uid();
$$;


--
-- Name: FUNCTION is_tenant_staff_or_above(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_tenant_staff_or_above() IS 'Helper RBAC: true si el usuario es admin o staff.';


--
-- Name: mark_content_completed(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.mark_content_completed(p_content_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_tenant_id UUID;
    v_course_id UUID;
    v_total_contents INTEGER := 0;
    v_completed_contents INTEGER := 0;
    v_progress NUMERIC := 0.0;
    v_cert_id UUID;
    v_student_name TEXT := 'Estudiante Arecofix';
    v_sub_status TEXT;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- VALIDACIÓN DE MEMBRESÍA (Golden Rule)
    IF v_uid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        SELECT status INTO v_sub_status
        FROM public.academy_subscriptions
        WHERE user_id = v_uid
        LIMIT 1;

        IF v_sub_status IS NOT NULL AND v_sub_status IN ('suspended', 'expired') THEN
            RAISE EXCEPTION 'Membership expired. Cannot complete lessons.' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Obtener detalles del contenido desde course_lessons y course_modules
    SELECT c.tenant_id, m.course_id INTO v_tenant_id, v_course_id
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Content not found';
    END IF;

    -- Validar si está matriculado o si es admin
    IF NOT EXISTS (
        SELECT 1 FROM public.course_enrollments
        WHERE course_id = v_course_id 
          AND (
            (v_email IS NOT NULL AND lower(email) = lower(v_email))
            OR (user_id IS NOT NULL AND user_id = v_uid)
          )
          AND status = 'confirmed'
    ) AND NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        RAISE EXCEPTION 'Not enrolled in this course';
    END IF;

    -- Obtener nombre del estudiante
    SELECT COALESCE(full_name, v_student_name) INTO v_student_name
    FROM public.course_enrollments
    WHERE course_id = v_course_id
      AND (
        (v_email IS NOT NULL AND lower(email) = lower(v_email))
        OR (user_id IS NOT NULL AND user_id = v_uid)
      )
    LIMIT 1;

    -- Registrar el progreso sin duplicar
    INSERT INTO public.course_progress (tenant_id, email, course_id, content_id, user_id)
    VALUES (v_tenant_id, COALESCE(v_email, 'sin-email@arecofix.com'), v_course_id, p_content_id, v_uid)
    ON CONFLICT (email, content_id) DO UPDATE
    SET completed_at = now(),
        user_id = COALESCE(public.course_progress.user_id, EXCLUDED.user_id);

    -- Calcular progreso del curso
    SELECT COUNT(*) INTO v_total_contents
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE m.course_id = v_course_id;

    SELECT COUNT(*) INTO v_completed_contents
    FROM public.course_progress
    WHERE course_id = v_course_id 
      AND (
        (v_email IS NOT NULL AND lower(email) = lower(v_email))
        OR (user_id IS NOT NULL AND user_id = v_uid)
      );

    v_progress := (v_completed_contents::NUMERIC / NULLIF(v_total_contents, 0)::NUMERIC) * 100.0;

    -- Emitir certificado automático si completó 100% y no existe diploma previo
    IF v_completed_contents >= v_total_contents AND v_total_contents > 0 THEN
        v_progress := 100.0;

        SELECT id INTO v_cert_id 
        FROM public.course_certificates 
        WHERE course_id = v_course_id 
          AND (
            (v_email IS NOT NULL AND lower(email) = lower(v_email))
          );

        IF v_cert_id IS NULL THEN
            INSERT INTO public.course_certificates (tenant_id, course_id, email, student_name)
            VALUES (v_tenant_id, v_course_id, COALESCE(v_email, 'sin-email@arecofix.com'), v_student_name)
            RETURNING id INTO v_cert_id;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'progress', v_progress,
        'completed', v_completed_contents,
        'total', v_total_contents,
        'certificate_id', v_cert_id
    );
END;
$$;


--
-- Name: match_documents(extensions.vector, double precision, integer, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.match_documents(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.70, match_count integer DEFAULT 5, filter_tenant_id uuid DEFAULT NULL::uuid, filter_source_type text DEFAULT NULL::text) RETURNS TABLE(id uuid, title text, content text, metadata jsonb, source_type text, source_id uuid, source_url text, similarity double precision)
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        kb.metadata,
        kb.source_type,
        kb.source_id,
        kb.source_url,
        -- Convierte distancia coseno (0=idéntico, 2=opuesto) a similitud (1=idéntico, 0=opuesto)
        (1 - (kb.embedding <=> query_embedding))::FLOAT AS similarity
    FROM
        public.knowledge_base kb
    WHERE
        -- Filtro de tenant (SIEMPRE aplicado para garantizar aislamiento)
        (filter_tenant_id IS NULL OR kb.tenant_id = filter_tenant_id)
        -- Filtro opcional por tipo de fuente
        AND (filter_source_type IS NULL OR kb.source_type = filter_source_type)
        -- Solo chunks con similitud suficiente
        AND (1 - (kb.embedding <=> query_embedding)) >= match_threshold
    ORDER BY
        kb.embedding <=> query_embedding  -- ASC: menor distancia = más similar
    LIMIT
        match_count;
END;
$$;


--
-- Name: FUNCTION match_documents(query_embedding extensions.vector, match_threshold double precision, match_count integer, filter_tenant_id uuid, filter_source_type text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.match_documents(query_embedding extensions.vector, match_threshold double precision, match_count integer, filter_tenant_id uuid, filter_source_type text) IS 'Búsqueda semántica por coseno sobre knowledge_base. Usada por el chatbot RAG de Arecofix vía Cloudflare Workers AI + Supabase pgvector.';


--
-- Name: next_invoice_number(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_invoice_number(p_tenant_id uuid) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_next integer;
BEGIN
  SELECT COALESCE(MAX(invoice_number), 0) + 1
    INTO v_next
    FROM public.invoices
   WHERE tenant_id = p_tenant_id
     AND deleted_at IS NULL;
  RETURN v_next;
END;
$$;


--
-- Name: notify_admins_on_new_repair(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_admins_on_new_repair() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    INSERT INTO public.admin_notifications (
        tenant_id,
        branch_id,
        source,
        payload
    ) VALUES (
        NEW.tenant_id,           -- Explicit from the repair row
        NEW.branch_id,
        'repair_created',
        jsonb_build_object(
            'repair_id',      NEW.id,
            'tracking_code',  NEW.tracking_code,
            'customer_name',  NULL,
            'device_model',   NULL,
            'status_id',      NEW.current_status_id
        )
    );

    RETURN NEW;
END;
$$;


--
-- Name: notify_low_stock(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_low_stock() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_product_name TEXT;
  v_branch_name  TEXT;
  v_tenant_id    UUID;
  v_admin_ids    UUID[];
BEGIN
  IF NEW.quantity < COALESCE(NEW.min_stock_alert, 2) THEN

    SELECT name INTO v_product_name FROM public.products WHERE id = NEW.product_id LIMIT 1;
    SELECT name, tenant_id INTO v_branch_name, v_tenant_id FROM public.branches WHERE id = NEW.branch_id LIMIT 1;

    SELECT ARRAY_AGG(p.id) INTO v_admin_ids
    FROM public.profiles p
    WHERE p.tenant_id = v_tenant_id AND p.role = 'admin';

    IF v_admin_ids IS NOT NULL THEN
      INSERT INTO public.notifications (tenant_id, user_id, title, message, type, created_at)
      SELECT
        v_tenant_id,
        unnest(v_admin_ids),
        '⚠️ Stock Bajo: ' || COALESCE(v_product_name, '?'),
        'El producto "' || COALESCE(v_product_name, '?') || '" en sucursal "' || COALESCE(v_branch_name, '?')
          || '" tiene ' || NEW.quantity || ' unidades (mínimo: ' || COALESCE(NEW.min_stock_alert, 2) || ').',
        'warning',
        NOW();
    END IF;

  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION notify_low_stock(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.notify_low_stock() IS 'Trigger: notifica a admins cuando stock baja del umbral.';


--
-- Name: notify_n8n_new_product(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_n8n_new_product() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Envía el POST a la URL de producción de n8n
  PERFORM net.http_post(
    url := 'https://n8n.arecofix.com.ar/webhook/nuevo-producto-crudo',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW)
    )::jsonb
  );
  RETURN NEW;
END;
$$;


--
-- Name: process_course_enrollments(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_course_enrollments() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Solo actuar si el pedido se marca como 'paid' o 'completed'
  IF NEW.status IN ('paid', 'completed') AND OLD.status NOT IN ('paid', 'completed') THEN
    
    -- Insertar enrolamientos para todos los items que sean cursos
    INSERT INTO public.course_enrollments (
      course_id, 
      full_name, 
      email, 
      phone,
      status, 
      tenant_id, 
      user_id,
      created_at
    )
    SELECT 
      oi.course_id, 
      COALESCE(NEW.customer_name, 'Alumno'), 
      COALESCE(NEW.customer_email, 'sin-email@arecofix.com'), 
      NEW.customer_phone,
      'confirmed', 
      NEW.tenant_id, 
      NEW.user_id,
      now()
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id 
      AND oi.course_id IS NOT NULL
    -- Prevenir duplicados si el webhook/trigger se dispara dos veces
    ON CONFLICT DO NOTHING;

  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: process_order_refund_v2(uuid, uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_order_refund_v2(p_order_id uuid, p_tenant_id uuid, p_branch_id uuid, p_reason text) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE v_item RECORD; v_total numeric;
BEGIN
    SELECT total INTO v_total FROM public.orders WHERE id = p_order_id;
    UPDATE public.orders SET status = 'refunded', notes = COALESCE(notes, '') || ' | Dev: ' || p_reason WHERE id = p_order_id;
    FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = p_order_id LOOP
        IF v_item.product_id IS NOT NULL THEN
            UPDATE public.product_stock_per_branch SET quantity = quantity + v_item.quantity WHERE product_id = v_item.product_id AND branch_id = p_branch_id;
            UPDATE public.products SET stock = stock + v_item.quantity WHERE id = v_item.product_id;
        END IF;
    END LOOP;
END; $$;


--
-- Name: process_pos_sale(uuid, uuid, uuid, text, text, numeric, numeric, numeric, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_pos_sale(p_tenant_id uuid, p_branch_id uuid, p_customer_id uuid, p_customer_name text, p_payment_method text, p_subtotal numeric, p_discount numeric, p_total numeric, p_items jsonb) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE v_order_id uuid; v_item jsonb;
BEGIN
    INSERT INTO public.orders (tenant_id, user_id, customer_name, status, subtotal, discount, total, total_amount, payment_method, order_number)
    VALUES (p_tenant_id, p_customer_id, p_customer_name, 'completed', p_subtotal, p_discount, p_total, p_total, p_payment_method, 'POS-' || to_char(now(), 'YYYYMMDD-HH24MISS'))
    RETURNING id INTO v_order_id;
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        INSERT INTO public.order_items (tenant_id, order_id, product_id, quantity, unit_price, subtotal)
        VALUES (p_tenant_id, v_order_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::int, (v_item->>'unit_price')::numeric, ((v_item->>'quantity')::int * (v_item->>'unit_price')::numeric));
        UPDATE public.product_stock_per_branch SET quantity = quantity - (v_item->>'quantity')::int WHERE product_id = (v_item->>'product_id')::uuid AND branch_id = p_branch_id;
        UPDATE public.products SET stock = stock - (v_item->>'quantity')::int WHERE id = (v_item->>'product_id')::uuid;
    END LOOP;
    RETURN v_order_id;
END; $$;


--
-- Name: process_purchase_reception_v2(uuid, uuid, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_purchase_reception_v2(p_purchase_id uuid, p_tenant_id uuid, p_branch_id uuid, p_items jsonb) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE v_item jsonb;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        -- Actualizar Stock por Sucursal
        INSERT INTO public.product_stock_per_branch (product_id, branch_id, quantity, tenant_id)
        VALUES ((v_item->>'product_id')::uuid, p_branch_id, (v_item->>'quantity')::int, p_tenant_id)
        ON CONFLICT (product_id, branch_id) DO UPDATE SET quantity = product_stock_per_branch.quantity + (v_item->>'quantity')::int;
        -- Sincronizar Global
        UPDATE public.products SET stock = stock + (v_item->>'quantity')::int WHERE id = (v_item->>'product_id')::uuid;
    END LOOP;
    UPDATE public.purchases SET status = 'received' WHERE id = p_purchase_id;
END; $$;


--
-- Name: protect_sensitive_profile_columns(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.protect_sensitive_profile_columns() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_current_role text;
BEGIN
  -- Obtenemos el rol real del usuario directamente de la base de datos
  SELECT role INTO v_current_role FROM public.profiles WHERE id = auth.uid();

  -- Si el que actualiza es el dueño del perfil PERO NO es un administrador
  IF auth.uid() = NEW.id AND v_current_role NOT IN ('super_admin', 'tenant_owner', 'admin') THEN
      -- Forzamos a que se mantengan los valores originales en columnas críticas
      NEW.role = OLD.role;
      NEW.tenant_id = OLD.tenant_id;
      NEW.branch_id = OLD.branch_id;
      NEW.points = OLD.points;
      NEW.is_guest = OLD.is_guest;
      NEW.is_active = OLD.is_active;
  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: refresh_course_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.refresh_course_metrics() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.course_metrics;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sku text,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    min_stock_alert integer DEFAULT 5,
    category_id uuid,
    brand_id uuid,
    model_id uuid,
    image_url text,
    gallery_urls jsonb DEFAULT '[]'::jsonb,
    specifications jsonb,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    barcode character varying(100),
    currency text DEFAULT 'ARS'::text,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    is_global boolean DEFAULT false,
    deleted_at timestamp with time zone,
    cost_price numeric DEFAULT 0,
    search_tsv tsvector GENERATED ALWAYS AS (((setweight(to_tsvector('spanish'::regconfig, COALESCE(name, ''::text)), 'A'::"char") || setweight(to_tsvector('spanish'::regconfig, COALESCE(description, ''::text)), 'B'::"char")) || setweight(to_tsvector('spanish'::regconfig, (COALESCE(barcode, ''::character varying))::text), 'C'::"char"))) STORED,
    media_metadata jsonb DEFAULT '[]'::jsonb,
    stock integer DEFAULT 0,
    branch_id uuid,
    total_units_sold integer DEFAULT 0,
    meta_title text,
    meta_description text,
    og_image text,
    has_variants boolean DEFAULT false,
    variant_options jsonb DEFAULT '[]'::jsonb,
    offer_start_date timestamp with time zone,
    offer_end_date timestamp with time zone,
    warranty_days integer DEFAULT 0,
    tax_percentage numeric DEFAULT 21,
    weight numeric,
    dimensions jsonb DEFAULT '{"width": 0, "height": 0, "length": 0}'::jsonb,
    seo_keywords text,
    cross_sell_products uuid[] DEFAULT '{}'::uuid[],
    CONSTRAINT check_min_stock_positive CHECK ((min_stock_alert >= 0)),
    CONSTRAINT check_product_sale_price CHECK (((sale_price IS NULL) OR (sale_price <= price))),
    CONSTRAINT check_sale_price_logic CHECK (((sale_price <= price) OR (sale_price IS NULL))),
    CONSTRAINT price_not_negative CHECK ((price >= (0)::numeric))
);

ALTER TABLE ONLY public.products FORCE ROW LEVEL SECURITY;


--
-- Name: COLUMN products.barcode; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.barcode IS 'Product barcode for inventory management and scanning';


--
-- Name: retail_price(public.products); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.retail_price(product_row public.products) RETURNS numeric
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    markup numeric;
    cat_name text;
    is_technical boolean := false;
BEGIN
    -- Check if category is technical (e.g., Repuestos)
    SELECT name INTO cat_name FROM public.categories WHERE id = product_row.category_id;
    
    IF cat_name ILIKE '%repuesto%' OR cat_name ILIKE '%microelectronica%' THEN
        is_technical := true;
    END IF;

    -- Also check product name for technical keywords just in case
    IF NOT is_technical THEN
        IF product_row.name ILIKE ANY (ARRAY['%módulo%', '%modulo%', '%pantalla%', '%batería%', '%bateria%', '%flex%', '%ic %']) THEN
            is_technical := true;
        END IF;
    END IF;

    IF is_technical THEN
        -- Get markup from settings
        SELECT (value->>'percentage')::numeric INTO markup FROM public.app_settings WHERE key = 'retail_markup';
        IF markup IS NULL THEN
            markup := 21; -- Fallback
        END IF;
        RETURN product_row.price * (1 + (markup / 100));
    ELSE
        RETURN product_row.price;
    END IF;
END;
$$;


--
-- Name: save_repair_order(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_repair_order(p_payload jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    new_record record;
    v_tenant_id uuid;
    v_branch_id uuid;
BEGIN
    -- Extract branch_id if present
    v_branch_id := NULLIF((p_payload->>'branch_id'), '')::uuid;

    -- Strict tenant resolution without hardcoded fallback
    v_tenant_id := COALESCE(
        public.get_current_tenant_id(),
        (SELECT tenant_id FROM public.branches WHERE id = v_branch_id LIMIT 1),
        NULLIF(p_payload->>'tenant_id', '')::uuid
    );

    IF v_tenant_id IS NULL OR v_tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
        RAISE EXCEPTION 'Aislamiento crítico: No se puede guardar una orden de reparación sin un tenant_id válido.';
    END IF;

    -- Non-superadmin cannot inject repairs into other tenants
    IF NOT public.is_super_admin() AND public.get_current_tenant_id() IS NOT NULL THEN
        IF v_tenant_id != public.get_current_tenant_id() THEN
            RAISE EXCEPTION 'Aislamiento crítico: No tiene permisos para guardar reparaciones en otra sucursal.';
        END IF;
    END IF;

    INSERT INTO public.repairs (
        id, tenant_id, branch_id, client_id, device_id, issue_description,
        current_status_id, estimated_cost, final_cost, deposit_amount, 
        technical_labor_cost, spare_part_cost, technical_report, technician_notes,
        security_pin, security_pattern, checklist, glass_upsell, whatsapp_notifications,
        assigned_technician_id, received_by, created_at, updated_at
    )
    SELECT 
        COALESCE((p_payload->>'id')::uuid, gen_random_uuid()),
        v_tenant_id,
        v_branch_id,
        NULLIF((p_payload->>'client_id'), '')::uuid,
        NULLIF((p_payload->>'device_id'), '')::uuid,
        p_payload->>'issue_description',
        COALESCE((p_payload->>'current_status_id')::bigint, 1),
        COALESCE((p_payload->>'estimated_cost')::numeric, 0),
        COALESCE((p_payload->>'final_cost')::numeric, 0),
        COALESCE((p_payload->>'deposit_amount')::numeric, 0),
        COALESCE((p_payload->>'technical_labor_cost')::numeric, 0),
        COALESCE((p_payload->>'spare_part_cost')::numeric, 0),
        p_payload->>'technical_report',
        COALESCE(p_payload->>'technician_notes', p_payload->>'notes'),
        p_payload->>'security_pin',
        p_payload->>'security_pattern',
        COALESCE((p_payload->>'checklist')::jsonb, '{}'::jsonb),
        COALESCE((p_payload->>'glass_upsell')::boolean, false),
        COALESCE((p_payload->>'whatsapp_notifications')::boolean, true),
        NULLIF((p_payload->>'assigned_technician_id'), '')::uuid,
        NULLIF((p_payload->>'received_by'), '')::uuid,
        COALESCE((p_payload->>'created_at')::timestamp with time zone, now()),
        now()
    RETURNING * INTO new_record;
    
    RETURN row_to_json(new_record)::jsonb;
END;
$$;


--
-- Name: set_repair_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_repair_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_next_value bigint;
BEGIN
    -- Skip if already set (e.g., imported records)
    IF NEW.repair_number IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- Atomic counter increment — no aggregate, no FOR UPDATE conflict
    INSERT INTO public.repair_number_sequences (tenant_id, last_value)
        VALUES (NEW.tenant_id, 1)
    ON CONFLICT (tenant_id) DO UPDATE
        SET last_value = repair_number_sequences.last_value + 1
    RETURNING last_value INTO v_next_value;

    NEW.repair_number = v_next_value;
    RETURN NEW;
END;
$$;


--
-- Name: set_tenant_invoice_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_tenant_invoice_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(invoice_number), 0) + 1 INTO next_num FROM public.invoices WHERE tenant_id = NEW.tenant_id;
    NEW.invoice_number := next_num;
    RETURN NEW;
END;
$$;


--
-- Name: set_tenant_repair_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_tenant_repair_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(repair_number), 0) + 1 INTO next_num FROM public.repairs WHERE tenant_id = NEW.tenant_id;
    NEW.repair_number := next_num;
    RETURN NEW;
END;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


--
-- Name: slugify(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.slugify(value text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN lower(regexp_replace(unaccent(value), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$;


--
-- Name: soft_delete_account(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.soft_delete_account() RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  UPDATE public.profiles
  SET
    deleted_at = NOW(),
    email = 'deleted_' || id || '@deleted.arecofix.com',
    full_name = '[Cuenta Eliminada]',
    first_name = NULL,
    last_name = NULL,
    display_name = '[Eliminado]',
    phone = NULL,
    avatar_url = NULL,
    bio = NULL,
    address = NULL,
    dni = NULL,
    cuit_cuil = NULL,
    is_active = FALSE
  WHERE id = auth.uid();

  -- NO eliminamos invoices, orders, repairs → historial contable intacto
  -- Solo anonimizamos los datos personales del profile
END;
$$;


--
-- Name: FUNCTION soft_delete_account(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.soft_delete_account() IS 'Soft delete: anonimiza datos personales pero preserva el historial contable.';


--
-- Name: submit_exam(uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.submit_exam(p_content_id uuid, p_answers jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_email TEXT;
    v_uid UUID;
    v_tenant_id UUID;
    v_passing_score NUMERIC := 60.0;
    v_total_questions INTEGER := 0;
    v_correct_answers INTEGER := 0;
    v_score NUMERIC := 0.0;
    v_passed BOOLEAN := false;
    v_metadata JSONB;
    v_answer JSONB;
    v_q_id UUID;
    v_q_idx INTEGER;
    v_real_idx INTEGER;
    v_progress_result JSONB;
    v_has_access BOOLEAN := false;
    v_sub_status TEXT;
BEGIN
    v_email := auth.jwt() ->> 'email';
    v_uid := auth.uid();

    IF v_email IS NULL AND v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- VALIDACIÓN DE MEMBRESÍA (Golden Rule: Si está suspended o expired, rechazar)
    IF v_uid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        SELECT status INTO v_sub_status
        FROM public.academy_subscriptions
        WHERE user_id = v_uid
        LIMIT 1;

        IF v_sub_status IS NOT NULL AND v_sub_status IN ('suspended', 'expired') THEN
            RAISE EXCEPTION 'Membership expired. Cannot submit exam.' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Obtener metadata del examen
    SELECT m.tenant_id, c.metadata INTO v_tenant_id, v_metadata
    FROM public.course_lessons c
    JOIN public.course_modules m ON m.id = c.module_id
    WHERE c.id = p_content_id;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Exam content not found';
    END IF;

    -- Comprobar permisos del usuario
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_uid 
          AND role IN ('admin', 'staff', 'super_admin', 'tenant_owner')
    ) THEN
        v_has_access := true;
    ELSE
        IF EXISTS (
            SELECT 1 FROM public.course_lessons c
            JOIN public.course_modules cm ON cm.id = c.module_id
            JOIN public.course_enrollments ce ON ce.course_id = cm.course_id
            WHERE c.id = p_content_id 
              AND ce.status = 'confirmed'
              AND (
                (v_email IS NOT NULL AND lower(ce.email) = lower(v_email))
                OR (ce.user_id IS NOT NULL AND ce.user_id = v_uid)
              )
        ) THEN 
            v_has_access := true; 
        END IF;
    END IF;

    IF NOT v_has_access THEN 
        RAISE EXCEPTION 'Access denied'; 
    END IF;

    v_passing_score := COALESCE((v_metadata->>'passing_score')::NUMERIC, 60.0);

    SELECT count(*) INTO v_total_questions 
    FROM public.course_exam_questions 
    WHERE content_id = p_content_id;

    IF v_total_questions = 0 THEN 
        RAISE EXCEPTION 'Exam has no questions'; 
    END IF;

    -- Evaluar respuestas enviadas
    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
        v_q_id := (v_answer->>'question_id')::UUID;
        v_q_idx := (v_answer->>'selected_index')::INTEGER;
        
        SELECT correct_option_index INTO v_real_idx 
        FROM public.course_exam_questions 
        WHERE id = v_q_id AND content_id = p_content_id;
        
        IF v_real_idx IS NOT NULL AND v_real_idx = v_q_idx THEN 
            v_correct_answers := v_correct_answers + 1; 
        END IF;
    END LOOP;

    v_score := (v_correct_answers::NUMERIC / v_total_questions::NUMERIC) * 100.0;
    v_passed := v_score >= v_passing_score;

    INSERT INTO public.course_exam_submissions (content_id, tenant_id, email, answers, score, passed)
    VALUES (p_content_id, v_tenant_id, COALESCE(v_email, 'anonymous@arecofix.com'), p_answers, v_score, v_passed);

    -- Auto-completar el contenido en course_progress si aprobó
    IF v_passed THEN
        SELECT public.mark_content_completed(p_content_id) INTO v_progress_result;
    END IF;

    RETURN jsonb_build_object(
        'score', v_score,
        'passed', v_passed,
        'correct_answers', v_correct_answers,
        'total_questions', v_total_questions,
        'progress', v_progress_result
    );
END;
$$;


--
-- Name: sync_order_items_stock(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_order_items_stock() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_order_status text;
BEGIN
    -- Determine parent order status
    SELECT status INTO v_order_status 
    FROM public.orders 
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);

    -- If order is still in draft cart state, DO NOT alter product stock yet
    IF v_order_status = 'cart' THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- CASO INSERT: Producto comprado en orden activa/confirmada -> descontar stock
    IF (TG_OP = 'INSERT') THEN
        IF NEW.product_id IS NOT NULL THEN
            UPDATE public.products 
            SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0),
                updated_at = NOW()
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    END IF;

    -- CASO DELETE: Ítem eliminado de orden activa -> devolver stock
    IF (TG_OP = 'DELETE') THEN
        IF OLD.product_id IS NOT NULL THEN
            UPDATE public.products 
            SET stock = COALESCE(stock, 0) + OLD.quantity,
                updated_at = NOW()
            WHERE id = OLD.product_id;
        END IF;
        RETURN OLD;
    END IF;

    -- CASO UPDATE: Cambio de cantidad o producto en orden activa
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.product_id != NEW.product_id) THEN
            IF OLD.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = COALESCE(stock, 0) + OLD.quantity 
                WHERE id = OLD.product_id;
            END IF;
            IF NEW.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0) 
                WHERE id = NEW.product_id;
            END IF;
        ELSE
            IF NEW.product_id IS NOT NULL THEN
                UPDATE public.products 
                SET stock = GREATEST(COALESCE(stock, 0) - (NEW.quantity - OLD.quantity), 0),
                    updated_at = NOW()
                WHERE id = NEW.product_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: sync_repair_parts_stock(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_repair_parts_stock() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$ BEGIN RETURN NEW; END; $$;


--
-- Name: trg_contact_message_notify_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_contact_message_notify_admin() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Insert admin notification ensuring exact tenant_id propagation
  INSERT INTO public.notifications (
    tenant_id,
    title,
    message,
    type,
    scope,
    is_read,
    created_at,
    branch_id
  ) VALUES (
    NEW.tenant_id,
    CASE 
      WHEN NEW.subject = 'Solicitud de Turno: Reparación' THEN '🔧 Nuevo Turno Solicitado'
      ELSE '✉️ Nuevo Mensaje de Contacto'
    END,
    CASE 
      WHEN NEW.subject = 'Solicitud de Turno: Reparación' THEN COALESCE(NEW.name, 'Cliente') || ' solicitó un turno de reparación.'
      ELSE COALESCE(NEW.name, 'Contacto') || ' envió un mensaje: ' || SUBSTRING(COALESCE(NEW.message, ''), 1, 80)
    END,
    'info',
    'admin',
    false,
    NOW(),
    NEW.branch_id
  );
  RETURN NEW;
END;
$$;


--
-- Name: trg_insert_admin_notifications(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_insert_admin_notifications() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    final_payload JSONB;
    target_tenant UUID;
BEGIN
    final_payload := COALESCE(NEW.payload, '{}'::jsonb);
    
    IF NEW.source IS NOT NULL THEN
        final_payload := jsonb_set(final_payload, '{source}', to_jsonb(NEW.source));
    END IF;

    target_tenant := COALESCE(NEW.tenant_id, public.get_current_tenant_id());
    
    IF target_tenant IS NULL THEN
        RAISE EXCEPTION 'Cannot insert admin notification without a valid tenant_id';
    END IF;

    INSERT INTO public.notifications (
        tenant_id,
        title,
        message,
        type,
        scope,
        is_read,
        created_at,
        payload,
        branch_id
    ) VALUES (
        target_tenant,
        COALESCE(NEW.title, 'Nueva Notificación'),
        COALESCE(NEW.message, 'Evento de sistema.'),
        COALESCE(NEW.type, 'info'),
        'admin',
        COALESCE(NEW.is_read, false),
        COALESCE(NEW.created_at, NOW()),
        final_payload,
        NEW.branch_id
    );
    RETURN NEW;
END;
$$;


--
-- Name: trg_invoice_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_invoice_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := public.next_invoice_number(NEW.tenant_id);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: trigger_courses_slug(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_courses_slug() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.slugify(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: trigger_payment_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_payment_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Idempotencia: Solo ejecutar si el status REALMENTE cambió
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    
    -- Si es aprobado, crear o actualizar enrollment
    IF NEW.status = 'approved' THEN
      INSERT INTO public.enrollments (student_id, course_id, has_access, granted_at, access_type)
      VALUES (NEW.student_id, NEW.course_id, true, now(), 'one_time')
      ON CONFLICT (student_id, course_id) 
      DO UPDATE SET has_access = true, granted_at = now(), revoked_at = null, reason = null;
    END IF;

    -- Si es revocado (rejected, refunded, expired), remover acceso
    IF NEW.status IN ('rejected', 'refunded', 'expired') THEN
      UPDATE public.enrollments 
      SET has_access = false, revoked_at = now(), reason = 'Payment status changed to ' || NEW.status
      WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
    END IF;

    -- Crear Log de Auditoría
    INSERT INTO public.payment_audit_log (payment_id, action, actor_id, metadata)
    VALUES (NEW.id, NEW.status::text, auth.uid(), to_jsonb(NEW));
    
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: trigger_process_completed_order(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_process_completed_order() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://jftiyfnnaogmgvksgkbn.supabase.co/functions/v1/process-completed-order',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0"}'::jsonb,
    body := row_to_json(NEW)::jsonb
  );
  RETURN NEW;
END;
$$;


--
-- Name: trigger_set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;


--
-- Name: update_inventory_on_repair_part(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_inventory_on_repair_part() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    v_branch_id uuid;
BEGIN
    -- Cuando se inserta un repuesto (Por técnico o por App Cliente)
    IF TG_OP = 'INSERT' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = NEW.repair_id;

        -- Descontar Stock Global Obligatorio
        UPDATE public.products
        SET stock = GREATEST(stock - NEW.quantity, 0)
        WHERE id = NEW.product_id;

        -- Descontar Stock por sucursal (si existe vinculación)
        IF v_branch_id IS NOT NULL THEN
            UPDATE public.product_stock_per_branch
            SET quantity = GREATEST(quantity - NEW.quantity, 0)
            WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
        END IF;

    -- Manejar reversiones en caso que nos equivoquemos en el Taller y quitemos la funda de la orden    
    ELSIF TG_OP = 'DELETE' THEN
        SELECT branch_id INTO v_branch_id FROM public.repairs WHERE id = OLD.repair_id;

        UPDATE public.products
        SET stock = stock + OLD.quantity
        WHERE id = OLD.product_id;

        IF v_branch_id IS NOT NULL THEN
            UPDATE public.product_stock_per_branch
            SET quantity = quantity + OLD.quantity
            WHERE product_id = OLD.product_id AND branch_id = v_branch_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: update_order_total(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_order_total() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    UPDATE public.orders
    SET 
        subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)),
        total = (SELECT COALESCE(SUM(subtotal), 0) FROM public.order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id))
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN NEW;
END;
$$;


--
-- Name: update_repair_bypass(uuid, jsonb, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_repair_bypass(p_id uuid, p_payload jsonb, p_tenant_id uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Forzamos la actualización de la tabla correcta sin buscar 'repair_statuses'
    UPDATE public.repairs
    SET 
        current_status_id = COALESCE((p_payload->>'current_status_id')::integer, current_status_id),
        technician_notes = COALESCE(p_payload->>'technician_notes', technician_notes)
    WHERE id = p_id AND tenant_id = p_tenant_id;
END;
$$;


--
-- Name: update_repair_total_cost(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_repair_total_cost() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    UPDATE public.repairs 
    SET costo_repuesto = (SELECT COALESCE(SUM(unit_cost_at_time * quantity), 0) FROM public.repair_parts_used WHERE repair_id = COALESCE(NEW.repair_id, OLD.repair_id))
    WHERE id = COALESCE(NEW.repair_id, OLD.repair_id);
    RETURN NEW;
END; $$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: validate_repair_delivery(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_repair_delivery() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
  v_new_status_name TEXT;
BEGIN
  -- Solo actuar si current_status_id cambió
  IF OLD.current_status_id IS NOT DISTINCT FROM NEW.current_status_id THEN
    RETURN NEW;
  END IF;

  -- Obtener el nombre del nuevo status
  SELECT name INTO v_new_status_name
  FROM public.repair_status_types
  WHERE id = NEW.current_status_id;

  -- Validar solo cuando el status es "Entregado" o similar
  IF LOWER(COALESCE(v_new_status_name, '')) IN ('entregado', 'delivered', 'completado') THEN

    -- Regla 1: final_cost debe ser > 0
    IF (NEW.final_cost IS NULL OR NEW.final_cost <= 0) THEN
      RAISE EXCEPTION 'No se puede marcar como "%": el costo final debe ser mayor a 0. Actual: %',
        v_new_status_name, COALESCE(NEW.final_cost::TEXT, 'NULL');
    END IF;

    -- Regla 2: technical_report debe tener contenido
    IF (NEW.technical_report IS NULL OR TRIM(NEW.technical_report) = '') THEN
      RAISE EXCEPTION 'No se puede marcar como "%": falta el informe técnico (technical_report).',
        v_new_status_name;
    END IF;

  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION validate_repair_delivery(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.validate_repair_delivery() IS 'Trigger: impide entregar reparación sin final_cost > 0 y technical_report.';


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    RETURN _parts[array_length(_parts, 1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
_bucketId text;
BEGIN
    -- will be replaced by migrations when server starts
    -- saving space for cloud-init
END
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_prefix_len INT;
    v_prefix_start INT;
    v_combined_levels INT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_prefix_len := length(coalesce(prefix, ''));
    v_prefix_start := coalesce(array_length(string_to_array(coalesce(prefix, ''), v_delimiter), 1), 1);
    v_combined_levels := coalesce(array_length(string_to_array(v_prefix, v_delimiter), 1), 1);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT array_to_string(path_tokens[$1:$2], '/') AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $3 || '%%'
                  AND bucket_id = $4
                  AND array_length(objects.path_tokens, 1) <> $2
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT array_to_string(path_tokens[$1:$2], '/') AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $3 || '%%'
               AND bucket_id = $4
               AND array_length(objects.path_tokens, 1) = $2
             ORDER BY %I %s)
            LIMIT $5 OFFSET $6
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING v_prefix_start, v_combined_levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := substring(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter) from v_prefix_len + 1);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := substring(v_current.name from v_prefix_len + 1);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
    v_sort_order text;
    v_sort_column text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    -- Defense-in-depth: this function is independently reachable and must
    -- not trust p_sort_order/p_sort_column to already be validated by a
    -- caller. Normalize to the same strict allow-list storage.search_v2
    -- uses before interpolating anything into dynamic SQL below.
    v_sort_order := lower(coalesce(p_sort_order, 'asc'));
    IF v_sort_order NOT IN ('asc', 'desc') THEN
        v_sort_order := 'asc';
    END IF;

    v_sort_column := lower(coalesce(p_sort_column, 'updated_at'));
    IF v_sort_column NOT IN ('updated_at', 'created_at') THEN
        v_sort_column := 'updated_at';
    END IF;

    IF v_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        v_sort_column,
        v_cursor_op,
        v_sort_column,
        v_sort_order,
        v_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: -
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


--
-- Name: calculate_danger_level(double precision, double precision, double precision); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.calculate_danger_level(lat double precision, lng double precision, radius_meters double precision DEFAULT 200) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN 1;
END;
$$;


--
-- Name: delete_own_account(); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.delete_own_account() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN TRUE;
END;
$$;


--
-- Name: get_alerts_in_radius(double precision, double precision, double precision); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.get_alerts_in_radius(center_lat double precision, center_lng double precision, radius_meters double precision DEFAULT 2000) RETURNS TABLE(id uuid, user_id uuid, type text, status text, latitude double precision, longitude double precision, description text, created_at timestamp with time zone, distance_meters double precision, profiles jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_id,
    r.type,
    r.status,
    r.latitude,
    r.longitude,
    r.description,
    r.created_at,
    (6371000 * acos(
      least(1.0, greatest(-1.0,
        cos(radians(center_lat)) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(center_lng)) +
        sin(radians(center_lat)) * sin(radians(r.latitude))
      ))
    )) AS distance_meters,
    coalesce(
      (SELECT to_jsonb(p) FROM zarx.profiles p WHERE p.id = r.user_id),
      '{}'::jsonb
    ) AS profiles
  FROM zarx.reports r
  WHERE (6371000 * acos(
    least(1.0, greatest(-1.0,
      cos(radians(center_lat)) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(center_lng)) +
      sin(radians(center_lat)) * sin(radians(r.latitude))
    ))
  )) <= radius_meters
  ORDER BY r.created_at DESC;
END;
$$;


--
-- Name: get_heatmap_data(integer); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.get_heatmap_data(hours_ago integer DEFAULT 24) RETURNS TABLE(latitude double precision, longitude double precision, intensity double precision)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN QUERY
    SELECT r.latitude, r.longitude, 1.0::double precision as intensity
    FROM zarx.reports r
    WHERE r.created_at >= now() - (hours_ago || ' hours')::interval;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    next_id INT;
BEGIN
    SELECT COALESCE(COUNT(*), 0) + 1 INTO next_id FROM zarx.profiles;
    INSERT INTO zarx.profiles (
        id, 
        full_name, 
        email, 
        avatar_url, 
        role, 
        rank, 
        display_id, 
        reputation_score
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'citizen'),
        'Cadete',
        'ZARX-' || LPAD(next_id::TEXT, 4, '0'),
        100
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(zarx.profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(zarx.profiles.avatar_url, EXCLUDED.avatar_url);
    RETURN new;
END;
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.is_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    RETURN (
        COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super_admin')
        OR EXISTS (
            SELECT 1 FROM zarx.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );
END;
$$;


--
-- Name: update_fcm_token(text); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.update_fcm_token(token text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  RETURN TRUE;
END;
$$;


--
-- Name: validate_neighbor_report(uuid, uuid); Type: FUNCTION; Schema: zarx; Owner: -
--

CREATE FUNCTION zarx.validate_neighbor_report(target_report_id uuid, validator_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  UPDATE zarx.reports
  SET status = 'RESOLVED', updated_at = NOW()
  WHERE id = target_report_id;
  RETURN TRUE;
END;
$$;


--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: feature_flags; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.feature_flags (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    rollout_percentage integer DEFAULT 100 NOT NULL,
    bucket_key character varying(255),
    CONSTRAINT rollout_percentage_must_be_between_0_and_100 CHECK (((rollout_percentage >= 0) AND (rollout_percentage <= 100)))
);


--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL,
    migrations_ran integer DEFAULT 0,
    broadcast_adapter character varying(255) DEFAULT 'gen_rpc'::character varying,
    max_presence_events_per_second integer DEFAULT 1000,
    max_payload_size_in_kb integer DEFAULT 3000,
    max_client_presence_events_per_window integer,
    client_presence_window_ms integer,
    presence_enabled boolean DEFAULT false NOT NULL,
    feature_flags jsonb DEFAULT '{}'::jsonb NOT NULL,
    gcm_migrated_at timestamp(0) without time zone,
    CONSTRAINT jwt_secret_or_jwt_jwks_required CHECK (((jwt_secret IS NOT NULL) OR (jwt_jwks IS NOT NULL)))
);


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type public.factor_type NOT NULL,
    status public.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    last_challenged_at timestamp with time zone,
    phone text,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal public.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag character varying(255)
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: blog_posts_backup_20261018; Type: TABLE; Schema: backups; Owner: -
--

CREATE TABLE backups.blog_posts_backup_20261018 (
    id uuid,
    title character varying(255),
    slug character varying(255),
    content text,
    excerpt character varying(500),
    author character varying(255),
    featured_image text,
    category_id uuid,
    status character varying(50),
    view_count integer,
    seo_title character varying(255),
    seo_description character varying(500),
    seo_keywords character varying(500),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    tenant_id uuid,
    template character varying(50),
    author_id uuid
);


--
-- Name: services_backup_20261018; Type: TABLE; Schema: backups; Owner: -
--

CREATE TABLE backups.services_backup_20261018 (
    id uuid,
    name text,
    slug text,
    description text,
    estimated_time text,
    image_url text,
    is_active boolean,
    created_at timestamp with time zone,
    duration_minutes integer,
    price numeric(10,2),
    category_id uuid,
    tenant_id uuid,
    updated_at timestamp with time zone,
    branch_id uuid
);


--
-- Name: academy_email_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academy_email_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    user_id uuid,
    recipient_email text NOT NULL,
    notification_type text NOT NULL,
    subject text NOT NULL,
    status text DEFAULT 'sent'::text NOT NULL,
    reference_id text,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT academy_email_notifications_notification_type_check CHECK ((notification_type = ANY (ARRAY['payment_receipt'::text, 'grace_period_warning'::text, 'course_completed'::text]))),
    CONSTRAINT academy_email_notifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text])))
);

ALTER TABLE ONLY public.academy_email_notifications FORCE ROW LEVEL SECURITY;


--
-- Name: academy_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academy_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    subscription_id uuid NOT NULL,
    user_id uuid NOT NULL,
    plan_id uuid,
    amount numeric(10,2) NOT NULL,
    currency_id text DEFAULT 'ARS'::text NOT NULL,
    status text NOT NULL,
    status_detail text,
    mp_payment_id text NOT NULL,
    payment_method_id text,
    payment_type_id text,
    paid_at timestamp with time zone DEFAULT now() NOT NULL,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT academy_payments_status_check CHECK ((status = ANY (ARRAY['approved'::text, 'pending'::text, 'rejected'::text, 'cancelled'::text, 'refunded'::text])))
);

ALTER TABLE ONLY public.academy_payments FORCE ROW LEVEL SECURITY;


--
-- Name: academy_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academy_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency_id text DEFAULT 'ARS'::text NOT NULL,
    interval_days integer DEFAULT 30 NOT NULL,
    grace_days integer DEFAULT 7 NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT academy_plans_price_check CHECK ((price >= (0)::numeric))
);

ALTER TABLE ONLY public.academy_plans FORCE ROW LEVEL SECURITY;


--
-- Name: course_certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    course_id uuid NOT NULL,
    email text NOT NULL,
    student_name text NOT NULL,
    issued_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    pdf_url text,
    student_dni text,
    status text DEFAULT 'valid'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT course_certificates_status_check CHECK ((status = ANY (ARRAY['valid'::text, 'revoked'::text])))
);

ALTER TABLE ONLY public.course_certificates FORCE ROW LEVEL SECURITY;


--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    user_id uuid,
    CONSTRAINT course_enrollments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'rejected'::text])))
);

ALTER TABLE ONLY public.course_enrollments FORCE ROW LEVEL SECURITY;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    first_name text,
    last_name text,
    avatar_url text,
    bio text,
    phone text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    role text DEFAULT 'user'::text,
    address text,
    dni text,
    cuit_cuil text,
    branch_id uuid,
    tenant_id uuid DEFAULT public.get_my_tenant(),
    deleted_at timestamp with time zone,
    is_guest boolean DEFAULT false,
    referral_code text,
    points integer DEFAULT 0,
    CONSTRAINT check_valid_first_name CHECK (((first_name IS NOT NULL) AND (first_name <> ''::text) AND (first_name <> 'Cliente'::text))),
    CONSTRAINT chk_profiles_first_name CHECK (((first_name IS NULL) OR ((TRIM(BOTH FROM first_name) <> 'Cliente'::text) AND (TRIM(BOTH FROM first_name) <> ''::text)))),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text, 'technician'::text])))
);

ALTER TABLE ONLY public.profiles FORCE ROW LEVEL SECURITY;


--
-- Name: academy_students_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.academy_students_view WITH (security_invoker='true') AS
 SELECT p.id AS user_id,
    p.first_name,
    p.last_name,
    p.email,
    p.dni,
    p.phone,
    p.tenant_id,
    p.role,
    ( SELECT count(*) AS count
           FROM public.course_enrollments ce
          WHERE ((ce.user_id = p.id) AND (ce.status = 'confirmed'::text))) AS enrolled_courses_count,
    ( SELECT count(*) AS count
           FROM public.course_certificates cc
          WHERE (cc.user_id = p.id)) AS certificates_count
   FROM public.profiles p
  WHERE (p.role = 'user'::text);


--
-- Name: academy_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academy_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    user_id uuid NOT NULL,
    plan_id uuid,
    status text DEFAULT 'active'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    grace_period_ends_at timestamp with time zone NOT NULL,
    mp_preapproval_id text,
    mp_preference_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT academy_subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'grace_period'::text, 'suspended'::text, 'expired'::text])))
);

ALTER TABLE ONLY public.academy_subscriptions FORCE ROW LEVEL SECURITY;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    user_id uuid,
    title character varying NOT NULL,
    message text NOT NULL,
    type character varying DEFAULT 'info'::character varying,
    link character varying,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    branch_id uuid,
    scope character varying DEFAULT 'user'::character varying,
    source text,
    payload jsonb,
    CONSTRAINT notifications_scope_check CHECK (((scope)::text = ANY (ARRAY[('user'::character varying)::text, ('admin'::character varying)::text])))
);

ALTER TABLE ONLY public.notifications FORCE ROW LEVEL SECURITY;


--
-- Name: admin_notifications; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.admin_notifications WITH (security_invoker='true') AS
 SELECT notifications.id,
    notifications.tenant_id,
    notifications.title,
    notifications.message,
    notifications.is_read,
    notifications.created_at,
    notifications.payload,
    notifications.branch_id,
    NULL::text AS source,
    NULL::text AS type
   FROM public.notifications
  WHERE ((notifications.scope)::text = 'admin'::text);


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    action text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    changed_by uuid,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.audit_logs FORCE ROW LEVEL SECURITY;


--
-- Name: auth_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action character varying(50) NOT NULL,
    ip_address inet,
    user_agent text,
    status character varying(20) DEFAULT 'success'::character varying,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.auth_logs FORCE ROW LEVEL SECURITY;


--
-- Name: available_users_for_employee; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.available_users_for_employee WITH (security_invoker='true') AS
 SELECT profiles.id,
    profiles.email,
    profiles.first_name,
    profiles.last_name,
    profiles.phone,
    profiles.avatar_url,
    profiles.created_at
   FROM public.profiles
  WHERE ((profiles.role = 'user'::text) OR (profiles.role IS NULL));


--
-- Name: bank_reconciliations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_reconciliations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    bank_name text DEFAULT 'Santander'::text,
    transaction_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text DEFAULT 'unmatched'::text,
    matched_invoice_id uuid,
    reconciliation_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.bank_reconciliations FORCE ROW LEVEL SECURITY;


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.blog_categories FORCE ROW LEVEL SECURITY;


--
-- Name: blog_post_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_post_tags (
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.blog_post_tags FORCE ROW LEVEL SECURITY;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    excerpt character varying(500),
    author character varying(255),
    featured_image text,
    category_id uuid,
    status character varying(50) DEFAULT 'draft'::character varying,
    view_count integer DEFAULT 0,
    seo_title character varying(255),
    seo_description character varying(500),
    seo_keywords character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    template character varying(50) DEFAULT 'modern'::character varying,
    author_id uuid
);

ALTER TABLE ONLY public.blog_posts FORCE ROW LEVEL SECURITY;


--
-- Name: blog_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.blog_tags FORCE ROW LEVEL SECURITY;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    address text,
    is_active boolean DEFAULT true,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    slug text,
    global_markup_percentage numeric DEFAULT 0,
    modules_config jsonb DEFAULT '{}'::jsonb,
    plan_id text,
    branding_settings jsonb DEFAULT '{"logo_url": null, "favicon_url": null, "primary_color": "#3b82f6"}'::jsonb,
    contact_email text,
    contact_phone text,
    tax_id text,
    official_name text,
    whatsapp_number text,
    bank_info jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE ONLY public.branches FORCE ROW LEVEL SECURITY;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    deleted_at timestamp with time zone,
    branch_id uuid
);

ALTER TABLE ONLY public.brands FORCE ROW LEVEL SECURITY;


--
-- Name: cash_movements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cash_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    branch_id uuid,
    amount numeric NOT NULL,
    type text NOT NULL,
    category text NOT NULL,
    payment_method text DEFAULT 'cash'::text,
    reference_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    is_fixed boolean DEFAULT false,
    CONSTRAINT cash_movements_category_check CHECK ((category = ANY (ARRAY['sale'::text, 'purchase'::text, 'repair'::text, 'adjustment'::text, 'draw'::text, 'scholarship'::text, 'external_salary'::text, 'fixed_expense'::text, 'petty_expense'::text, 'investment'::text, 'other'::text]))),
    CONSTRAINT cash_movements_type_check CHECK ((type = ANY (ARRAY['income'::text, 'expense'::text])))
);

ALTER TABLE ONLY public.cash_movements FORCE ROW LEVEL SECURITY;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    type text NOT NULL,
    image_url text,
    parent_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    deleted_at timestamp with time zone,
    branch_id uuid,
    scope character varying(20) DEFAULT 'both'::character varying,
    CONSTRAINT categories_type_check CHECK ((type = ANY (ARRAY['product'::text, 'course'::text, 'service'::text]))),
    CONSTRAINT check_cat_not_self_parent CHECK ((id <> parent_id)),
    CONSTRAINT check_no_circular_parent CHECK ((id <> parent_id)),
    CONSTRAINT check_no_self_parent CHECK ((id <> parent_id)),
    CONSTRAINT chk_categories_scope CHECK (((scope)::text = ANY ((ARRAY['product'::character varying, 'service'::character varying, 'both'::character varying])::text[])))
);

ALTER TABLE ONLY public.categories FORCE ROW LEVEL SECURITY;


--
-- Name: cola_tiktok; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cola_tiktok (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    url_video_r2 text NOT NULL,
    texto_post text NOT NULL,
    estado text DEFAULT 'pendiente'::text NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone text,
    subject text,
    is_read boolean DEFAULT false,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    branch_id uuid,
    CONSTRAINT contact_messages_email_check CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$'::text))
);

ALTER TABLE ONLY public.contact_messages FORCE ROW LEVEL SECURITY;


--
-- Name: course_exam_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_exam_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    question_text text NOT NULL,
    options jsonb NOT NULL,
    correct_option_index integer NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.course_exam_questions FORCE ROW LEVEL SECURITY;


--
-- Name: course_exam_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_exam_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    email text NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    passed boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.course_exam_submissions FORCE ROW LEVEL SECURITY;


--
-- Name: course_instructors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_instructors (
    course_id uuid NOT NULL,
    instructor_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.course_instructors FORCE ROW LEVEL SECURITY;


--
-- Name: course_lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    type text NOT NULL,
    title text,
    url text,
    metadata jsonb,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT course_lessons_type_check CHECK ((type = ANY (ARRAY['video'::text, 'image'::text, 'document'::text, 'link'::text, 'text'::text, 'exam'::text])))
);

ALTER TABLE ONLY public.course_lessons FORCE ROW LEVEL SECURITY;


--
-- Name: course_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid,
    title text NOT NULL,
    description text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    unlock_date timestamp with time zone
);

ALTER TABLE ONLY public.course_modules FORCE ROW LEVEL SECURITY;


--
-- Name: course_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    email text NOT NULL,
    course_id uuid NOT NULL,
    content_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT now(),
    user_id uuid
);

ALTER TABLE ONLY public.course_progress FORCE ROW LEVEL SECURITY;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    duration text,
    schedule text,
    level text,
    price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    image_url text,
    instructor_name text,
    start_date date,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    syllabus jsonb,
    benefits jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    instructor_id uuid,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    classes_count integer DEFAULT 0,
    hours_content integer DEFAULT 0,
    hours_practice integer DEFAULT 0,
    hours_per_week text,
    instructor_role text,
    instructor_bio text,
    instructor_avatar text,
    audience_list jsonb DEFAULT '[]'::jsonb,
    reviews_count integer DEFAULT 0,
    author_id uuid,
    unlock_strategy text DEFAULT 'ALL_AT_ONCE'::text,
    CONSTRAINT check_course_sale_price CHECK (((sale_price IS NULL) OR (sale_price <= price))),
    CONSTRAINT courses_level_check CHECK ((level = ANY (ARRAY['basic'::text, 'intermediate'::text, 'advanced'::text, 'all_levels'::text]))),
    CONSTRAINT courses_unlock_strategy_check CHECK ((unlock_strategy = ANY (ARRAY['ALL_AT_ONCE'::text, 'SEQUENTIAL'::text])))
);

ALTER TABLE ONLY public.courses FORCE ROW LEVEL SECURITY;


--
-- Name: customer_devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    model_id uuid,
    serial_number text,
    imei text,
    passcode text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    type character varying DEFAULT 'Celular'::character varying
);

ALTER TABLE ONLY public.customer_devices FORCE ROW LEVEL SECURITY;


--
-- Name: educacion_y_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.educacion_y_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo text NOT NULL,
    titulo text NOT NULL,
    institucion text,
    detalles jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT educacion_y_skills_tipo_check CHECK ((tipo = ANY (ARRAY['educacion'::text, 'certificacion'::text, 'skill'::text])))
);


--
-- Name: experiencia_laboral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiencia_laboral (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    empresa text NOT NULL,
    puesto_base text NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    bullet_points jsonb DEFAULT '[]'::jsonb NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_number integer,
    customer_name text,
    customer_tax_id text,
    customer_address text,
    total_amount numeric(10,2) NOT NULL,
    issued_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    pdf_url text,
    type character varying(50) DEFAULT 'B'::character varying,
    order_id uuid,
    repair_id uuid,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    tax_amount numeric DEFAULT 0,
    net_amount numeric DEFAULT 0,
    origin text DEFAULT 'sale'::text NOT NULL,
    subtotal numeric DEFAULT 0 NOT NULL,
    discount numeric DEFAULT 0 NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    notes text,
    customer_id uuid,
    customer_email text,
    status text DEFAULT 'issued'::text,
    advance_payment numeric DEFAULT 0,
    balance_due numeric DEFAULT 0,
    repair_order_id text,
    repair_order_number text,
    customer_doc_type text,
    customer_vat_condition text,
    payment_method text,
    sale_condition text,
    internal_notes text,
    CONSTRAINT invoices_origin_check CHECK ((origin = ANY (ARRAY['sale'::text, 'order'::text, 'manual'::text, 'repair'::text])))
);

ALTER TABLE ONLY public.invoices FORCE ROW LEVEL SECURITY;


--
-- Name: COLUMN invoices.origin; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.origin IS 'Origen del comprobante: sale=punto de venta, order=pedido web, manual=carga manual admin';


--
-- Name: COLUMN invoices.subtotal; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.subtotal IS 'Suma de ítems antes de IVA y descuento. Equivale a net_amount (columna legacy).';


--
-- Name: COLUMN invoices.discount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.discount IS 'Descuento fijo en $ARS aplicado sobre el subtotal + IVA.';


--
-- Name: COLUMN invoices.items; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.items IS 'Array JSONB de líneas de factura. Requerido para facturas manuales.
   Schema: [{ description, quantity, unit_price, tax_rate, subtotal, total }]';


--
-- Name: COLUMN invoices.notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.notes IS 'Notas internas del comprobante (no visibles al cliente).';


--
-- Name: COLUMN invoices.customer_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.customer_id IS 'FK opcional a profiles. NULL = Consumidor Final.';


--
-- Name: COLUMN invoices.customer_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.invoices.customer_email IS 'Email para envío futuro del comprobante en PDF.';


--
-- Name: knowledge_base; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_base (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    source_type text NOT NULL,
    source_id uuid,
    source_url text,
    title text NOT NULL,
    content text NOT NULL,
    chunk_index integer DEFAULT 0 NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    embedding extensions.vector(768),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT knowledge_base_source_type_check CHECK ((source_type = ANY (ARRAY['product'::text, 'service'::text, 'manual'::text, 'course'::text, 'faq'::text, 'blog'::text, 'custom'::text])))
);

ALTER TABLE ONLY public.knowledge_base FORCE ROW LEVEL SECURITY;


--
-- Name: TABLE knowledge_base; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.knowledge_base IS 'Almacena chunks de conocimiento con embeddings para el sistema RAG de Arecofix.';


--
-- Name: COLUMN knowledge_base.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.knowledge_base.content IS 'Texto plano del chunk, usado como contexto en el prompt del LLM.';


--
-- Name: COLUMN knowledge_base.chunk_index; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.knowledge_base.chunk_index IS 'Índice de fragmento cuando un documento largo se divide. Empieza en 0.';


--
-- Name: COLUMN knowledge_base.metadata; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.knowledge_base.metadata IS 'JSONB libre: tags, sku, precio, idioma, branch_id, etc.';


--
-- Name: COLUMN knowledge_base.embedding; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.knowledge_base.embedding IS 'Vector de 768 dims generado por bge-base-en-v1.5 vía Cloudflare Workers AI.';


--
-- Name: models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.models (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid,
    name text NOT NULL,
    slug text NOT NULL,
    release_year integer,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_models_name CHECK (((name IS NULL) OR ((TRIM(BOTH FROM name) <> 'Equipo Genérico'::text) AND (TRIM(BOTH FROM name) <> ''::text))))
);

ALTER TABLE ONLY public.models FORCE ROW LEVEL SECURITY;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    product_id uuid,
    course_id uuid,
    quantity integer DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    product_name character varying(255),
    product_sku character varying(100),
    subtotal numeric(10,2) DEFAULT 0,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    unit_cost_at_time numeric DEFAULT 0,
    CONSTRAINT check_single_item_type CHECK ((((product_id IS NOT NULL) AND (course_id IS NULL)) OR ((product_id IS NULL) AND (course_id IS NOT NULL)) OR ((product_id IS NULL) AND (course_id IS NULL)))),
    CONSTRAINT quantity_positive CHECK ((quantity > 0))
);

ALTER TABLE ONLY public.order_items FORCE ROW LEVEL SECURITY;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_number character varying(50) NOT NULL,
    user_id uuid,
    status text DEFAULT 'pending'::text,
    total_amount numeric(10,2) NOT NULL,
    payment_method text,
    shipping_address jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes text,
    discount numeric(10,2) DEFAULT 0,
    tax numeric(10,2) DEFAULT 0,
    subtotal numeric(10,2) DEFAULT 0,
    total numeric(10,2) DEFAULT 0,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    invoice_url text,
    invoice_generated boolean DEFAULT false,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    customer_name text,
    customer_email text,
    customer_phone text,
    branch_id uuid,
    session_id text,
    payment_proof_url text,
    preference_id text,
    payment_id text,
    tracking_code text,
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['cart'::text, 'pending'::text, 'pending_payment'::text, 'awaiting_verification'::text, 'paid'::text, 'preparing'::text, 'shipped'::text, 'completed'::text, 'delivered'::text, 'cancelled'::text, 'refunded'::text, 'returned'::text])))
);

ALTER TABLE ONLY public.orders FORCE ROW LEVEL SECURITY;


--
-- Name: COLUMN orders.payment_proof_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.orders.payment_proof_url IS 'Public URL of transfer/payment proof uploaded at checkout';


--
-- Name: COLUMN orders.tracking_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.orders.tracking_code IS 'Shipment courier tracking number or dispatch tracking reference.';


--
-- Name: orders_order_number_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_number_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_order_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_number_seq OWNED BY public.orders.order_number;


--
-- Name: page_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    layout_type character varying(50),
    sections jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.page_templates FORCE ROW LEVEL SECURITY;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    page_type character varying(50) DEFAULT 'page'::character varying,
    status character varying(50) DEFAULT 'draft'::character varying,
    seo_title character varying(255),
    seo_description character varying(500),
    seo_keywords character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.pages FORCE ROW LEVEL SECURITY;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    order_id uuid,
    payment_id text NOT NULL,
    status text NOT NULL,
    status_detail text,
    payment_type_id text,
    payment_method_id text,
    transaction_amount numeric(10,2) NOT NULL,
    currency_id text DEFAULT 'ARS'::text,
    payer_email text,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ONLY public.payments FORCE ROW LEVEL SECURITY;


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_comments (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    post_id uuid,
    user_name character varying(100) NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    status character varying(20) DEFAULT 'approved'::character varying,
    tenant_id uuid
);

ALTER TABLE ONLY public.post_comments FORCE ROW LEVEL SECURITY;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
    image_url text NOT NULL,
    alt_text character varying,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.product_images FORCE ROW LEVEL SECURITY;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    product_id uuid NOT NULL,
    user_name text NOT NULL,
    comment text NOT NULL,
    rating integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

ALTER TABLE ONLY public.product_reviews FORCE ROW LEVEL SECURITY;


--
-- Name: product_stock_per_branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_stock_per_branch (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
    branch_id uuid,
    quantity integer DEFAULT 0,
    min_stock_alert integer DEFAULT 2,
    updated_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    CONSTRAINT product_stock_per_branch_quantity_check CHECK ((quantity >= 0))
);

ALTER TABLE ONLY public.product_stock_per_branch FORCE ROW LEVEL SECURITY;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
    tenant_id uuid,
    name character varying(255) NOT NULL,
    sku character varying(100),
    price numeric(12,2) DEFAULT 0.00,
    stock integer DEFAULT 0,
    attributes jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    barcode text,
    image_url text
);

ALTER TABLE ONLY public.product_variants FORCE ROW LEVEL SECURITY;


--
-- Name: purchase_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchase_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    purchase_id uuid,
    product_id uuid,
    quantity integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.purchase_items FORCE ROW LEVEL SECURITY;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid,
    date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    total_amount numeric(10,2) DEFAULT 0,
    status text DEFAULT 'completed'::text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    payment_method text DEFAULT 'cash'::text,
    branch_id uuid,
    CONSTRAINT purchases_status_check CHECK ((status = ANY (ARRAY['received'::text, 'ordered'::text, 'pending'::text, 'cancelled'::text, 'completed'::text])))
);

ALTER TABLE ONLY public.purchases FORCE ROW LEVEL SECURITY;


--
-- Name: repair_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    repair_id uuid,
    image_url text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.repair_images FORCE ROW LEVEL SECURITY;


--
-- Name: repair_number_sequences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_number_sequences (
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    last_value bigint DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.repair_number_sequences FORCE ROW LEVEL SECURITY;


--
-- Name: repair_parts_used; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_parts_used (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    repair_id uuid,
    product_id uuid,
    quantity integer DEFAULT 1,
    unit_price_at_time numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    cost_at_time numeric(12,2) DEFAULT 0 NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    unit_cost_at_time numeric DEFAULT 0
);

ALTER TABLE ONLY public.repair_parts_used FORCE ROW LEVEL SECURITY;


--
-- Name: repair_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    repair_id uuid NOT NULL,
    status_type_id integer NOT NULL,
    notes text,
    changed_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL
);

ALTER TABLE ONLY public.repair_status_history FORCE ROW LEVEL SECURITY;


--
-- Name: TABLE repair_status_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.repair_status_history IS 'Historial de cambios de estado de reparaciones';


--
-- Name: repair_status_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_status_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    color character varying(20) NOT NULL,
    icon character varying(50) NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.repair_status_types FORCE ROW LEVEL SECURITY;


--
-- Name: TABLE repair_status_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.repair_status_types IS 'Tipos de estados para reparaciones';


--
-- Name: repair_status_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.repair_status_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: repair_status_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.repair_status_types_id_seq OWNED BY public.repair_status_types.id;


--
-- Name: repair_tracking_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.repair_tracking_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: repairs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repairs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    issue_description text,
    estimated_cost numeric,
    final_cost numeric,
    technician_notes text,
    received_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone,
    current_status_id integer DEFAULT 1,
    whatsapp_notifications boolean DEFAULT true,
    tracking_code text DEFAULT ('AF-'::text || lpad((nextval('public.repair_tracking_seq'::regclass))::text, 3, '0'::text)),
    checklist jsonb DEFAULT '{}'::jsonb,
    security_pin text,
    security_pattern text,
    deposit_amount numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    repair_number integer,
    client_id uuid,
    technical_report text,
    device_id uuid,
    branch_id uuid,
    received_by uuid,
    assigned_technician_id uuid,
    technical_labor_cost numeric DEFAULT 0,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    glass_upsell boolean DEFAULT false,
    spare_part_cost numeric DEFAULT 0,
    warranty text,
    supplier_id uuid,
    CONSTRAINT check_repair_costs CHECK (((estimated_cost >= (0)::numeric) AND (final_cost >= (0)::numeric) AND (deposit_amount >= (0)::numeric))),
    CONSTRAINT repairs_estimated_cost_check CHECK ((estimated_cost >= (0)::numeric)),
    CONSTRAINT repairs_final_cost_check CHECK ((final_cost >= (0)::numeric)),
    CONSTRAINT repairs_tenant_id_check CHECK ((tenant_id IS NOT NULL))
);

ALTER TABLE ONLY public.repairs FORCE ROW LEVEL SECURITY;


--
-- Name: COLUMN repairs.current_status_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.repairs.current_status_id IS 'Estado actual de la reparación';


--
-- Name: COLUMN repairs.whatsapp_notifications; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.repairs.whatsapp_notifications IS 'Si el cliente quiere recibir notificaciones por WhatsApp';


--
-- Name: COLUMN repairs.tracking_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.repairs.tracking_code IS 'Código único para tracking público';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id text,
    permission text NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    description text
);


--
-- Name: safe_profiles_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.safe_profiles_view WITH (security_invoker='true') AS
 SELECT profiles.id,
    profiles.email,
    profiles.first_name,
    profiles.last_name,
    profiles.avatar_url,
    profiles.bio,
    profiles.phone,
    profiles.is_active,
    profiles.created_at,
    profiles.updated_at,
    profiles.role,
    profiles.address,
    profiles.dni,
    profiles.cuit_cuil,
    profiles.branch_id,
    profiles.tenant_id,
    profiles.deleted_at,
    profiles.is_guest
   FROM public.profiles;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(14) NOT NULL
);


--
-- Name: service_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_type character varying(20) NOT NULL,
    owner_id uuid NOT NULL,
    block_type character varying(40) NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tenant_id uuid,
    CONSTRAINT service_blocks_block_type_check CHECK (((block_type)::text = ANY ((ARRAY['hero'::character varying, 'features'::character varying, 'rich_text'::character varying, 'gallery'::character varying, 'cta'::character varying, 'faq'::character varying, 'testimonials'::character varying, 'contact'::character varying, 'map'::character varying, 'service_list'::character varying])::text[]))),
    CONSTRAINT service_blocks_owner_type_check CHECK (((owner_type)::text = ANY ((ARRAY['service'::character varying, 'post'::character varying])::text[])))
);


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    name character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    icon character varying(80),
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_id uuid NOT NULL,
    label character varying(120) NOT NULL,
    icon character varying(80),
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    tenant_id uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    service_id uuid,
    name character varying(120) NOT NULL,
    email character varying(160),
    phone character varying(40),
    message text NOT NULL,
    source character varying(50) DEFAULT 'landing_service'::character varying NOT NULL,
    utm_source character varying(80),
    utm_medium character varying(80),
    utm_campaign character varying(120),
    status character varying(20) DEFAULT 'new'::character varying NOT NULL,
    ip_hash character varying(64),
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contacted_at timestamp with time zone,
    CONSTRAINT service_leads_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'contacted'::character varying, 'quoted'::character varying, 'won'::character varying, 'lost'::character varying])::text[])))
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    slug text,
    description text,
    estimated_time text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    duration_minutes integer DEFAULT 0,
    price numeric(10,2) DEFAULT 0,
    category_id uuid,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    branch_id uuid,
    short_description character varying(280),
    long_description text,
    base_price numeric(12,2),
    price_currency character(3) DEFAULT 'ARS'::bpchar NOT NULL,
    icon character varying(80),
    is_quotable boolean DEFAULT true NOT NULL,
    is_bookable boolean DEFAULT false NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    template_slug character varying(50) DEFAULT 'landing-v1'::character varying NOT NULL,
    hero_image_url text,
    seo_title character varying(70),
    seo_description character varying(160),
    canonical_url text,
    og_image_url text,
    published_at timestamp with time zone,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_seo_desc_len CHECK (((seo_description IS NULL) OR (char_length((seo_description)::text) <= 160))),
    CONSTRAINT chk_seo_title_len CHECK (((seo_title IS NULL) OR (char_length((seo_title)::text) <= 70)))
);

ALTER TABLE ONLY public.services FORCE ROW LEVEL SECURITY;


--
-- Name: slug_redirects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slug_redirects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    entity_type character varying(20) NOT NULL,
    entity_id uuid NOT NULL,
    old_slug character varying(180) NOT NULL,
    new_slug character varying(180) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT slug_redirects_entity_type_check CHECK (((entity_type)::text = ANY ((ARRAY['service'::character varying, 'post'::character varying])::text[])))
);


--
-- Name: staff_orders_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.staff_orders_view WITH (security_invoker='on') AS
 SELECT o.id,
    o.order_number,
    o.tenant_id,
    o.user_id,
    o.status,
    o.total_amount,
    o.payment_method,
    o.created_at,
    o.updated_at
   FROM public.orders o
  WHERE ((o.tenant_id = public.get_my_tenant()) AND public.is_tenant_staff_or_above());


--
-- Name: stock_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    delta integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    reason text NOT NULL,
    order_id uuid,
    branch_id uuid,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ONLY public.stock_history FORCE ROW LEVEL SECURITY;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact_name text,
    email text,
    phone text,
    address text,
    tax_id text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type text,
    rubro text,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    branch_id uuid,
    CONSTRAINT suppliers_email_check CHECK (((email IS NULL) OR (email = ''::text) OR (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$'::text)))
);

ALTER TABLE ONLY public.suppliers FORCE ROW LEVEL SECURITY;


--
-- Name: technical_solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.technical_solutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT public.get_my_tenant() NOT NULL,
    title text NOT NULL,
    problem_description text NOT NULL,
    solution_steps text NOT NULL,
    tags text[],
    created_at timestamp with time zone DEFAULT now(),
    search_tsv tsvector GENERATED ALWAYS AS (((setweight(to_tsvector('spanish'::regconfig, COALESCE(title, ''::text)), 'A'::"char") || setweight(to_tsvector('spanish'::regconfig, COALESCE(problem_description, ''::text)), 'B'::"char")) || setweight(to_tsvector('spanish'::regconfig, COALESCE(solution_steps, ''::text)), 'C'::"char"))) STORED
);

ALTER TABLE ONLY public.technical_solutions FORCE ROW LEVEL SECURITY;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    plan_type text DEFAULT 'basic'::text,
    custom_domain text,
    branding_settings jsonb DEFAULT '{"logo_url": null, "favicon_url": null, "primary_color": "#3b82f6"}'::jsonb,
    owner_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    currency text DEFAULT 'ARS'::text,
    tax_percentage numeric DEFAULT 21,
    tax_abbreviation text DEFAULT 'IVA'::text,
    tax_id_name text DEFAULT 'CUIT/CUIL'::text,
    location text,
    contact_phone text,
    contact_email text,
    tax_id text,
    owner_name text,
    ml_access_token text,
    ml_refresh_token text,
    ml_user_id text,
    ml_markup_percentage numeric DEFAULT 5,
    ml_expires_in integer,
    ml_token_updated_at timestamp with time zone,
    whatsapp_access_token text,
    whatsapp_phone_id text,
    whatsapp_business_account_id text,
    whatsapp_enabled boolean DEFAULT false,
    CONSTRAINT tenants_plan_type_check CHECK ((plan_type = ANY (ARRAY['basic'::text, 'premium'::text, 'enterprise'::text])))
);

ALTER TABLE ONLY public.tenants FORCE ROW LEVEL SECURITY;


--
-- Name: COLUMN tenants.whatsapp_access_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tenants.whatsapp_access_token IS 'Token de acceso permanente de la API de Meta (WhatsApp)';


--
-- Name: COLUMN tenants.whatsapp_phone_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tenants.whatsapp_phone_id IS 'ID del número de teléfono remitente en WhatsApp API';


--
-- Name: COLUMN tenants.whatsapp_business_account_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tenants.whatsapp_business_account_id IS 'ID de la cuenta comercial de WhatsApp (WABA)';


--
-- Name: COLUMN tenants.whatsapp_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tenants.whatsapp_enabled IS 'Indica si el tenant tiene habilitada la integración de WhatsApp';


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role_id text,
    branch_id uuid,
    tenant_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.user_roles FORCE ROW LEVEL SECURITY;


--
-- Name: v_monthly_financials; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_monthly_financials WITH (security_invoker='true') AS
 SELECT r.tenant_id,
    r.branch_id,
    date_trunc('month'::text, COALESCE(r.completed_at, r.created_at)) AS month,
    sum(COALESCE(r.final_cost, r.estimated_cost, (0)::numeric)) AS total_repairs_revenue
   FROM public.repairs r
  WHERE (r.current_status_id = ANY (ARRAY[5, 6]))
  GROUP BY r.tenant_id, r.branch_id, (date_trunc('month'::text, COALESCE(r.completed_at, r.created_at)));


--
-- Name: v_unified_clients; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_unified_clients WITH (security_invoker='true') AS
 SELECT (p.id)::text AS id,
    p.tenant_id,
    p.branch_id,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    p.address,
    p.dni,
        CASE
            WHEN p.is_guest THEN 'repair'::text
            ELSE 'profile'::text
        END AS source,
    p.created_at,
    ( SELECT count(*) AS count
           FROM public.repairs r
          WHERE (r.client_id = p.id)) AS repair_count,
    ( SELECT count(*) AS count
           FROM public.orders o
          WHERE (o.user_id = p.id)) AS order_count
   FROM public.profiles p
  WHERE (((p.role = 'user'::text) OR (p.is_guest = true)) AND (p.deleted_at IS NULL))
UNION ALL
 SELECT ('guest_'::text || COALESCE(o.customer_email, o.customer_phone)) AS id,
    o.tenant_id,
    o.branch_id,
    split_part(max(o.customer_name), ' '::text, 1) AS first_name,
        CASE
            WHEN (POSITION((' '::text) IN (max(o.customer_name))) > 0) THEN SUBSTRING(max(o.customer_name) FROM (POSITION((' '::text) IN (max(o.customer_name))) + 1))
            ELSE NULL::text
        END AS last_name,
    o.customer_email AS email,
    o.customer_phone AS phone,
    NULL::text AS address,
    NULL::text AS dni,
    'order'::text AS source,
    min(o.created_at) AS created_at,
    0 AS repair_count,
    count(*) AS order_count
   FROM public.orders o
  WHERE ((o.user_id IS NULL) AND (o.deleted_at IS NULL) AND ((o.customer_email IS NOT NULL) OR (o.customer_phone IS NOT NULL)))
  GROUP BY o.tenant_id, o.branch_id, o.customer_email, o.customer_phone;


--
-- Name: view_products_inventory; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_products_inventory WITH (security_invoker='on') AS
 SELECT p.id AS product_id,
    p.name,
    p.sku,
    p.price,
    p.sale_price,
    ps.branch_id,
    ps.quantity AS stock,
    ps.min_stock_alert,
    b.name AS branch_name
   FROM ((public.products p
     LEFT JOIN public.product_stock_per_branch ps ON ((p.id = ps.product_id)))
     LEFT JOIN public.branches b ON ((ps.branch_id = b.id)));


--
-- Name: vw_cashflow_real; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vw_cashflow_real WITH (security_invoker='true') AS
 SELECT cm.tenant_id,
    cm.branch_id,
    ('Manual Cash '::text || COALESCE(cm.category, 'General'::text)) AS source,
        CASE
            WHEN (cm.type = 'income'::text) THEN cm.amount
            ELSE (0)::numeric
        END AS net_positive,
        CASE
            WHEN (cm.type = 'expense'::text) THEN cm.amount
            ELSE (0)::numeric
        END AS net_negative,
    cm.created_at AS date
   FROM public.cash_movements cm
UNION ALL
 SELECT r.tenant_id,
    r.branch_id,
    'Repair Profit'::text AS source,
    (COALESCE(r.final_cost, r.estimated_cost, (0)::numeric) - COALESCE(r.spare_part_cost, (0)::numeric)) AS net_positive,
    (0)::numeric AS net_negative,
    COALESCE(r.completed_at, r.created_at) AS date
   FROM public.repairs r
  WHERE (r.current_status_id = ANY (ARRAY[5, 6]))
UNION ALL
 SELECT o.tenant_id,
    o.branch_id,
    'Sale Profit'::text AS source,
    o.total_amount AS net_positive,
    (0)::numeric AS net_negative,
    o.created_at AS date
   FROM public.orders o
  WHERE (o.status = ANY (ARRAY['completed'::text, 'paid'::text, 'delivered'::text]));


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2026_09_27; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_09_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


--
-- Name: messages_2026_09_28; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_09_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


--
-- Name: messages_2026_09_29; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_09_29 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


--
-- Name: messages_2026_09_30; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_09_30 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


--
-- Name: messages_2026_10_01; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_10_01 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    skip_broadcast boolean DEFAULT false NOT NULL,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone DEFAULT now()
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL,
    versioning_status text DEFAULT 'DISABLED'::text NOT NULL,
    CONSTRAINT buckets_versioning_dark_check CHECK ((versioning_status = 'DISABLED'::text)),
    CONSTRAINT buckets_versioning_standard_only_check CHECK (((type = 'STANDARD'::storage.buckettype) OR (versioning_status = 'DISABLED'::text))),
    CONSTRAINT buckets_versioning_status_check CHECK ((versioning_status = ANY (ARRAY['DISABLED'::text, 'ENABLED'::text, 'SUSPENDED'::text])))
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    archived_at timestamp with time zone,
    is_delete_marker boolean DEFAULT false NOT NULL,
    is_versioned boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: -
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


--
-- Name: reports; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type text NOT NULL,
    status text DEFAULT 'PENDING'::text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    description text,
    media_urls text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: active_heatmap; Type: VIEW; Schema: zarx; Owner: -
--

CREATE VIEW zarx.active_heatmap AS
 SELECT reports.id,
    reports.latitude,
    reports.longitude,
    reports.type,
    3 AS danger_level,
    reports.created_at,
    (reports.created_at + '24:00:00'::interval) AS ttl_expires_at,
    (GREATEST((0)::numeric, (EXTRACT(epoch FROM ((reports.created_at + '24:00:00'::interval) - now())) / (3600)::numeric)))::numeric(5,2) AS hours_remaining,
    (1.0)::double precision AS intensity
   FROM zarx.reports
  WHERE (reports.status <> 'RESOLVED'::text);


--
-- Name: active_news; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.active_news (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text,
    content text,
    image_url text,
    category text,
    is_active boolean DEFAULT true,
    published_at timestamp with time zone DEFAULT now(),
    type text DEFAULT 'INFO'::text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: active_tracking_sessions; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.active_tracking_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: emergencies; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.emergencies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type text DEFAULT 'SOS'::text,
    status text DEFAULT 'ACTIVE'::text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: emergency_tracking; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.emergency_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    emergency_id uuid,
    user_id uuid,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    accuracy double precision,
    speed double precision,
    heading double precision,
    "timestamp" timestamp with time zone DEFAULT now()
);


--
-- Name: hourly_risk_stats; Type: VIEW; Schema: zarx; Owner: -
--

CREATE VIEW zarx.hourly_risk_stats AS
 SELECT (EXTRACT(hour FROM reports.created_at))::integer AS hour_of_day,
    reports.type,
    (count(*))::integer AS count
   FROM zarx.reports
  GROUP BY ((EXTRACT(hour FROM reports.created_at))::integer), reports.type;


--
-- Name: notifications; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    body text NOT NULL,
    data jsonb,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.profiles (
    id uuid NOT NULL,
    username text,
    full_name text,
    avatar_url text,
    phone text,
    dni text,
    role text DEFAULT 'citizen'::text,
    reputation_score integer DEFAULT 100,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    email text,
    rank text DEFAULT 'Cadete'::text,
    display_id text,
    is_shadowbanned boolean DEFAULT false
);


--
-- Name: public_alerts; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.public_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    severity text NOT NULL,
    description text,
    latitude double precision,
    longitude double precision,
    radius_meters double precision,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reputation_history; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.reputation_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    points integer NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: zones; Type: TABLE; Schema: zarx; Owner: -
--

CREATE TABLE zarx.zones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text,
    risk_level text DEFAULT 'LOW'::text,
    coordinates jsonb,
    created_at timestamp with time zone DEFAULT now(),
    geom jsonb
);


--
-- Name: messages_2026_09_27; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_09_27 FOR VALUES FROM ('2026-09-27 00:00:00') TO ('2026-09-28 00:00:00');


--
-- Name: messages_2026_09_28; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_09_28 FOR VALUES FROM ('2026-09-28 00:00:00') TO ('2026-09-29 00:00:00');


--
-- Name: messages_2026_09_29; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_09_29 FOR VALUES FROM ('2026-09-29 00:00:00') TO ('2026-09-30 00:00:00');


--
-- Name: messages_2026_09_30; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_09_30 FOR VALUES FROM ('2026-09-30 00:00:00') TO ('2026-10-01 00:00:00');


--
-- Name: messages_2026_10_01; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_10_01 FOR VALUES FROM ('2026-10-01 00:00:00') TO ('2026-10-02 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: repair_status_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_types ALTER COLUMN id SET DEFAULT nextval('public.repair_status_types_id_seq'::regclass);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_phone_key UNIQUE (phone);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: academy_email_notifications academy_email_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_email_notifications
    ADD CONSTRAINT academy_email_notifications_pkey PRIMARY KEY (id);


--
-- Name: academy_payments academy_payments_mp_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_mp_payment_id_key UNIQUE (mp_payment_id);


--
-- Name: academy_payments academy_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_pkey PRIMARY KEY (id);


--
-- Name: academy_plans academy_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_plans
    ADD CONSTRAINT academy_plans_pkey PRIMARY KEY (id);


--
-- Name: academy_plans academy_plans_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_plans
    ADD CONSTRAINT academy_plans_slug_key UNIQUE (slug);


--
-- Name: academy_subscriptions academy_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_subscriptions
    ADD CONSTRAINT academy_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (key);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: auth_logs auth_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT auth_logs_pkey PRIMARY KEY (id);


--
-- Name: bank_reconciliations bank_recon_tenant_id_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_recon_tenant_id_transaction_id_key UNIQUE (tenant_id, transaction_id);


--
-- Name: bank_reconciliations bank_reconciliations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_post_tags blog_post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT blog_post_tags_pkey PRIMARY KEY (post_id, tag_id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_tags blog_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: branches branches_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_slug_unique UNIQUE (slug);


--
-- Name: branches branches_tenant_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_tenant_id_slug_key UNIQUE (tenant_id, slug);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cash_movements cash_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: cola_tiktok cola_tiktok_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cola_tiktok
    ADD CONSTRAINT cola_tiktok_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: course_certificates course_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_exam_questions course_exam_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_questions
    ADD CONSTRAINT course_exam_questions_pkey PRIMARY KEY (id);


--
-- Name: course_exam_submissions course_exam_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_submissions
    ADD CONSTRAINT course_exam_submissions_pkey PRIMARY KEY (id);


--
-- Name: course_instructors course_instructors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT course_instructors_pkey PRIMARY KEY (course_id, instructor_id);


--
-- Name: course_lessons course_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_lessons_pkey PRIMARY KEY (id);


--
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- Name: course_progress course_progress_email_content_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_email_content_id_key UNIQUE (email, content_id);


--
-- Name: course_progress course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: customer_devices customer_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_devices
    ADD CONSTRAINT customer_devices_pkey PRIMARY KEY (id);


--
-- Name: educacion_y_skills educacion_y_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.educacion_y_skills
    ADD CONSTRAINT educacion_y_skills_pkey PRIMARY KEY (id);


--
-- Name: experiencia_laboral experiencia_laboral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiencia_laboral
    ADD CONSTRAINT experiencia_laboral_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base knowledge_base_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base
    ADD CONSTRAINT knowledge_base_pkey PRIMARY KEY (id);


--
-- Name: models models_brand_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_brand_id_slug_key UNIQUE (brand_id, slug);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: page_templates page_templates_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_templates
    ADD CONSTRAINT page_templates_name_key UNIQUE (name);


--
-- Name: page_templates page_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_templates
    ADD CONSTRAINT page_templates_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_stock_per_branch product_stock_per_branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT product_stock_per_branch_pkey PRIMARY KEY (id);


--
-- Name: product_stock_per_branch product_stock_per_branch_product_id_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT product_stock_per_branch_product_id_branch_id_key UNIQUE (product_id, branch_id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: purchase_items purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: repair_images repair_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_images
    ADD CONSTRAINT repair_images_pkey PRIMARY KEY (id);


--
-- Name: repair_number_sequences repair_number_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_number_sequences
    ADD CONSTRAINT repair_number_sequences_pkey PRIMARY KEY (tenant_id);


--
-- Name: repair_parts_used repair_parts_used_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_parts_used
    ADD CONSTRAINT repair_parts_used_pkey PRIMARY KEY (id);


--
-- Name: repair_status_history repair_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_history
    ADD CONSTRAINT repair_status_history_pkey PRIMARY KEY (id);


--
-- Name: repair_status_types repair_status_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_types
    ADD CONSTRAINT repair_status_types_name_key UNIQUE (name);


--
-- Name: repair_status_types repair_status_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_types
    ADD CONSTRAINT repair_status_types_pkey PRIMARY KEY (id);


--
-- Name: repairs repairs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_pkey PRIMARY KEY (id);


--
-- Name: repairs repairs_tracking_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_tracking_code_unique UNIQUE (tracking_code);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_key UNIQUE (role_id, permission);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: service_blocks service_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_blocks
    ADD CONSTRAINT service_blocks_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_features service_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features
    ADD CONSTRAINT service_features_pkey PRIMARY KEY (id);


--
-- Name: service_leads service_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_leads
    ADD CONSTRAINT service_leads_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: slug_redirects slug_redirects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slug_redirects
    ADD CONSTRAINT slug_redirects_pkey PRIMARY KEY (id);


--
-- Name: stock_history stock_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_history
    ADD CONSTRAINT stock_history_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: technical_solutions technical_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.technical_solutions
    ADD CONSTRAINT technical_solutions_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_custom_domain_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_custom_domain_key UNIQUE (custom_domain);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: product_stock_per_branch unq_stock_branch_product; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT unq_stock_branch_product UNIQUE (branch_id, product_id);


--
-- Name: payments uq_payments_payment_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT uq_payments_payment_id UNIQUE (payment_id);


--
-- Name: service_categories uq_service_cat_tenant_slug; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT uq_service_cat_tenant_slug UNIQUE (tenant_id, slug);


--
-- Name: slug_redirects uq_slug_redirect_old; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slug_redirects
    ADD CONSTRAINT uq_slug_redirect_old UNIQUE (tenant_id, entity_type, old_slug);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_branch_id_key UNIQUE (user_id, role_id, branch_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_09_27 messages_2026_09_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_09_27
    ADD CONSTRAINT messages_2026_09_27_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_09_28 messages_2026_09_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_09_28
    ADD CONSTRAINT messages_2026_09_28_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_09_29 messages_2026_09_29_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_09_29
    ADD CONSTRAINT messages_2026_09_29_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_09_30 messages_2026_09_30_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_09_30
    ADD CONSTRAINT messages_2026_09_30_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_10_01 messages_2026_10_01_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_10_01
    ADD CONSTRAINT messages_2026_10_01_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: active_news active_news_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.active_news
    ADD CONSTRAINT active_news_pkey PRIMARY KEY (id);


--
-- Name: active_tracking_sessions active_tracking_sessions_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.active_tracking_sessions
    ADD CONSTRAINT active_tracking_sessions_pkey PRIMARY KEY (id);


--
-- Name: emergencies emergencies_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.emergencies
    ADD CONSTRAINT emergencies_pkey PRIMARY KEY (id);


--
-- Name: emergency_tracking emergency_tracking_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.emergency_tracking
    ADD CONSTRAINT emergency_tracking_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: public_alerts public_alerts_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.public_alerts
    ADD CONSTRAINT public_alerts_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: reputation_history reputation_history_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.reputation_history
    ADD CONSTRAINT reputation_history_pkey PRIMARY KEY (id);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: feature_flags_name_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX feature_flags_name_index ON _realtime.feature_flags USING btree (name);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: idx_academy_notifications_ref; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academy_notifications_ref ON public.academy_email_notifications USING btree (notification_type, reference_id);


--
-- Name: idx_academy_payments_sub; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academy_payments_sub ON public.academy_payments USING btree (subscription_id);


--
-- Name: idx_academy_payments_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academy_payments_user ON public.academy_payments USING btree (user_id);


--
-- Name: idx_academy_subscriptions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academy_subscriptions_status ON public.academy_subscriptions USING btree (status);


--
-- Name: idx_academy_subscriptions_user_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_academy_subscriptions_user_unique ON public.academy_subscriptions USING btree (user_id);


--
-- Name: idx_audit_logs_changed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_changed_by ON public.audit_logs USING btree (changed_by);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (tenant_id, table_name, record_id);


--
-- Name: idx_audit_logs_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_tenant_id ON public.audit_logs USING btree (tenant_id);


--
-- Name: idx_auth_logs_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_logs_tenant_id ON public.auth_logs USING btree (tenant_id);


--
-- Name: idx_auth_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_logs_user_id ON public.auth_logs USING btree (user_id);


--
-- Name: idx_bank_recon_unmatched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bank_recon_unmatched ON public.bank_reconciliations USING btree (tenant_id) WHERE (status = 'unmatched'::text);


--
-- Name: idx_bank_reconciliations_matched_invoice_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bank_reconciliations_matched_invoice_id ON public.bank_reconciliations USING btree (matched_invoice_id);


--
-- Name: idx_bank_reconciliations_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bank_reconciliations_tenant_id ON public.bank_reconciliations USING btree (tenant_id);


--
-- Name: idx_blog_cat_tenant_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_blog_cat_tenant_slug ON public.blog_categories USING btree (tenant_id, slug);


--
-- Name: idx_blog_post_tags_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_post_tags_tag_id ON public.blog_post_tags USING btree (tag_id);


--
-- Name: idx_blog_post_tags_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_post_tags_tenant_id ON public.blog_post_tags USING btree (tenant_id);


--
-- Name: idx_blog_posts_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_category_id ON public.blog_posts USING btree (category_id);


--
-- Name: idx_blog_posts_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);


--
-- Name: idx_blog_posts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_status ON public.blog_posts USING btree (status);


--
-- Name: idx_blog_posts_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_tenant_id ON public.blog_posts USING btree (tenant_id);


--
-- Name: idx_blog_tag_tenant_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_blog_tag_tenant_slug ON public.blog_tags USING btree (tenant_id, slug);


--
-- Name: idx_blog_tags_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_tags_tenant_id ON public.blog_tags USING btree (tenant_id);


--
-- Name: idx_branches_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_branches_tenant_id ON public.branches USING btree (tenant_id);


--
-- Name: idx_cash_movements_branch_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_branch_date ON public.cash_movements USING btree (branch_id, created_at);


--
-- Name: idx_cash_movements_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_branch_id ON public.cash_movements USING btree (branch_id);


--
-- Name: idx_cash_movements_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_created_by ON public.cash_movements USING btree (created_by);


--
-- Name: idx_cash_movements_tenant_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_tenant_branch ON public.cash_movements USING btree (tenant_id, branch_id);


--
-- Name: idx_cash_movements_tenant_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_tenant_date ON public.cash_movements USING btree (tenant_id, branch_id, created_at);


--
-- Name: idx_cash_movements_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cash_movements_tenant_id ON public.cash_movements USING btree (tenant_id);


--
-- Name: idx_categories_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_parent_id ON public.categories USING btree (parent_id);


--
-- Name: idx_categories_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_tenant_id ON public.categories USING btree (tenant_id);


--
-- Name: idx_clients_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_phone ON public.profiles USING btree (phone);


--
-- Name: idx_cola_tiktok_estado_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cola_tiktok_estado_fecha ON public.cola_tiktok USING btree (estado, fecha_creacion);


--
-- Name: idx_contact_messages_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_messages_branch_id ON public.contact_messages USING btree (branch_id);


--
-- Name: idx_contact_messages_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_messages_tenant_id ON public.contact_messages USING btree (tenant_id);


--
-- Name: idx_course_certificates_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_certificates_course_id ON public.course_certificates USING btree (course_id);


--
-- Name: idx_course_certificates_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_certificates_email ON public.course_certificates USING btree (email);


--
-- Name: idx_course_certificates_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_certificates_status ON public.course_certificates USING btree (status);


--
-- Name: idx_course_certificates_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_certificates_user_id ON public.course_certificates USING btree (user_id);


--
-- Name: idx_course_enrollments_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments USING btree (course_id);


--
-- Name: idx_course_enrollments_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_enrollments_tenant_id ON public.course_enrollments USING btree (tenant_id);


--
-- Name: idx_course_enrollments_unique_course_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_course_enrollments_unique_course_email ON public.course_enrollments USING btree (course_id, lower(email));


--
-- Name: idx_course_exam_questions_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_exam_questions_content_id ON public.course_exam_questions USING btree (content_id);


--
-- Name: idx_course_exam_submissions_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_exam_submissions_content_id ON public.course_exam_submissions USING btree (content_id);


--
-- Name: idx_course_exam_submissions_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_exam_submissions_email ON public.course_exam_submissions USING btree (email);


--
-- Name: idx_course_instructors_instructor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_instructors_instructor ON public.course_instructors USING btree (instructor_id);


--
-- Name: idx_course_lessons_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_lessons_module_id ON public.course_lessons USING btree (module_id);


--
-- Name: idx_course_modules_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_modules_course_id ON public.course_modules USING btree (course_id);


--
-- Name: idx_course_modules_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_modules_tenant_id ON public.course_modules USING btree (tenant_id);


--
-- Name: idx_course_modules_unlock_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_modules_unlock_date ON public.course_modules USING btree (unlock_date) WHERE (unlock_date IS NOT NULL);


--
-- Name: idx_course_progress_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_progress_course_id ON public.course_progress USING btree (course_id);


--
-- Name: idx_course_progress_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_progress_email ON public.course_progress USING btree (email);


--
-- Name: idx_courses_instructor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_instructor_id ON public.courses USING btree (instructor_id);


--
-- Name: idx_courses_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_slug ON public.courses USING btree (slug);


--
-- Name: idx_courses_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_tenant_id ON public.courses USING btree (tenant_id);


--
-- Name: idx_customer_devices_imei; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_devices_imei ON public.customer_devices USING btree (imei);


--
-- Name: idx_customer_devices_model_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_devices_model_id ON public.customer_devices USING btree (model_id);


--
-- Name: idx_customer_devices_serial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_devices_serial ON public.customer_devices USING btree (serial_number);


--
-- Name: idx_customer_devices_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_devices_tenant_id ON public.customer_devices USING btree (tenant_id);


--
-- Name: idx_customer_devices_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_devices_user_id ON public.customer_devices USING btree (user_id);


--
-- Name: idx_fk_academy_email_notifications_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_email_notifications_tenant_id ON public.academy_email_notifications USING btree (tenant_id);


--
-- Name: idx_fk_academy_email_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_email_notifications_user_id ON public.academy_email_notifications USING btree (user_id);


--
-- Name: idx_fk_academy_payments_plan_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_payments_plan_id ON public.academy_payments USING btree (plan_id);


--
-- Name: idx_fk_academy_payments_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_payments_tenant_id ON public.academy_payments USING btree (tenant_id);


--
-- Name: idx_fk_academy_plans_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_plans_tenant_id ON public.academy_plans USING btree (tenant_id);


--
-- Name: idx_fk_academy_subscriptions_plan_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_subscriptions_plan_id ON public.academy_subscriptions USING btree (plan_id);


--
-- Name: idx_fk_academy_subscriptions_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_academy_subscriptions_tenant_id ON public.academy_subscriptions USING btree (tenant_id);


--
-- Name: idx_fk_blog_posts_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_blog_posts_author_id ON public.blog_posts USING btree (author_id);


--
-- Name: idx_fk_brands_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_brands_branch_id ON public.brands USING btree (branch_id);


--
-- Name: idx_fk_categories_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_categories_branch_id ON public.categories USING btree (branch_id);


--
-- Name: idx_fk_course_certificates_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_certificates_tenant_id ON public.course_certificates USING btree (tenant_id);


--
-- Name: idx_fk_course_exam_questions_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_exam_questions_tenant_id ON public.course_exam_questions USING btree (tenant_id);


--
-- Name: idx_fk_course_exam_submissions_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_exam_submissions_tenant_id ON public.course_exam_submissions USING btree (tenant_id);


--
-- Name: idx_fk_course_lessons_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_lessons_tenant_id ON public.course_lessons USING btree (tenant_id);


--
-- Name: idx_fk_course_progress_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_progress_content_id ON public.course_progress USING btree (content_id);


--
-- Name: idx_fk_course_progress_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_course_progress_tenant_id ON public.course_progress USING btree (tenant_id);


--
-- Name: idx_fk_post_comments_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_post_comments_post_id ON public.post_comments USING btree (post_id);


--
-- Name: idx_fk_post_comments_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_post_comments_tenant_id ON public.post_comments USING btree (tenant_id);


--
-- Name: idx_fk_products_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_products_branch_id ON public.products USING btree (branch_id);


--
-- Name: idx_fk_repairs_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_repairs_supplier_id ON public.repairs USING btree (supplier_id);


--
-- Name: idx_fk_service_blocks_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_service_blocks_tenant_id ON public.service_blocks USING btree (tenant_id);


--
-- Name: idx_fk_service_features_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_service_features_tenant_id ON public.service_features USING btree (tenant_id);


--
-- Name: idx_fk_service_leads_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_service_leads_tenant_id ON public.service_leads USING btree (tenant_id);


--
-- Name: idx_fk_services_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_services_branch_id ON public.services USING btree (branch_id);


--
-- Name: idx_fk_stock_history_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_stock_history_branch_id ON public.stock_history USING btree (branch_id);


--
-- Name: idx_fk_stock_history_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_stock_history_created_by ON public.stock_history USING btree (created_by);


--
-- Name: idx_fk_suppliers_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_suppliers_branch_id ON public.suppliers USING btree (branch_id);


--
-- Name: idx_fk_user_roles_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_user_roles_branch_id ON public.user_roles USING btree (branch_id);


--
-- Name: idx_fk_user_roles_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: idx_fk_user_roles_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fk_user_roles_tenant_id ON public.user_roles USING btree (tenant_id);


--
-- Name: idx_invoices_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_customer_id ON public.invoices USING btree (customer_id);


--
-- Name: idx_invoices_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_number ON public.invoices USING btree (tenant_id, invoice_number);


--
-- Name: idx_invoices_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_order_id ON public.invoices USING btree (order_id);


--
-- Name: idx_invoices_repair_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_repair_id ON public.invoices USING btree (repair_id);


--
-- Name: idx_invoices_repair_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_repair_order_id ON public.invoices USING btree (tenant_id, repair_order_id);


--
-- Name: idx_invoices_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_status ON public.invoices USING btree (tenant_id, status);


--
-- Name: idx_invoices_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_tenant_id ON public.invoices USING btree (tenant_id);


--
-- Name: idx_invoices_tenant_issued; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_tenant_issued ON public.invoices USING btree (tenant_id, issued_at);


--
-- Name: idx_invoices_tenant_repair; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_invoices_tenant_repair ON public.invoices USING btree (tenant_id, repair_id);


--
-- Name: idx_kb_embedding_hnsw; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kb_embedding_hnsw ON public.knowledge_base USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_kb_metadata; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kb_metadata ON public.knowledge_base USING gin (metadata);


--
-- Name: idx_kb_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kb_source_id ON public.knowledge_base USING btree (source_id) WHERE (source_id IS NOT NULL);


--
-- Name: idx_kb_tenant_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kb_tenant_source ON public.knowledge_base USING btree (tenant_id, source_type);


--
-- Name: idx_notifications_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_branch_id ON public.notifications USING btree (branch_id);


--
-- Name: idx_notifications_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_tenant_id ON public.notifications USING btree (tenant_id);


--
-- Name: idx_notifications_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (user_id) WHERE (is_read = false);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_order_items_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_course_id ON public.order_items USING btree (course_id);


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_product_id ON public.order_items USING btree (product_id);


--
-- Name: idx_order_items_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_tenant_id ON public.order_items USING btree (tenant_id);


--
-- Name: idx_orders_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_branch_id ON public.orders USING btree (branch_id);


--
-- Name: idx_orders_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_payment_id ON public.orders USING btree (payment_id);


--
-- Name: idx_orders_preference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_preference_id ON public.orders USING btree (preference_id);


--
-- Name: idx_orders_session_status_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_session_status_created ON public.orders USING btree (session_id, status, created_at DESC) WHERE (deleted_at IS NULL);


--
-- Name: idx_orders_status_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status_tenant ON public.orders USING btree (tenant_id, status);


--
-- Name: idx_orders_tenant_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tenant_branch ON public.orders USING btree (tenant_id, branch_id);


--
-- Name: idx_orders_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tenant_id ON public.orders USING btree (tenant_id);


--
-- Name: idx_orders_tenant_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tenant_user ON public.orders USING btree (tenant_id, user_id);


--
-- Name: idx_orders_tracking_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tracking_code ON public.orders USING btree (tracking_code);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_page_templates_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_templates_tenant_id ON public.page_templates USING btree (tenant_id);


--
-- Name: idx_pages_active_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pages_active_slug ON public.pages USING btree (tenant_id, slug) WHERE ((status)::text = 'published'::text);


--
-- Name: idx_pages_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pages_tenant_id ON public.pages USING btree (tenant_id);


--
-- Name: idx_payments_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_payments_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_tenant_id ON public.payments USING btree (tenant_id);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_product_images_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_tenant_id ON public.product_images USING btree (tenant_id);


--
-- Name: idx_product_reviews_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_reviews_product_id ON public.product_reviews USING btree (product_id);


--
-- Name: idx_product_reviews_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_reviews_tenant_id ON public.product_reviews USING btree (tenant_id);


--
-- Name: idx_product_stock_branch_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_stock_branch_tenant_id ON public.product_stock_per_branch USING btree (tenant_id);


--
-- Name: idx_product_stock_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_stock_product_id ON public.product_stock_per_branch USING btree (product_id);


--
-- Name: idx_product_variants_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);


--
-- Name: idx_product_variants_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_variants_tenant_id ON public.product_variants USING btree (tenant_id);


--
-- Name: idx_products_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_brand_id ON public.products USING btree (brand_id);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- Name: idx_products_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_deleted_at ON public.products USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: idx_products_model_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_model_id ON public.products USING btree (model_id);


--
-- Name: idx_products_not_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_not_deleted ON public.products USING btree (tenant_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_products_search_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_search_name ON public.products USING btree (tenant_id, name);


--
-- Name: idx_products_search_tsv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_search_tsv ON public.products USING gin (search_tsv);


--
-- Name: idx_products_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_sku ON public.products USING btree (tenant_id, sku);


--
-- Name: idx_products_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_slug ON public.products USING btree (slug);


--
-- Name: idx_products_tenant_active_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_active_created ON public.products USING btree (tenant_id, is_active, created_at DESC) WHERE (deleted_at IS NULL);


--
-- Name: idx_products_tenant_active_deleted_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_active_deleted_created ON public.products USING btree (tenant_id, is_active, deleted_at, created_at DESC) WHERE (deleted_at IS NULL);


--
-- Name: idx_products_tenant_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_category ON public.products USING btree (tenant_id, category_id);


--
-- Name: idx_products_tenant_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_deleted ON public.products USING btree (tenant_id, deleted_at);


--
-- Name: idx_products_tenant_deleted_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_deleted_created ON public.products USING btree (tenant_id, deleted_at, created_at DESC);


--
-- Name: idx_products_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_id ON public.products USING btree (tenant_id);


--
-- Name: idx_products_tenant_perf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_perf ON public.products USING btree (tenant_id, is_active);


--
-- Name: idx_profiles_auth_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_auth_composite ON public.profiles USING btree (id, tenant_id, role, branch_id);


--
-- Name: idx_profiles_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_branch_id ON public.profiles USING btree (branch_id);


--
-- Name: idx_profiles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);


--
-- Name: idx_profiles_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_tenant_id ON public.profiles USING btree (tenant_id);


--
-- Name: idx_purchase_items_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_items_product_id ON public.purchase_items USING btree (product_id);


--
-- Name: idx_purchase_items_purchase_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_items_purchase_id ON public.purchase_items USING btree (purchase_id);


--
-- Name: idx_purchase_items_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_items_tenant_id ON public.purchase_items USING btree (tenant_id);


--
-- Name: idx_purchases_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchases_branch_id ON public.purchases USING btree (branch_id);


--
-- Name: idx_purchases_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchases_supplier_id ON public.purchases USING btree (supplier_id);


--
-- Name: idx_purchases_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchases_tenant_id ON public.purchases USING btree (tenant_id);


--
-- Name: idx_repair_images_repair_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_images_repair_id ON public.repair_images USING btree (repair_id);


--
-- Name: idx_repair_images_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_images_tenant_id ON public.repair_images USING btree (tenant_id);


--
-- Name: idx_repair_parts_repair_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_parts_repair_id ON public.repair_parts_used USING btree (repair_id);


--
-- Name: idx_repair_parts_used_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_parts_used_product_id ON public.repair_parts_used USING btree (product_id);


--
-- Name: idx_repair_parts_used_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_parts_used_tenant_id ON public.repair_parts_used USING btree (tenant_id);


--
-- Name: idx_repair_status_history_changed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_status_history_changed_by ON public.repair_status_history USING btree (changed_by);


--
-- Name: idx_repair_status_history_repair; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_status_history_repair ON public.repair_status_history USING btree (repair_id);


--
-- Name: idx_repair_status_history_status_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_status_history_status_type_id ON public.repair_status_history USING btree (status_type_id);


--
-- Name: idx_repair_status_history_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_status_history_tenant_id ON public.repair_status_history USING btree (tenant_id);


--
-- Name: idx_repairs_assigned_technician_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_assigned_technician_id ON public.repairs USING btree (assigned_technician_id);


--
-- Name: idx_repairs_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_branch_id ON public.repairs USING btree (branch_id);


--
-- Name: idx_repairs_branch_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_branch_status ON public.repairs USING btree (branch_id, current_status_id);


--
-- Name: idx_repairs_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_client_id ON public.repairs USING btree (client_id);


--
-- Name: idx_repairs_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_deleted_at ON public.repairs USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: idx_repairs_device_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_device_id ON public.repairs USING btree (device_id);


--
-- Name: idx_repairs_not_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_not_deleted ON public.repairs USING btree (tenant_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_repairs_received_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_received_by ON public.repairs USING btree (received_by);


--
-- Name: idx_repairs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_status ON public.repairs USING btree (current_status_id);


--
-- Name: idx_repairs_tenant_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_tenant_branch ON public.repairs USING btree (tenant_id, branch_id);


--
-- Name: idx_repairs_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_tenant_id ON public.repairs USING btree (tenant_id);


--
-- Name: idx_repairs_tenant_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repairs_tenant_status ON public.repairs USING btree (tenant_id, current_status_id);


--
-- Name: idx_service_blocks_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_blocks_owner ON public.service_blocks USING btree (owner_type, owner_id, order_index);


--
-- Name: idx_service_features_service_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_features_service_id ON public.service_features USING btree (service_id, order_index);


--
-- Name: idx_service_leads_service_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_leads_service_id ON public.service_leads USING btree (service_id);


--
-- Name: idx_service_leads_status_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_leads_status_created ON public.service_leads USING btree (status, created_at DESC);


--
-- Name: idx_services_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_category_id ON public.services USING btree (category_id);


--
-- Name: idx_stock_available; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_available ON public.product_stock_per_branch USING btree (branch_id, product_id) WHERE (quantity > 0);


--
-- Name: idx_stock_branch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_branch_id ON public.product_stock_per_branch USING btree (branch_id);


--
-- Name: idx_stock_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_history_created_at ON public.stock_history USING btree (created_at DESC);


--
-- Name: idx_stock_history_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_history_order_id ON public.stock_history USING btree (order_id);


--
-- Name: idx_stock_history_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_history_product_id ON public.stock_history USING btree (product_id);


--
-- Name: idx_stock_history_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_history_tenant_id ON public.stock_history USING btree (tenant_id);


--
-- Name: idx_stock_tenant_branch_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_tenant_branch_product ON public.product_stock_per_branch USING btree (tenant_id, branch_id, product_id);


--
-- Name: idx_suppliers_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suppliers_tenant_id ON public.suppliers USING btree (tenant_id);


--
-- Name: idx_technical_solutions_search_tsv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_technical_solutions_search_tsv ON public.technical_solutions USING gin (search_tsv);


--
-- Name: idx_technical_solutions_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_technical_solutions_tenant_id ON public.technical_solutions USING btree (tenant_id);


--
-- Name: idx_tenants_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tenants_owner_id ON public.tenants USING btree (owner_id);


--
-- Name: idx_unique_brand_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_brand_slug_per_tenant ON public.brands USING btree (tenant_id, slug);


--
-- Name: idx_unique_category_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_category_slug_per_tenant ON public.categories USING btree (tenant_id, slug);


--
-- Name: idx_unique_course_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_course_slug_per_tenant ON public.courses USING btree (tenant_id, slug);


--
-- Name: idx_unique_model_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_model_slug_per_tenant ON public.models USING btree (tenant_id, slug);


--
-- Name: idx_unique_page_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_page_slug_per_tenant ON public.pages USING btree (tenant_id, slug);


--
-- Name: idx_unique_post_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_post_slug_per_tenant ON public.blog_posts USING btree (tenant_id, slug);


--
-- Name: idx_unique_product_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_product_slug_per_tenant ON public.products USING btree (tenant_id, slug);


--
-- Name: idx_unique_service_slug_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_service_slug_per_tenant ON public.services USING btree (tenant_id, slug);


--
-- Name: services_slug_uniq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX services_slug_uniq ON public.services USING btree (slug) WHERE ((slug IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_09_27_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_09_27_inserted_at_topic_idx ON realtime.messages_2026_09_27 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_09_28_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_09_28_inserted_at_topic_idx ON realtime.messages_2026_09_28 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_09_29_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_09_29_inserted_at_topic_idx ON realtime.messages_2026_09_29 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_09_30_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_09_30_inserted_at_topic_idx ON realtime.messages_2026_09_30 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_10_01_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_10_01_inserted_at_topic_idx ON realtime.messages_2026_10_01 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: idx_fk_zarx_reports_user_id; Type: INDEX; Schema: zarx; Owner: -
--

CREATE INDEX idx_fk_zarx_reports_user_id ON zarx.reports USING btree (user_id);


--
-- Name: messages_2026_09_27_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_09_27_inserted_at_topic_idx;


--
-- Name: messages_2026_09_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_09_27_pkey;


--
-- Name: messages_2026_09_28_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_09_28_inserted_at_topic_idx;


--
-- Name: messages_2026_09_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_09_28_pkey;


--
-- Name: messages_2026_09_29_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_09_29_inserted_at_topic_idx;


--
-- Name: messages_2026_09_29_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_09_29_pkey;


--
-- Name: messages_2026_09_30_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_09_30_inserted_at_topic_idx;


--
-- Name: messages_2026_09_30_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_09_30_pkey;


--
-- Name: messages_2026_10_01_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_10_01_inserted_at_topic_idx;


--
-- Name: messages_2026_10_01_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_10_01_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: users on_auth_user_created_zarx; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created_zarx AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION zarx.handle_new_user();


--
-- Name: order_items enforce_retail_price_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_retail_price_trigger BEFORE INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.enforce_retail_price_for_guests();


--
-- Name: orders on_order_completed; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_order_completed AFTER UPDATE ON public.orders FOR EACH ROW WHEN (((old.status IS DISTINCT FROM new.status) AND (new.status = 'COMPLETADO'::text))) EXECUTE FUNCTION public.trigger_process_completed_order();


--
-- Name: profiles protect_profile_columns_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER protect_profile_columns_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_sensitive_profile_columns();


--
-- Name: repairs set_tracking_code_before_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_tracking_code_before_insert BEFORE INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.fn_assign_tracking_code();


--
-- Name: branches tr_isolation_branches; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_branches BEFORE INSERT OR UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: cash_movements tr_isolation_cash_movements; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_cash_movements BEFORE INSERT OR UPDATE ON public.cash_movements FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: invoices tr_isolation_invoices; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_invoices BEFORE INSERT OR UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: orders tr_isolation_orders; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_orders BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: products tr_isolation_products; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_products BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: profiles tr_isolation_profiles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_profiles BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: purchases tr_isolation_purchases; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_purchases BEFORE INSERT OR UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: repairs tr_isolation_repairs; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_repairs BEFORE INSERT OR UPDATE ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: suppliers tr_isolation_suppliers; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_isolation_suppliers BEFORE INSERT OR UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.force_tenant_isolation();


--
-- Name: repairs tr_repair_realtime_notif; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_repair_realtime_notif AFTER UPDATE OF current_status_id ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.fn_notify_repair_update();


--
-- Name: admin_notifications trg_admin_notifications_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_admin_notifications_insert INSTEAD OF INSERT ON public.admin_notifications FOR EACH ROW EXECUTE FUNCTION public.trg_insert_admin_notifications();


--
-- Name: invoices trg_assign_invoice_number; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_assign_invoice_number BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.assign_invoice_number_by_tenant();


--
-- Name: repairs trg_assign_tracking_code; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_assign_tracking_code BEFORE INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.fn_assign_tracking_code();


--
-- Name: cash_movements trg_auto_assign_cash_branch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auto_assign_cash_branch BEFORE INSERT ON public.cash_movements FOR EACH ROW EXECUTE FUNCTION public.auto_assign_cash_branch();


--
-- Name: orders trg_auto_assign_order_branch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auto_assign_order_branch BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.auto_assign_order_branch();


--
-- Name: repairs trg_auto_assign_repair_branch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auto_assign_repair_branch BEFORE INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.auto_assign_repair_branch();


--
-- Name: invoices trg_calculate_invoice_taxes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_calculate_invoice_taxes BEFORE INSERT OR UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_invoice_taxes();


--
-- Name: repairs trg_check_profile_before_repair; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_check_profile_before_repair BEFORE INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.check_user_profile_exists();


--
-- Name: courses trg_courses_slug; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_courses_slug BEFORE INSERT OR UPDATE OF title, slug ON public.courses FOR EACH ROW EXECUTE FUNCTION public.trigger_courses_slug();


--
-- Name: courses trg_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: knowledge_base trg_knowledge_base_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: repair_parts_used trg_manage_stock_on_repair; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_manage_stock_on_repair BEFORE INSERT OR DELETE OR UPDATE ON public.repair_parts_used FOR EACH ROW EXECUTE FUNCTION public.fn_manage_stock_on_repair_part();


--
-- Name: contact_messages trg_notify_admin_on_contact_message; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_notify_admin_on_contact_message AFTER INSERT ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.trg_contact_message_notify_admin();


--
-- Name: repairs trg_notify_admins_on_new_repair; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_notify_admins_on_new_repair AFTER INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_repair();


--
-- Name: product_stock_per_branch trg_notify_low_stock; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_notify_low_stock AFTER UPDATE OF quantity ON public.product_stock_per_branch FOR EACH ROW WHEN ((new.quantity < COALESCE(new.min_stock_alert, 2))) EXECUTE FUNCTION public.notify_low_stock();


--
-- Name: orders trg_order_status_stock; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_order_status_stock AFTER UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_stock_transition();


--
-- Name: orders trg_process_course_enrollments; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_process_course_enrollments AFTER UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.process_course_enrollments();


--
-- Name: products trg_products_search_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_products_search_update BEFORE INSERT OR UPDATE OF name, description, barcode ON public.products FOR EACH ROW EXECUTE FUNCTION public.fn_update_product_search();


--
-- Name: invoices trg_set_invoice_number; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_invoice_number BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_number();


--
-- Name: repairs trg_set_repair_number; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_repair_number BEFORE INSERT ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.set_repair_number();


--
-- Name: categories trg_sync_d1_categories; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_sync_d1_categories AFTER INSERT OR DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.fn_sync_d1_webhook();


--
-- Name: products trg_sync_d1_products; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_sync_d1_products AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.fn_sync_d1_webhook();


--
-- Name: order_items trg_sync_order_items_stock; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_sync_order_items_stock AFTER INSERT OR DELETE OR UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.sync_order_items_stock();


--
-- Name: blog_categories trg_update_blog_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts trg_update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: branches trg_update_branches_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: brands trg_update_brands_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: categories trg_update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses trg_update_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: invoices trg_update_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders trg_update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments trg_update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products trg_update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles trg_update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: purchases trg_update_purchases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: repairs trg_update_repairs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_repairs_updated_at BEFORE UPDATE ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: services trg_update_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: suppliers trg_update_suppliers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tenants trg_update_tenants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: repairs trg_validate_repair_delivery; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validate_repair_delivery BEFORE UPDATE OF current_status_id ON public.repairs FOR EACH ROW EXECUTE FUNCTION public.validate_repair_delivery();


--
-- Name: products trigger_notify_n8n_new_product; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_n8n_new_product AFTER INSERT ON public.products FOR EACH ROW WHEN ((new.description IS NULL)) EXECUTE FUNCTION public.notify_n8n_new_product();


--
-- Name: order_items update_order_total_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_order_total_trigger AFTER INSERT OR DELETE OR UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.update_order_total();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: academy_email_notifications academy_email_notifications_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_email_notifications
    ADD CONSTRAINT academy_email_notifications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;


--
-- Name: academy_email_notifications academy_email_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_email_notifications
    ADD CONSTRAINT academy_email_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: academy_payments academy_payments_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.academy_plans(id);


--
-- Name: academy_payments academy_payments_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.academy_subscriptions(id) ON DELETE CASCADE;


--
-- Name: academy_payments academy_payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: academy_payments academy_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_payments
    ADD CONSTRAINT academy_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: academy_plans academy_plans_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_plans
    ADD CONSTRAINT academy_plans_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: academy_subscriptions academy_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_subscriptions
    ADD CONSTRAINT academy_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.academy_plans(id);


--
-- Name: academy_subscriptions academy_subscriptions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_subscriptions
    ADD CONSTRAINT academy_subscriptions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: academy_subscriptions academy_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academy_subscriptions
    ADD CONSTRAINT academy_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id);


--
-- Name: auth_logs auth_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT auth_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bank_reconciliations bank_reconciliations_matched_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_matched_invoice_id_fkey FOREIGN KEY (matched_invoice_id) REFERENCES public.invoices(id);


--
-- Name: blog_categories blog_categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: blog_post_tags blog_post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT blog_post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: blog_post_tags blog_post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT blog_post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.blog_tags(id) ON DELETE CASCADE;


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: blog_tags blog_tags_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: branches branches_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: brands brands_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: brands brands_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: cash_movements cash_movements_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: cash_movements cash_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: categories categories_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: categories categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: contact_messages contact_messages_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: contact_messages contact_messages_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_certificates course_certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_certificates course_certificates_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_exam_questions course_exam_questions_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_questions
    ADD CONSTRAINT course_exam_questions_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;


--
-- Name: course_exam_questions course_exam_questions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_questions
    ADD CONSTRAINT course_exam_questions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_exam_submissions course_exam_submissions_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_submissions
    ADD CONSTRAINT course_exam_submissions_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;


--
-- Name: course_exam_submissions course_exam_submissions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_exam_submissions
    ADD CONSTRAINT course_exam_submissions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_instructors course_instructors_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT course_instructors_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_instructors course_instructors_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT course_instructors_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: course_lessons course_lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;


--
-- Name: course_lessons course_module_contents_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_module_contents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_progress course_progress_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;


--
-- Name: course_progress course_progress_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_progress course_progress_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: courses courses_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: customer_devices customer_devices_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_devices
    ADD CONSTRAINT customer_devices_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id);


--
-- Name: audit_logs fk_al_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_al_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: auth_logs fk_auth_logs_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT fk_auth_logs_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: blog_post_tags fk_bpt_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT fk_bpt_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: bank_reconciliations fk_br_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT fk_br_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: customer_devices fk_cd_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_devices
    ADD CONSTRAINT fk_cd_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_enrollments fk_ce_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT fk_ce_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: cash_movements fk_cm_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT fk_cm_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: course_modules fk_cmodule_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT fk_cmodule_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: models fk_models_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT fk_models_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: pages fk_pages_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT fk_pages_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: product_images fk_pi_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fk_pi_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: product_reviews fk_pr_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT fk_pr_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: page_templates fk_pt_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_templates
    ADD CONSTRAINT fk_pt_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: purchase_items fk_pur_items_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT fk_pur_items_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: repair_images fk_ri_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_images
    ADD CONSTRAINT fk_ri_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: repair_parts_used fk_rpu_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_parts_used
    ADD CONSTRAINT fk_rpu_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: repair_status_history fk_rsh_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_history
    ADD CONSTRAINT fk_rsh_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: services fk_svc_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk_svc_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: technical_solutions fk_ts_tenant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.technical_solutions
    ADD CONSTRAINT fk_ts_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_repair_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id);


--
-- Name: invoices invoices_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: knowledge_base knowledge_base_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base
    ADD CONSTRAINT knowledge_base_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: models models_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: order_items order_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: orders orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: orders orders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payments payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_stock_per_branch product_stock_per_branch_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT product_stock_per_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: product_stock_per_branch product_stock_per_branch_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT product_stock_per_branch_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_stock_per_branch product_stock_per_branch_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_stock_per_branch
    ADD CONSTRAINT product_stock_per_branch_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_variants product_variants_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: products products_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id);


--
-- Name: products products_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: profiles profiles_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: profiles profiles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: purchase_items purchase_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_items purchase_items_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(id) ON DELETE CASCADE;


--
-- Name: purchases purchases_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: purchases purchases_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: purchases purchases_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: repair_images repair_images_repair_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_images
    ADD CONSTRAINT repair_images_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id) ON DELETE CASCADE;


--
-- Name: repair_number_sequences repair_number_sequences_tenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_number_sequences
    ADD CONSTRAINT repair_number_sequences_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: repair_parts_used repair_parts_used_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_parts_used
    ADD CONSTRAINT repair_parts_used_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: repair_parts_used repair_parts_used_repair_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_parts_used
    ADD CONSTRAINT repair_parts_used_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id) ON DELETE CASCADE;


--
-- Name: repair_status_history repair_status_history_repair_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_history
    ADD CONSTRAINT repair_status_history_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id) ON DELETE CASCADE;


--
-- Name: repair_status_history repair_status_history_status_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_status_history
    ADD CONSTRAINT repair_status_history_status_type_id_fkey FOREIGN KEY (status_type_id) REFERENCES public.repair_status_types(id);


--
-- Name: repairs repairs_assigned_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_assigned_technician_id_fkey FOREIGN KEY (assigned_technician_id) REFERENCES public.profiles(id);


--
-- Name: repairs repairs_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: repairs repairs_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id);


--
-- Name: repairs repairs_current_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_current_status_id_fkey FOREIGN KEY (current_status_id) REFERENCES public.repair_status_types(id);


--
-- Name: repairs repairs_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.customer_devices(id);


--
-- Name: repairs repairs_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.profiles(id);


--
-- Name: repairs repairs_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;


--
-- Name: repairs repairs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: service_blocks service_blocks_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_blocks
    ADD CONSTRAINT service_blocks_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: service_categories service_categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: service_features service_features_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features
    ADD CONSTRAINT service_features_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: service_features service_features_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features
    ADD CONSTRAINT service_features_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: service_leads service_leads_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_leads
    ADD CONSTRAINT service_leads_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: service_leads service_leads_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_leads
    ADD CONSTRAINT service_leads_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: services services_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: services services_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: slug_redirects slug_redirects_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slug_redirects
    ADD CONSTRAINT slug_redirects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: stock_history stock_history_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_history
    ADD CONSTRAINT stock_history_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: stock_history stock_history_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_history
    ADD CONSTRAINT stock_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: stock_history stock_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_history
    ADD CONSTRAINT stock_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: stock_history stock_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_history
    ADD CONSTRAINT stock_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: suppliers suppliers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: suppliers suppliers_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: tenants tenants_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: reports fk_reports_profiles; Type: FK CONSTRAINT; Schema: zarx; Owner: -
--

ALTER TABLE ONLY zarx.reports
    ADD CONSTRAINT fk_reports_profiles FOREIGN KEY (user_id) REFERENCES zarx.profiles(id) ON DELETE SET NULL;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts_backup_20261018; Type: ROW SECURITY; Schema: backups; Owner: -
--

ALTER TABLE backups.blog_posts_backup_20261018 ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts_backup_20261018 blog_posts_backup_superadmin_only; Type: POLICY; Schema: backups; Owner: -
--

CREATE POLICY blog_posts_backup_superadmin_only ON backups.blog_posts_backup_20261018 TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: services_backup_20261018; Type: ROW SECURITY; Schema: backups; Owner: -
--

ALTER TABLE backups.services_backup_20261018 ENABLE ROW LEVEL SECURITY;

--
-- Name: services_backup_20261018 services_backup_superadmin_only; Type: POLICY; Schema: backups; Owner: -
--

CREATE POLICY services_backup_superadmin_only ON backups.services_backup_20261018 TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: course_certificates Admins can manage all certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all certificates" ON public.course_certificates TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: course_modules Admins can manage course modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage course modules" ON public.course_modules TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))));


--
-- Name: course_exam_questions Admins can manage exam questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage exam questions" ON public.course_exam_questions TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))));


--
-- Name: course_exam_submissions Admins can view exam submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view exam submissions" ON public.course_exam_submissions TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))));


--
-- Name: profiles Admins_All_Profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins_All_Profiles" ON public.profiles USING (public.is_admin());


--
-- Name: orders Anon can delete guest carts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon can delete guest carts" ON public.orders FOR DELETE TO anon USING (((session_id IS NOT NULL) AND (user_id IS NULL) AND (status = 'cart'::text) AND (session_id = public.get_request_guest_session())));


--
-- Name: orders Anon can insert guest orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon can insert guest orders" ON public.orders FOR INSERT TO anon WITH CHECK (((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = public.get_request_guest_session())));


--
-- Name: order_items Anon can manage guest order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon can manage guest order items" ON public.order_items TO anon USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.session_id IS NOT NULL) AND (o.user_id IS NULL) AND (o.session_id = public.get_request_guest_session()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.session_id IS NOT NULL) AND (o.user_id IS NULL) AND (o.session_id = public.get_request_guest_session())))));


--
-- Name: orders Anon can update guest orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon can update guest orders" ON public.orders FOR UPDATE TO anon USING (((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = public.get_request_guest_session()))) WITH CHECK (((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = public.get_request_guest_session())));


--
-- Name: orders Anon can view guest orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon can view guest orders" ON public.orders FOR SELECT TO anon USING (((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = public.get_request_guest_session())));


--
-- Name: course_lessons Authors can manage course contents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authors can manage course contents" ON public.course_lessons TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (c.author_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (c.author_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: course_modules Authors can manage course modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authors can manage course modules" ON public.course_modules TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = course_modules.course_id) AND (c.author_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = course_modules.course_id) AND (c.author_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: courses Authors can manage their courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authors can manage their courses" ON public.courses TO authenticated USING (((instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin())) WITH CHECK (((instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: branches Branch Staff Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Branch Staff Isolation" ON public.branches TO authenticated USING ((id = public.get_auth_user_branch()));


--
-- Name: cash_movements Branch Staff Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Branch Staff Isolation" ON public.cash_movements TO authenticated USING (((public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) AND (branch_id = public.get_auth_user_branch())));


--
-- Name: orders Branch Staff Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Branch Staff Isolation" ON public.orders TO authenticated USING (((public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text])) AND (branch_id = public.get_auth_user_branch())));


--
-- Name: purchases Branch Staff Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Branch Staff Isolation" ON public.purchases TO authenticated USING (((public.get_auth_user_role() = 'super_admin'::text) OR (branch_id = public.get_my_branch())));


--
-- Name: suppliers Branch Staff Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Branch Staff Isolation" ON public.suppliers TO authenticated USING (((public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text])) AND (branch_id = public.get_auth_user_branch())));


--
-- Name: audit_logs Deny all client access on audit_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Deny all client access on audit_logs" ON public.audit_logs USING (false);


--
-- Name: course_instructors Escritura para usuarios autenticados; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Escritura para usuarios autenticados" ON public.course_instructors TO authenticated USING ((( SELECT auth.uid() AS uid) IS NOT NULL)) WITH CHECK ((( SELECT auth.uid() AS uid) IS NOT NULL));


--
-- Name: customer_devices Filter_Soft_Deleted_Customer_Devices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Filter_Soft_Deleted_Customer_Devices" ON public.customer_devices AS RESTRICTIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));


--
-- Name: invoices Filter_Soft_Deleted_Invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Filter_Soft_Deleted_Invoices" ON public.invoices AS RESTRICTIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));


--
-- Name: models Filter_Soft_Deleted_Models; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Filter_Soft_Deleted_Models" ON public.models AS RESTRICTIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));


--
-- Name: orders Filter_Soft_Deleted_Orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Filter_Soft_Deleted_Orders" ON public.orders AS RESTRICTIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));


--
-- Name: repairs Filter_Soft_Deleted_Repairs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Filter_Soft_Deleted_Repairs" ON public.repairs AS RESTRICTIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));


--
-- Name: course_instructors Lectura publica de instructores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lectura publica de instructores" ON public.course_instructors FOR SELECT TO authenticated, anon USING ((instructor_id IS NOT NULL));


--
-- Name: products Products_Tenant_Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Products_Tenant_Isolation" ON public.products TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: products Public View - Products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public View - Products" ON public.products FOR SELECT TO anon USING (((is_active = true) AND (deleted_at IS NULL)));


--
-- Name: product_stock_per_branch Public View - Stock; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public View - Stock" ON public.product_stock_per_branch FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: tenants Public View - Tenants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public View - Tenants" ON public.tenants FOR SELECT TO anon USING ((is_active = true));


--
-- Name: app_settings Public profiles can read app_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public profiles can read app_settings" ON public.app_settings FOR SELECT TO authenticated, anon USING ((key IS NOT NULL));


--
-- Name: payments Staff and tenant owners can manage payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff and tenant owners can manage payments" ON public.payments TO authenticated USING (((public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])) AND (tenant_id = public.get_auth_user_tenant()))) WITH CHECK (((public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])) AND (tenant_id = public.get_auth_user_tenant())));


--
-- Name: orders Staff can insert orders for their tenant; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can insert orders for their tenant" ON public.orders FOR INSERT TO authenticated WITH CHECK (((tenant_id = public.get_auth_user_tenant()) AND (public.is_admin() OR public.is_super_admin())));


--
-- Name: product_stock_per_branch Stock_Tenant_Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Stock_Tenant_Isolation" ON public.product_stock_per_branch TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: course_certificates Students can view their own certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view their own certificates" ON public.course_certificates FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR ((email IS NOT NULL) AND (lower(email) = lower(COALESCE((( SELECT auth.jwt() AS jwt) ->> 'email'::text), ''::text))))));


--
-- Name: course_exam_submissions Students can view their own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view their own submissions" ON public.course_exam_submissions FOR SELECT TO authenticated USING ((email = (( SELECT auth.jwt() AS jwt) ->> 'email'::text)));


--
-- Name: course_progress Students manage own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students manage own progress" ON public.course_progress TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: branches SuperAdmin Bypass All; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin Bypass All" ON public.branches TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: cash_movements SuperAdmin Bypass All; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin Bypass All" ON public.cash_movements TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: orders SuperAdmin Bypass All; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin Bypass All" ON public.orders TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: purchases SuperAdmin Bypass All; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin Bypass All" ON public.purchases TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: suppliers SuperAdmin Bypass All; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin Bypass All" ON public.suppliers TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: payments SuperAdmin bypass payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "SuperAdmin bypass payments" ON public.payments TO authenticated USING ((public.get_auth_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: cash_movements Tenant Owner Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tenant Owner Isolation" ON public.cash_movements TO authenticated USING (((public.get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = public.get_auth_user_tenant())));


--
-- Name: orders Tenant Owner Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tenant Owner Isolation" ON public.orders TO authenticated USING (((public.get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = public.get_auth_user_tenant())));


--
-- Name: purchases Tenant Owner Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tenant Owner Isolation" ON public.purchases TO authenticated USING (((public.get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = public.get_auth_user_tenant())));


--
-- Name: suppliers Tenant Owner Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tenant Owner Isolation" ON public.suppliers TO authenticated USING (((public.get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = public.get_auth_user_tenant())));


--
-- Name: orders Users can delete their own carts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own carts" ON public.orders FOR DELETE TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) AND (status = 'cart'::text)));


--
-- Name: orders Users can insert their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: order_items Users can manage their own order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own order items" ON public.order_items TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: orders Users can update their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: orders Users can view their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: payments Users can view their own payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = payments.order_id) AND (o.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: product_variants Variants_Tenant_Isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Variants_Tenant_Isolation" ON public.product_variants TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: academy_email_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.academy_email_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: academy_payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.academy_payments ENABLE ROW LEVEL SECURITY;

--
-- Name: academy_payments academy_payments_admin_manage_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_payments_admin_manage_policy ON public.academy_payments TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: academy_payments academy_payments_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_payments_select_policy ON public.academy_payments FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: academy_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.academy_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: academy_plans academy_plans_admin_manage_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_plans_admin_manage_policy ON public.academy_plans TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: academy_plans academy_plans_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_plans_select_policy ON public.academy_plans FOR SELECT TO authenticated, anon USING (((is_active = true) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: academy_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.academy_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: academy_subscriptions academy_subscriptions_admin_manage_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_subscriptions_admin_manage_policy ON public.academy_subscriptions TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: academy_subscriptions academy_subscriptions_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY academy_subscriptions_select_policy ON public.academy_subscriptions FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: app_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs audit_logs_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY audit_logs_tenant_isolation ON public.audit_logs TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: auth_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: auth_logs auth_logs_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY auth_logs_tenant_isolation ON public.auth_logs TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: bank_reconciliations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bank_reconciliations ENABLE ROW LEVEL SECURITY;

--
-- Name: bank_reconciliations bank_reconciliations_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bank_reconciliations_tenant_isolation ON public.bank_reconciliations TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_categories blog_categories_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY blog_categories_tenant_isolation ON public.blog_categories TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_post_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_post_tags blog_post_tags_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY blog_post_tags_tenant_isolation ON public.blog_post_tags TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_tags blog_tags_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY blog_tags_tenant_isolation ON public.blog_tags TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_posts bp_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bp_delete ON public.blog_posts FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_posts bp_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bp_insert ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_posts bp_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bp_select ON public.blog_posts FOR SELECT USING (((((status)::text = 'published'::text) AND (EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = blog_posts.tenant_id) AND (t.is_active = true))))) OR (tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: blog_posts bp_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bp_update ON public.blog_posts FOR UPDATE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: branches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

--
-- Name: branches branches_public_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY branches_public_select ON public.branches FOR SELECT TO anon USING ((is_active = true));


--
-- Name: branches branches_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY branches_select ON public.branches FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: branches branches_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY branches_tenant_isolation ON public.branches TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: brands; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

--
-- Name: brands brands_unified_select_anon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY brands_unified_select_anon ON public.brands FOR SELECT TO anon USING (((deleted_at IS NULL) AND (tenant_id IS NOT NULL)));


--
-- Name: brands brands_unified_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY brands_unified_select_auth ON public.brands FOR SELECT TO authenticated USING (((deleted_at IS NULL) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: brands brands_unified_write_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY brands_unified_write_admin ON public.brands TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: cash_movements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

--
-- Name: cash_movements cash_movements_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cash_movements_tenant_isolation ON public.cash_movements TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: categories categories_unified_select_anon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categories_unified_select_anon ON public.categories FOR SELECT TO anon USING (((deleted_at IS NULL) AND (tenant_id IS NOT NULL)));


--
-- Name: categories categories_unified_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categories_unified_select_auth ON public.categories FOR SELECT TO authenticated USING (((deleted_at IS NULL) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: categories categories_unified_write_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categories_unified_write_admin ON public.categories TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: cola_tiktok; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cola_tiktok ENABLE ROW LEVEL SECURITY;

--
-- Name: cola_tiktok cola_tiktok_admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cola_tiktok_admin_insert ON public.cola_tiktok FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());


--
-- Name: cola_tiktok cola_tiktok_admin_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cola_tiktok_admin_select ON public.cola_tiktok FOR SELECT TO authenticated USING (public.is_super_admin());


--
-- Name: cola_tiktok cola_tiktok_admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cola_tiktok_admin_update ON public.cola_tiktok FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: course_certificates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: course_certificates course_certificates_instructor_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_certificates_instructor_insert ON public.course_certificates FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = course_certificates.course_id) AND ((c.instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin())))));


--
-- Name: course_certificates course_certificates_public_verify; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_certificates_public_verify ON public.course_certificates FOR SELECT TO authenticated, anon USING (((status = 'valid'::text) AND (id IS NOT NULL)));


--
-- Name: course_enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: course_enrollments course_enrollments_all_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_enrollments_all_policy ON public.course_enrollments TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: course_enrollments course_enrollments_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_enrollments_select_policy ON public.course_enrollments FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (lower(email) = lower(COALESCE((( SELECT auth.jwt() AS jwt) ->> 'email'::text), ''::text))) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: course_exam_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_exam_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: course_exam_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_exam_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: course_instructors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

--
-- Name: course_lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: course_lessons course_lessons_admin_all_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_lessons_admin_all_policy ON public.course_lessons TO authenticated USING ((public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))) OR (EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (c.author_id = ( SELECT auth.uid() AS uid))))))) WITH CHECK ((public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))) OR (EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (c.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: course_lessons course_lessons_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_lessons_select_policy ON public.course_lessons FOR SELECT TO authenticated, anon USING ((public.is_admin_of_tenant(tenant_id) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text]))))) OR (EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.course_enrollments ce ON ((ce.course_id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (ce.status = 'confirmed'::text) AND ((lower(ce.email) = lower(COALESCE((( SELECT auth.jwt() AS jwt) ->> 'email'::text), ''::text))) OR ((ce.user_id IS NOT NULL) AND (ce.user_id = ( SELECT auth.uid() AS uid)))) AND ((cm.unlock_date IS NULL) OR (cm.unlock_date <= now()))))) OR (EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = course_lessons.module_id) AND (c.author_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: course_modules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

--
-- Name: course_modules course_modules_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_modules_select_policy ON public.course_modules FOR SELECT TO authenticated, anon USING (((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = course_modules.course_id) AND (c.is_active = true)))) OR public.is_admin_of_tenant(tenant_id)));


--
-- Name: course_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: courses courses_unified_select_anon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY courses_unified_select_anon ON public.courses FOR SELECT TO anon USING ((is_active = true));


--
-- Name: courses courses_unified_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY courses_unified_select_auth ON public.courses FOR SELECT TO authenticated USING (((is_active = true) OR (instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: courses courses_unified_write_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY courses_unified_write_admin ON public.courses TO authenticated USING (((instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin())) WITH CHECK (((instructor_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: customer_devices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.customer_devices ENABLE ROW LEVEL SECURITY;

--
-- Name: customer_devices customer_devices_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY customer_devices_tenant_isolation ON public.customer_devices TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: educacion_y_skills; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.educacion_y_skills ENABLE ROW LEVEL SECURITY;

--
-- Name: educacion_y_skills educacion_y_skills_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY educacion_y_skills_admin_all ON public.educacion_y_skills TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: educacion_y_skills educacion_y_skills_public_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY educacion_y_skills_public_select ON public.educacion_y_skills FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: experiencia_laboral; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experiencia_laboral ENABLE ROW LEVEL SECURITY;

--
-- Name: experiencia_laboral experiencia_laboral_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY experiencia_laboral_admin_all ON public.experiencia_laboral TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: experiencia_laboral experiencia_laboral_public_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY experiencia_laboral_public_select ON public.experiencia_laboral FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices invoices_tenant_isolation_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invoices_tenant_isolation_all ON public.invoices TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: knowledge_base; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_base knowledge_base_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY knowledge_base_tenant_isolation ON public.knowledge_base TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: models mod_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mod_delete ON public.models FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: models mod_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mod_insert ON public.models FOR INSERT TO authenticated WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: models mod_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mod_select ON public.models FOR SELECT USING ((((deleted_at IS NULL) AND (EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = models.tenant_id) AND (t.is_active = true))))) OR (tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: models mod_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY mod_update ON public.models FOR UPDATE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: models; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

--
-- Name: course_modules modules_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY modules_tenant_isolation ON public.course_modules TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: page_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: page_templates page_templates_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY page_templates_tenant_isolation ON public.page_templates TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

--
-- Name: pages pages_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pages_tenant_isolation ON public.pages TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: product_images pi_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pi_delete ON public.product_images FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_images pi_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pi_insert ON public.product_images FOR INSERT TO authenticated WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_images pi_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pi_select ON public.product_images FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = product_images.tenant_id) AND (t.is_active = true)))) OR (tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_images pi_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pi_update ON public.product_images FOR UPDATE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: post_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: post_comments post_comments_admin_manage_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_comments_admin_manage_policy ON public.post_comments TO authenticated USING ((public.is_super_admin() OR ((tenant_id = public.get_current_tenant_id()) AND (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'tenant_owner'::text]))))) WITH CHECK ((public.is_super_admin() OR ((tenant_id = public.get_current_tenant_id()) AND (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'tenant_owner'::text])))));


--
-- Name: post_comments post_comments_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_comments_insert_policy ON public.post_comments FOR INSERT WITH CHECK (((tenant_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = post_comments.tenant_id) AND (t.is_active = true))))));


--
-- Name: post_comments post_comments_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY post_comments_select_policy ON public.post_comments FOR SELECT USING (((((status)::text = 'approved'::text) AND (EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = post_comments.tenant_id) AND (t.is_active = true))))) OR (tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_reviews pr_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pr_delete ON public.product_reviews FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_reviews pr_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pr_insert ON public.product_reviews FOR INSERT TO authenticated WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_reviews pr_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pr_select ON public.product_reviews FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = product_reviews.tenant_id) AND (t.is_active = true)))) OR (tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_reviews pr_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pr_update ON public.product_reviews FOR UPDATE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: product_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

--
-- Name: product_reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: product_stock_per_branch; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_stock_per_branch ENABLE ROW LEVEL SECURITY;

--
-- Name: product_variants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_delete_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_delete_permission ON public.profiles FOR DELETE USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: profiles profiles_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles profiles_insert_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_insert_permission ON public.profiles FOR INSERT WITH CHECK ((public.has_permission('customers:manage:branch'::text, branch_id) OR public.has_permission('customers:manage:global'::text, NULL::uuid) OR (public.get_auth_user_role() = 'super_admin'::text)));


--
-- Name: profiles profiles_read_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_read_own ON public.profiles FOR SELECT TO authenticated USING ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles profiles_read_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_read_permission ON public.profiles FOR SELECT USING ((public.has_permission('customers:manage:branch'::text, branch_id) OR public.has_permission('customers:manage:global'::text, NULL::uuid) OR (public.get_auth_user_role() = 'super_admin'::text)));


--
-- Name: profiles profiles_tenant_isolation_restrictive; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_tenant_isolation_restrictive ON public.profiles AS RESTRICTIVE TO authenticated USING (((id = ( SELECT auth.uid() AS uid)) OR (tenant_id = public.get_auth_user_tenant()) OR public.is_super_admin()));


--
-- Name: profiles profiles_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles profiles_update_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update_permission ON public.profiles FOR UPDATE USING ((public.has_permission('customers:manage:branch'::text, branch_id) OR public.has_permission('customers:manage:global'::text, NULL::uuid) OR (public.get_auth_user_role() = 'super_admin'::text))) WITH CHECK ((public.has_permission('customers:manage:branch'::text, branch_id) OR public.has_permission('customers:manage:global'::text, NULL::uuid) OR (public.get_auth_user_role() = 'super_admin'::text)));


--
-- Name: contact_messages public_contact_messages_insert_anon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_contact_messages_insert_anon ON public.contact_messages FOR INSERT TO anon WITH CHECK (((tenant_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.tenants t
  WHERE ((t.id = contact_messages.tenant_id) AND (t.is_active = true))))));


--
-- Name: purchase_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

--
-- Name: purchase_items purchase_items_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY purchase_items_tenant_isolation ON public.purchase_items TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: purchases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_images ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_images repair_images_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_images_tenant_isolation ON public.repair_images TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: repair_number_sequences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_number_sequences ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_number_sequences repair_number_sequences_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_number_sequences_admin_all ON public.repair_number_sequences TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: repair_number_sequences repair_number_sequences_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_number_sequences_tenant_isolation ON public.repair_number_sequences TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: repair_parts_used; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_parts_used ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_parts_used repair_parts_used_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_parts_used_tenant_isolation ON public.repair_parts_used TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: repair_status_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_status_history ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_status_history repair_status_history_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_status_history_tenant_isolation ON public.repair_status_history TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: repair_status_types; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_status_types ENABLE ROW LEVEL SECURITY;

--
-- Name: repairs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;

--
-- Name: repairs repairs_delete_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repairs_delete_permission ON public.repairs FOR DELETE USING ((public.get_auth_user_role() = 'super_admin'::text));


--
-- Name: repairs repairs_insert_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repairs_insert_permission ON public.repairs FOR INSERT TO authenticated WITH CHECK ((((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()) AND (public.has_permission('repairs:create:branch'::text, branch_id) OR public.has_permission('repairs:create:global'::text, NULL::uuid) OR public.is_super_admin())));


--
-- Name: repairs repairs_read_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repairs_read_permission ON public.repairs FOR SELECT TO authenticated USING ((((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()) AND (public.has_permission('repairs:read:branch'::text, branch_id) OR public.has_permission('repairs:read:global'::text, NULL::uuid) OR public.is_super_admin())));


--
-- Name: repairs repairs_tenant_isolation_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repairs_tenant_isolation_all ON public.repairs TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: repairs repairs_update_permission; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repairs_update_permission ON public.repairs FOR UPDATE TO authenticated USING ((((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()) AND (public.has_permission('repairs:edit:branch'::text, branch_id) OR public.has_permission('repairs:edit:global'::text, NULL::uuid) OR public.is_super_admin()))) WITH CHECK ((((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()) AND (public.has_permission('repairs:edit:branch'::text, branch_id) OR public.has_permission('repairs:edit:global'::text, NULL::uuid) OR public.is_super_admin())));


--
-- Name: role_permissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: role_permissions role_permissions_read_authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY role_permissions_read_authenticated ON public.role_permissions FOR SELECT TO authenticated USING ((role_id IS NOT NULL));


--
-- Name: role_permissions role_permissions_write_super_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY role_permissions_write_super_admin ON public.role_permissions TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: roles roles_read_authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roles_read_authenticated ON public.roles FOR SELECT TO authenticated USING ((id IS NOT NULL));


--
-- Name: roles roles_write_super_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roles_write_super_admin ON public.roles TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: repair_status_types rst_unified_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rst_unified_select ON public.repair_status_types FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations schema_migrations_admin_only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY schema_migrations_admin_only ON public.schema_migrations TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: service_blocks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_blocks ENABLE ROW LEVEL SECURITY;

--
-- Name: service_blocks service_blocks_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_blocks_admin_all ON public.service_blocks TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()) OR (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text, 'tenant_owner'::text])))) WITH CHECK ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()) OR (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text, 'tenant_owner'::text]))));


--
-- Name: service_blocks service_blocks_unified_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_blocks_unified_select ON public.service_blocks FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: service_blocks service_blocks_unified_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_blocks_unified_write ON public.service_blocks TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: service_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: service_categories service_categories_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_categories_admin_all ON public.service_categories TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))) WITH CHECK ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())));


--
-- Name: service_categories service_categories_public_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_categories_public_select ON public.service_categories FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: service_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;

--
-- Name: service_features service_features_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_features_admin_all ON public.service_features TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))) WITH CHECK ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())));


--
-- Name: service_features service_features_unified_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_features_unified_select ON public.service_features FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: service_features service_features_unified_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_features_unified_write ON public.service_features TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: service_leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;

--
-- Name: service_leads service_leads_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_leads_admin_all ON public.service_leads TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))) WITH CHECK ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())));


--
-- Name: service_leads service_leads_anon_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY service_leads_anon_insert ON public.service_leads FOR INSERT TO authenticated, anon WITH CHECK (((tenant_id IS NOT NULL) AND (name IS NOT NULL) AND (length(TRIM(BOTH FROM name)) >= 2) AND (((phone IS NOT NULL) AND (length(TRIM(BOTH FROM phone)) >= 6)) OR ((email IS NOT NULL) AND ((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)))));


--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: services services_unified_select_anon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY services_unified_select_anon ON public.services FOR SELECT TO anon USING (((deleted_at IS NULL) AND (is_published = true)));


--
-- Name: services services_unified_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY services_unified_select_auth ON public.services FOR SELECT TO authenticated USING (((deleted_at IS NULL) OR public.is_admin() OR public.is_super_admin()));


--
-- Name: services services_unified_write_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY services_unified_write_admin ON public.services TO authenticated USING ((public.is_admin() OR public.is_super_admin())) WITH CHECK ((public.is_admin() OR public.is_super_admin()));


--
-- Name: slug_redirects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

--
-- Name: slug_redirects slug_redirects_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY slug_redirects_admin_all ON public.slug_redirects TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()))) WITH CHECK ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id())));


--
-- Name: slug_redirects slug_redirects_anon_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY slug_redirects_anon_select ON public.slug_redirects FOR SELECT TO authenticated, anon USING ((tenant_id IS NOT NULL));


--
-- Name: order_items staff_tenant_order_items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY staff_tenant_order_items ON public.order_items TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: stock_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;

--
-- Name: stock_history stock_history_super_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY stock_history_super_admin ON public.stock_history TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: stock_history stock_history_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY stock_history_tenant_isolation ON public.stock_history TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: audit_logs super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.audit_logs TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: auth_logs super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.auth_logs TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: bank_reconciliations super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.bank_reconciliations TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: blog_categories super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.blog_categories TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: blog_post_tags super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.blog_post_tags TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: blog_posts super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.blog_posts TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: blog_tags super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.blog_tags TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: branches super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.branches TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: cash_movements super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.cash_movements TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: course_enrollments super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.course_enrollments TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: course_modules super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.course_modules TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: customer_devices super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.customer_devices TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: invoices super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.invoices TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: models super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.models TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: order_items super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.order_items TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: orders super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.orders TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: page_templates super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.page_templates TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: pages super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.pages TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: product_images super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.product_images TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: product_reviews super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.product_reviews TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: purchase_items super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.purchase_items TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: purchases super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.purchases TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: repair_images super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.repair_images TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: repair_number_sequences super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.repair_number_sequences TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: repair_parts_used super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.repair_parts_used TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: repair_status_history super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.repair_status_history TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: repair_status_types super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.repair_status_types TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: suppliers super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.suppliers TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: technical_solutions super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.technical_solutions TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: tenants super_admin_all_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_all_access ON public.tenants TO authenticated USING ((public.get_user_role() = 'super_admin'::text)) WITH CHECK ((public.get_user_role() = 'super_admin'::text));


--
-- Name: contact_messages super_admin_contact_messages_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_contact_messages_all ON public.contact_messages TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: notifications super_admin_notifications_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY super_admin_notifications_all ON public.notifications TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: suppliers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

--
-- Name: suppliers suppliers_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY suppliers_tenant_isolation ON public.suppliers TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: technical_solutions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.technical_solutions ENABLE ROW LEVEL SECURITY;

--
-- Name: technical_solutions technical_solutions_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY technical_solutions_tenant_isolation ON public.technical_solutions TO authenticated USING (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin())) WITH CHECK (((tenant_id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: academy_email_notifications tenant_academy_email_notifications_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_academy_email_notifications_select ON public.academy_email_notifications FOR SELECT TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND ((user_id = ( SELECT auth.uid() AS uid)) OR public.is_admin() OR public.is_super_admin())));


--
-- Name: contact_messages tenant_contact_messages_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_contact_messages_delete ON public.contact_messages FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'tenant_owner'::text])))))));


--
-- Name: contact_messages tenant_contact_messages_insert_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_contact_messages_insert_auth ON public.contact_messages FOR INSERT TO authenticated WITH CHECK ((tenant_id = public.get_current_tenant_id()));


--
-- Name: contact_messages tenant_contact_messages_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_contact_messages_select ON public.contact_messages FOR SELECT TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])))))));


--
-- Name: contact_messages tenant_contact_messages_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_contact_messages_update ON public.contact_messages FOR UPDATE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text]))))))) WITH CHECK (((tenant_id = public.get_current_tenant_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])))))));


--
-- Name: notifications tenant_notifications_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_notifications_delete ON public.notifications FOR DELETE TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'tenant_owner'::text])))))));


--
-- Name: notifications tenant_notifications_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_notifications_insert ON public.notifications FOR INSERT TO authenticated WITH CHECK ((tenant_id = public.get_current_tenant_id()));


--
-- Name: notifications tenant_notifications_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_notifications_select ON public.notifications FOR SELECT TO authenticated USING (((tenant_id = public.get_current_tenant_id()) AND ((((scope)::text = 'user'::text) AND ((user_id IS NULL) OR (user_id = ( SELECT auth.uid() AS uid)))) OR (((scope)::text = 'admin'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text, 'tenant_owner'::text])))))))));


--
-- Name: notifications tenant_notifications_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_notifications_update ON public.notifications FOR UPDATE TO authenticated USING ((tenant_id = public.get_current_tenant_id())) WITH CHECK ((tenant_id = public.get_current_tenant_id()));


--
-- Name: tenants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

--
-- Name: tenants tenants_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenants_select ON public.tenants FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: tenants tenants_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenants_select_policy ON public.tenants FOR SELECT USING (((is_active = true) OR (id = public.get_current_tenant_id()) OR public.is_super_admin()));


--
-- Name: tenants tenants_unified_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenants_unified_update ON public.tenants FOR UPDATE TO authenticated USING (((id = ( SELECT p.tenant_id
   FROM public.profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) AND (( SELECT p.role
   FROM public.profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text))) WITH CHECK (((id = ( SELECT p.tenant_id
   FROM public.profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) AND (( SELECT p.role
   FROM public.profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text)));


--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles user_roles_tenant_isolation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_roles_tenant_isolation ON public.user_roles TO authenticated USING ((public.is_super_admin() OR (tenant_id = public.get_current_tenant_id()) OR (user_id = ( SELECT auth.uid() AS uid)))) WITH CHECK ((public.is_super_admin() OR ((tenant_id = public.get_current_tenant_id()) AND (public.get_auth_user_role() = ANY (ARRAY['admin'::text, 'tenant_owner'::text])))));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Admin Delete; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (((bucket_id = 'repair-images'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Admin Insert; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'repair-images'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Admin Update; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (((bucket_id = 'repair-images'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Admins_Read_All_Receipts; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admins_Read_All_Receipts" ON storage.objects FOR SELECT USING (((bucket_id = 'receipts'::text) AND public.is_admin()));


--
-- Name: objects Anyone can upload an avatar.; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'avatars'::text));


--
-- Name: objects Autenticados suben evidencia; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Autenticados suben evidencia" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'repair_evidence'::text));


--
-- Name: objects Autenticados suben facturas; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Autenticados suben facturas" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'invoices_pdf'::text));


--
-- Name: objects Autenticados ven facturas; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Autenticados ven facturas" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'invoices_pdf'::text));


--
-- Name: objects Autenticados ven su evidencia; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Autenticados ven su evidencia" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'repair_evidence'::text));


--
-- Name: objects Authenticated Delete; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'public-assets'::text));


--
-- Name: objects Authenticated Update; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'public-assets'::text));


--
-- Name: objects Authenticated Updates; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated Updates" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'academy_certificates'::text));


--
-- Name: objects Authenticated Upload; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'public-assets'::text));


--
-- Name: objects Authenticated Uploads; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'academy_certificates'::text));


--
-- Name: objects Authenticated can upload avatars; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated can upload avatars" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated can upload evidence; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated can upload evidence" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'evidence'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated users can select avatars; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can select avatars" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'avatars'::text));


--
-- Name: objects Authenticated users can select certificates; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can select certificates" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'academy_certificates'::text));


--
-- Name: objects Authenticated users can select course covers; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can select course covers" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'course-covers'::text));


--
-- Name: objects Authenticated users can select cvs; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can select cvs" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'cv-generados'::text));


--
-- Name: objects Authenticated users can select evidence; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can select evidence" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'evidence'::text));


--
-- Name: objects Permitir a invitados subir comprobantes; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Permitir a invitados subir comprobantes" ON storage.objects FOR INSERT TO anon WITH CHECK (((bucket_id = 'public-assets'::text) AND (name ~~ '%/payment-proofs/%'::text)));


--
-- Name: objects Student_Insert_Receipt; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Student_Insert_Receipt" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'receipts'::text) AND (auth.uid() = owner)));


--
-- Name: objects Student_Read_Own_Receipt; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Student_Read_Own_Receipt" ON storage.objects FOR SELECT USING (((bucket_id = 'receipts'::text) AND (auth.uid() = owner)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles Admins can delete any profile; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY "Admins can delete any profile" ON zarx.profiles FOR DELETE USING (zarx.is_admin());


--
-- Name: profiles Admins can update any profile; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY "Admins can update any profile" ON zarx.profiles FOR UPDATE USING (zarx.is_admin());


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY "Users can insert own profile" ON zarx.profiles FOR INSERT TO authenticated WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY "Users can update own profile" ON zarx.profiles FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: active_news; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.active_news ENABLE ROW LEVEL SECURITY;

--
-- Name: active_tracking_sessions; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.active_tracking_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: emergencies; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.emergencies ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: public_alerts; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.public_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: reports; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.reports ENABLE ROW LEVEL SECURITY;

--
-- Name: public_alerts zarx_alerts_admin_all; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_alerts_admin_all ON zarx.public_alerts TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());


--
-- Name: public_alerts zarx_alerts_select; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_alerts_select ON zarx.public_alerts FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: emergencies zarx_emergencies_scoped; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_emergencies_scoped ON zarx.emergencies TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR zarx.is_admin())) WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) OR zarx.is_admin()));


--
-- Name: active_news zarx_news_admin_all; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_news_admin_all ON zarx.active_news TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());


--
-- Name: active_news zarx_news_select; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_news_select ON zarx.active_news FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: notifications zarx_notifications_scoped; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_notifications_scoped ON zarx.notifications TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles zarx_profiles_select_public; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_profiles_select_public ON zarx.profiles FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: reports zarx_reports_scoped; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_reports_scoped ON zarx.reports TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR zarx.is_admin())) WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) OR zarx.is_admin()));


--
-- Name: active_tracking_sessions zarx_tracking_scoped; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_tracking_scoped ON zarx.active_tracking_sessions TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: zones zarx_zones_admin_all; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_zones_admin_all ON zarx.zones TO authenticated USING (zarx.is_admin()) WITH CHECK (zarx.is_admin());


--
-- Name: zones zarx_zones_select; Type: POLICY; Schema: zarx; Owner: -
--

CREATE POLICY zarx_zones_select ON zarx.zones FOR SELECT TO authenticated, anon USING ((id IS NOT NULL));


--
-- Name: zones; Type: ROW SECURITY; Schema: zarx; Owner: -
--

ALTER TABLE zarx.zones ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime active_news; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.active_news;


--
-- Name: supabase_realtime active_tracking_sessions; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.active_tracking_sessions;


--
-- Name: supabase_realtime emergencies; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.emergencies;


--
-- Name: supabase_realtime notifications; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.notifications;


--
-- Name: supabase_realtime public_alerts; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.public_alerts;


--
-- Name: supabase_realtime reports; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.reports;


--
-- Name: supabase_realtime zones; Type: PUBLICATION TABLE; Schema: zarx; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY zarx.zones;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE SCHEMA')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

