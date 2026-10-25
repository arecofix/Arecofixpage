-- TSK-01b: Verificación empírica RLS (ANTES del fix)
-- Instrucciones: Ejecutar este script en el SQL Editor de Supabase (https://db.arecofix.com.ar o Supabase Cloud).

BEGIN;

DO $$
DECLARE
  v_staff_uid uuid;
  v_staff_branch uuid;
  v_client_uid uuid;
  v_repair_id uuid;
  v_result_count int;
  v_client_name text;
BEGIN
  -- 1. Obtener el UUID de un usuario Staff cualquiera y su sucursal
  SELECT id, branch_id INTO v_staff_uid, v_staff_branch 
  FROM public.profiles 
  WHERE role IN ('staff', 'technician') 
  LIMIT 1;

  IF v_staff_uid IS NULL THEN
    RAISE NOTICE 'No se encontró ningún usuario con rol staff/technician para la prueba. Omitiendo en DB limpia.';
    RETURN;
  END IF;

  -- 2. Obtener una reparación de esa misma sucursal
  SELECT id, client_id INTO v_repair_id, v_client_uid 
  FROM public.repairs 
  WHERE branch_id = v_staff_branch AND client_id IS NOT NULL 
  LIMIT 1;

  IF v_client_uid IS NULL THEN
    RAISE NOTICE 'No se encontró ninguna reparación con cliente para la sucursal del staff. Omitiendo en DB limpia.';
    RETURN;
  END IF;

  -- 3. Inyectar el contexto de sesión (Impersonar al Staff)
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', format('{"sub": "%s", "role": "authenticated"}', v_staff_uid), true);

  -- 4. Ejecutar el SELECT exacto que hace el ORM por detrás (como si fuera mapFromDb de Supabase)
  SELECT count(*), max(first_name) INTO v_result_count, v_client_name
  FROM public.profiles 
  WHERE id = v_client_uid;

  -- 5. Imprimir resultados
  RAISE NOTICE '====================================================';
  RAISE NOTICE '🔍 RESULTADO DE LA VERIFICACIÓN EMPÍRICA RLS (ANTES)';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '👤 UUID Staff impersonado: %', v_staff_uid;
  RAISE NOTICE '📱 UUID Cliente buscado:   %', v_client_uid;
  RAISE NOTICE '⚙️  UUID Reparación:       %', v_repair_id;
  RAISE NOTICE '----------------------------------------------------';
  
  IF v_result_count = 0 THEN
    RAISE NOTICE '❌ FALLO CONFIRMADO: El RLS bloqueó la lectura. Filas devueltas: 0.';
    RAISE NOTICE '   El ORM recibirá "client: null" y causará el Bug 2 (Corrupción a "Cliente").';
  ELSE
    RAISE NOTICE '✅ LECTURA EXITOSA: El RLS permitió la lectura. Nombre: %', v_client_name;
    RAISE NOTICE '   Si esto es 1, la hipótesis del Bug 2 por RLS es FALSA.';
  END IF;
  RAISE NOTICE '====================================================';

END $$;

ROLLBACK;
