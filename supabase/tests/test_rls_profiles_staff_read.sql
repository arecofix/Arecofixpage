-- Test: Staff lee perfil de cliente de su sucursal.
BEGIN;

-- Simular JWT de un Staff de la Sucursal A (ej. id: '923e7c74-e0f7-421e-88b0-6746ca783c8a')
set local role authenticated;
set local request.jwt.claims = '{"sub":"923e7c74-e0f7-421e-88b0-6746ca783c8a"}';

-- Verificar si lee al menos 1 perfil
DO $$
DECLARE
  profile_count INT;
BEGIN
  SELECT count(*) INTO profile_count FROM profiles;
  IF profile_count = 0 THEN
    RAISE EXCEPTION 'Test falló: El staff no puede ver perfiles. RLS es demasiado estricto o no tiene permisos.';
  END IF;
  RAISE NOTICE 'Test exitoso: Staff puede ver % perfiles.', profile_count;
END $$;

ROLLBACK;
