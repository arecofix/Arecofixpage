-- Solución Definitiva y Segura para Supabase (Sin errores de permisos)
-- Reemplaza la función que usa todas tus tablas en la columna "DEFAULT get_my_tenant()"
-- para que cuando PostgREST no envíe la variable 'app.current_tenant', devuelva NULL
-- de forma silenciosa en lugar de arrojar el error 42704.

CREATE OR REPLACE FUNCTION public.get_my_tenant() 
RETURNS uuid AS $$
DECLARE
  tenant_val text;
BEGIN
  -- IMPORTANTE: El parámetro 'true' hace que PostgreSQL ignore la ausencia de la variable
  tenant_val := current_setting('app.current_tenant', true);
  
  IF tenant_val IS NULL OR tenant_val = '' THEN
    RETURN NULL;
  END IF;

  RETURN tenant_val::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;
