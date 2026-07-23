-- 20260723_add_total_units_sold_to_products.sql
-- ==============================================================================
-- Agrega la columna de seguimiento de ventas reales a la tabla products
-- ==============================================================================

BEGIN;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS total_units_sold integer DEFAULT 0;

-- Opcional: Crear un Ã­ndice para optimizar la consulta de "Top Sellers"
CREATE INDEX IF NOT EXISTS idx_products_total_units_sold 
ON public.products (total_units_sold DESC);

COMMIT;

-- Función para incrementar ventas atómicamente
CREATE OR REPLACE FUNCTION increment_product_sales(p_product_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $
BEGIN
  UPDATE public.products
  SET total_units_sold = COALESCE(total_units_sold, 0) + amount
  WHERE id = p_product_id;
END;
$;

