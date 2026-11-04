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

-- 4. Test como usuario autenticado de Tenant Binarycell (Tenant: b7030a00-7b43-4afd-a6f9-cc5ec882266b)
-- Profile ID: c245900f-ae24-4523-bf89-5306c7a9796b
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "c245900f-ae24-4523-bf89-5306c7a9796b", "role": "authenticated"}';

DO $$
DECLARE
  v_branch_count INT;
  v_branch_name TEXT;
  v_other_branch_count INT;
BEGIN
  -- Leer solo sus sucursales
  SELECT count(*), max(name) INTO v_branch_count, v_branch_name 
  FROM public.branches;

  IF v_branch_count <> 1 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Binarycell vio % sucursales (se esperaba 1).', v_branch_count;
  END IF;

  IF v_branch_name <> 'Binarycell' THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Binarycell vio una sucursal equivocada: %', v_branch_name;
  END IF;

  -- Verificar que no ve sucursales ajenas (como Arecofix, Safefix, Maxilubreze)
  SELECT count(*) INTO v_other_branch_count 
  FROM public.branches 
  WHERE tenant_id <> 'b7030a00-7b43-4afd-a6f9-cc5ec882266b'::uuid;

  IF v_other_branch_count > 0 THEN
    RAISE EXCEPTION 'TEST FALLÓ: Usuario de Binarycell vio % sucursales ajenas con datos bancarios!', v_other_branch_count;
  END IF;

  RAISE NOTICE 'PASÓ: Usuario de Binarycell sólo ve su propia sucursal (% - 0 sucursales ajenas).', v_branch_name;
END $$;

ROLLBACK;
