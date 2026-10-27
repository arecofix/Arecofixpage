-- 1. Agregar columnas faltantes a la tabla products (Respetando lo existente)
ALTER TABLE public.products
-- Ofertas (usamos tu sale_price existente)
ADD COLUMN IF NOT EXISTS offer_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS offer_end_date timestamp with time zone,
-- Logística e Impuestos
ADD COLUMN IF NOT EXISTS warranty_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_percentage numeric DEFAULT 21,
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0}'::jsonb,
-- Marketing (SEO y Cross-selling)
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS cross_sell_products uuid[] DEFAULT '{}';


-- 2. Crear la tabla relacional para las Variantes
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  name text NOT NULL, -- Ej: "Rojo", "XL", "Predeterminada"
  sku text,
  barcode text,
  price numeric, -- Precio de la variante (opcional, por si cuesta distinto al base)
  stock integer DEFAULT 0,
  attributes jsonb DEFAULT '{}'::jsonb, -- Ej: {"color": "Rojo", "size": "XL"}
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT product_variants_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);


-- 3. Habilitar Seguridad de Nivel de Fila (RLS) para la nueva tabla (CRÍTICO)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their own product variants" 
  ON public.product_variants FOR SELECT 
  USING (tenant_id = get_my_tenant() OR get_my_tenant() IS NULL);

CREATE POLICY "Tenants can insert their own product variants" 
  ON public.product_variants FOR INSERT 
  WITH CHECK (tenant_id = get_my_tenant());

CREATE POLICY "Tenants can update their own product variants" 
  ON public.product_variants FOR UPDATE 
  USING (tenant_id = get_my_tenant());

CREATE POLICY "Tenants can delete their own product variants" 
  ON public.product_variants FOR DELETE 
  USING (tenant_id = get_my_tenant());


-- 4. Script de Sincronización/Migración de Datos
-- Crea una variante "Predeterminada" para no perder el stock/precio actual
INSERT INTO public.product_variants (
  product_id,
  tenant_id,
  name,
  sku,
  barcode,
  price,
  stock,
  attributes
)
SELECT 
  id as product_id,
  tenant_id,
  'Predeterminada' as name,
  sku,
  barcode,
  price,
  COALESCE(stock, 0) as stock,
  '{"color": "N/A"}'::jsonb as attributes
FROM public.products
WHERE id NOT IN (SELECT product_id FROM public.product_variants);
