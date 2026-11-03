-- ==============================================================================
-- Migración Idempotente: Control de Tasa Atómico para Pruebas Gratuitas
-- Archivo: supabase/migrations/20261026000000_trial_rate_limits.sql
-- ==============================================================================

-- 1. Crear tabla trial_rate_limits si no existe
CREATE TABLE IF NOT EXISTS public.trial_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  request_count INT NOT NULL DEFAULT 1
);

-- 2. Habilitar RLS estricto
ALTER TABLE public.trial_rate_limits ENABLE ROW LEVEL SECURITY;

-- 3. Policy explícita exclusiva para service_role (defense-in-depth)
-- Default-deny activo: se prohíbe explícitamente el acceso para anon y authenticated.
DROP POLICY IF EXISTS "service_role_only" ON public.trial_rate_limits;
CREATE POLICY "service_role_only" ON public.trial_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Función RPC atómica para verificación y conteo de límite por IP
CREATE OR REPLACE FUNCTION public.check_trial_rate_limit(
  p_ip_hash TEXT,
  p_limit INT,
  p_window_seconds INT DEFAULT 3600
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_window_start TIMESTAMPTZ;
  v_count INT;
BEGIN
  -- Cleanup probabilístico (~1% de las invocaciones) con LIMIT 100 para evitar lockeos
  IF random() < 0.01 THEN
    DELETE FROM public.trial_rate_limits
    WHERE ip_hash IN (
      SELECT ip_hash FROM public.trial_rate_limits
      WHERE window_start < v_now - INTERVAL '24 hours'
      LIMIT 100
    );
  END IF;

  -- Bloqueo atómico de fila por ip_hash dentro de la transacción
  SELECT window_start, request_count INTO v_window_start, v_count
  FROM public.trial_rate_limits
  WHERE ip_hash = p_ip_hash
  FOR UPDATE;

  -- Si no existe registro o la ventana temporal expiró, reiniciar contador
  IF NOT FOUND OR v_now > (v_window_start + (p_window_seconds || ' seconds')::INTERVAL) THEN
    INSERT INTO public.trial_rate_limits (ip_hash, window_start, request_count)
    VALUES (p_ip_hash, v_now, 1)
    ON CONFLICT (ip_hash) DO UPDATE
      SET window_start = v_now, request_count = 1;
    RETURN TRUE;
  END IF;

  -- Si se alcanzó o superó el límite permitido
  IF v_count >= p_limit THEN
    RETURN FALSE; -- 429 Too Many Requests
  END IF;

  -- Incrementar contador dentro de la ventana vigente
  UPDATE public.trial_rate_limits
  SET request_count = request_count + 1
  WHERE ip_hash = p_ip_hash;

  RETURN TRUE;
END;
$$;
