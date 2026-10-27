-- Test: Tenant A no ve repairs de Tenant B.
BEGIN;

-- Simular JWT de un Staff (ej. id: '923e7c74-e0f7-421e-88b0-6746ca783c8a')
set local role authenticated;
set local request.jwt.claims = '{"sub":"923e7c74-e0f7-421e-88b0-6746ca783c8a"}';

-- Cambiar el tenant actual a un UUID falso simulando que estamos viendo Tenant B
set local app.current_tenant = '00000000-0000-0000-0000-000000000000';

-- Verificar si lee reparaciones de OTRO tenant
DO $$
DECLARE
  repair_count INT;
  my_tenant UUID;
BEGIN
  SELECT tenant_id INTO my_tenant FROM profiles WHERE id = '923e7c74-e0f7-421e-88b0-6746ca783c8a';

  SELECT count(*) INTO repair_count FROM repairs WHERE tenant_id != my_tenant;
  IF repair_count > 0 THEN
    RAISE EXCEPTION 'Test falló: El staff puede ver reparaciones de otro tenant (tenant isolation roto). Vio %.', repair_count;
  END IF;
  RAISE NOTICE 'Test exitoso: Staff NO puede ver reparaciones de otro tenant.';
END $$;

ROLLBACK;
