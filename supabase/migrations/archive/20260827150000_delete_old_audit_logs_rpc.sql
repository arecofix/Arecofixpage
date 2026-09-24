-- Función para eliminar logs de auditoría antiguos
-- Se ejecuta con SECURITY DEFINER para saltar RLS cuando es llamada por el rol de servicio

CREATE OR REPLACE FUNCTION delete_old_audit_logs(end_date TIMESTAMP)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM audit_logs WHERE created_at < end_date;
END;
$$;
