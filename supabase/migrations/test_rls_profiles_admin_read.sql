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
  SELECT id, branch_id INTO v_staff_uid, v_staff_branch 
  FROM public.profiles 
  WHERE role IN ('admin', 'user') 
  LIMIT 1;

  SELECT id, client_id INTO v_repair_id, v_client_uid 
  FROM public.repairs 
  WHERE client_id IS NOT NULL 
  LIMIT 1;

  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', format('{"sub": "%s", "role": "authenticated"}', v_staff_uid), true);

  SELECT count(*), max(first_name) INTO v_result_count, v_client_name
  FROM public.profiles 
  WHERE id = v_client_uid;

  RAISE NOTICE 'RLS Test. Expected > 0. Got: %', v_result_count;
END $$;

ROLLBACK;
