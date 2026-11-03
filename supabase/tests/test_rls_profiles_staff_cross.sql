-- Test: Staff NO lee perfil de otra sucursal.
BEGIN;

-- Simular JWT de un Staff (ej. id: '923e7c74-e0f7-421e-88b0-6746ca783c8a')
set local role authenticated;
set local request.jwt.claims = '{"sub":"923e7c74-e0f7-421e-88b0-6746ca783c8a"}';

-- Cambiar el tenant actual a un UUID falso simulando que estamos viendo Tenant B
set local app.current_tenant = '00000000-0000-0000-0000-000000000000';

-- Verificar si lee perfiles de OTRO tenant (que no sea el suyo)
DO $$
DECLARE
  profile_count INT;
  my_tenant UUID;
BEGIN
  SELECT tenant_id INTO my_tenant FROM profiles WHERE id = '923e7c74-e0f7-421e-88b0-6746ca783c8a';
  
  -- Intentar ver perfiles que NO sean de mi tenant (y que no sean yo mismo)
  SELECT count(*) INTO profile_count FROM profiles 
  WHERE tenant_id != my_tenant AND id != '923e7c74-e0f7-421e-88b0-6746ca783c8a';

  IF profile_count > 0 THEN
    RAISE EXCEPTION 'Test falló: El staff puede ver perfiles de otro tenant (tenant isolation roto). Vio % perfiles.', profile_count;
  END IF;
  RAISE NOTICE 'Test exitoso: Staff NO puede ver perfiles de otro tenant.';
END $$;

ROLLBACK;
