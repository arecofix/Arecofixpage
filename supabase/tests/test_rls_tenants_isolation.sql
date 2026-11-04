-- ==============================================================================
-- REGRESSION TEST: Tenants RLS Isolation & Safe Public View
-- ==============================================================================

BEGIN;

-- 1. Test como rol ANON en public.tenants (Debe devolver exactamente 0 filas)
SET LOCAL ROLE anon;
SET LOCAL request.jwt.claims = '{"role": "anon"}';

DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.tenants;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: anon puede leer public.tenants (% filas devueltas). Fuga activa!', v_count;
  END IF;
  RAISE NOTICE 'PASÓ: anon devolvió 0 filas en public.tenants.';
END $$;

-- 2. Test como rol ANON en public.public_tenant_profile (Debe leer sólo datos públicos)
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.public_tenant_profile;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: public_tenant_profile no devolvió filas para anon. Storefront roto.';
  END IF;
  RAISE NOTICE 'PASÓ: anon puede leer public_tenant_profile (% filas públicas).', v_count;
END $$;

-- 3. Test de columna sensible inexistente en public_tenant_profile
DO $$
DECLARE
  v_has_col BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'public_tenant_profile' 
      AND column_name IN ('ml_access_token', 'whatsapp_access_token', 'tax_id', 'bank_info', 'contact_email')
  ) INTO v_has_col;

  IF v_has_col THEN
    RAISE EXCEPTION 'TEST FALLÓ: public_tenant_profile contiene columnas sensibles.';
  END IF;
  RAISE NOTICE 'PASÓ: public_tenant_profile no expone columnas sensibles.';
END $$;

-- 4. Test como usuario autenticado de Tenant A (Librería ZAONA: 550e8400-e29b-41d4-a716-446655440000)
-- Profile ID: 3d027aa6-d59a-4b04-aa38-38c8d263c877
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "3d027aa6-d59a-4b04-aa38-38c8d263c877", "role": "authenticated"}';

DO $$
DECLARE
  v_tenant_count INT;
  v_tenant_id UUID;
  v_other_tenant_count INT;
BEGIN
  SELECT count(*), max(id::text)::uuid INTO v_tenant_count, v_tenant_id FROM public.tenants;
  
  IF v_tenant_count <> 1 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Tenant A vio % tenants (se esperaba exactamente 1).', v_tenant_count;
  END IF;

  IF v_tenant_id <> '550e8400-e29b-41d4-a716-446655440000'::uuid THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Tenant A vio el tenant equivocado (id: %).', v_tenant_id;
  END IF;

  SELECT count(*) INTO v_other_tenant_count 
  FROM public.tenants 
  WHERE id <> '550e8400-e29b-41d4-a716-446655440000'::uuid;

  IF v_other_tenant_count > 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Tenant A vio % tenants ajenos.', v_other_tenant_count;
  END IF;

  RAISE NOTICE 'PASÓ: Usuario de Tenant A sólo ve exactamente su propio tenant.';
END $$;

ROLLBACK;
