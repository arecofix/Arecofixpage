-- ==============================================================================
-- REGRESSION TEST: Branches RLS Isolation & Safe Public View
-- ==============================================================================

BEGIN;

-- 1. Test como rol ANON en public.branches (Debe devolver exactamente 0 filas)
SET LOCAL ROLE anon;
SET LOCAL request.jwt.claims = '{"role": "anon"}';

DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.branches;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: anon puede leer public.branches (% filas devueltas). Fuga activa!', v_count;
  END IF;
  RAISE NOTICE 'PASÓ: anon devolvió 0 filas en public.branches.';
END $$;

-- 2. Test como rol ANON en public.public_branch_profile (Debe leer sólo datos públicos)
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.public_branch_profile;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: public_branch_profile no devolvió filas para anon. Storefront roto.';
  END IF;
  RAISE NOTICE 'PASÓ: anon puede leer public_branch_profile (% sucursales públicas).', v_count;
END $$;

-- 3. Test de columnas sensibles (bank_info, tax_id) inexistentes en public_branch_profile
DO $$
DECLARE
  v_has_col BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'public_branch_profile' 
      AND column_name IN ('bank_info', 'tax_id')
  ) INTO v_has_col;

  IF v_has_col THEN
    RAISE EXCEPTION 'TEST FALLÓ: public_branch_profile expone bank_info o tax_id.';
  END IF;
  RAISE NOTICE 'PASÓ: public_branch_profile no contiene columnas bancarias ni fiscales.';
END $$;

-- 4. Test como usuario autenticado de Tenant A (Librería ZAONA: 550e8400-e29b-41d4-a716-446655440000)
-- Profile ID: 3d027aa6-d59a-4b04-aa38-38c8d263c877
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "3d027aa6-d59a-4b04-aa38-38c8d263c877", "role": "authenticated"}';

DO $$
DECLARE
  v_branch_count INT;
  v_other_branch_count INT;
BEGIN
  -- Leer solo sus sucursales
  SELECT count(*) INTO v_branch_count 
  FROM public.branches
  WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

  IF v_branch_count = 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Tenant A no pudo leer sus propias sucursales.';
  END IF;

  -- Verificar aislamiento cross-tenant
  SELECT count(*) INTO v_other_branch_count 
  FROM public.branches 
  WHERE tenant_id <> '550e8400-e29b-41d4-a716-446655440000'::uuid;

  IF v_other_branch_count > 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Tenant A vio % sucursales ajenas con datos bancarios!', v_other_branch_count;
  END IF;

  RAISE NOTICE 'PASÓ: Usuario de Tenant A sólo ve sus propias sucursales (% sucursales propias, 0 ajenas).', v_branch_count;
END $$;

ROLLBACK;
