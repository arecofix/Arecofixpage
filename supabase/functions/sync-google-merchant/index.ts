// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Inicializar Supabase Client con permisos de lectura
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener productos activos y con stock
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, price, sale_price, image_url, category_id, brand_id, stock, slug')
      .eq('is_active', true)
      .gt('stock', 0);

    if (error) throw error;

    const APP_URL = "https://arecofix.com.ar"; // Dominio real
    
    // Construir XML Feed para Google Merchant Center
    let xmlContent = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Arecofix Tech Store</title>
    <link>${APP_URL}</link>
    <description>Catálogo de Repuestos y Tecnología Arecofix</description>
`;

    if (products) {
      products.forEach((product: any) => {
        // Validación de precios y descripciones
        const effectivePrice = product.sale_price ?? product.price;
        const description = product.description ? product.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Producto tecnológico';
        const title = product.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const imageUrl = product.image_url ? product.image_url : `${APP_URL}/assets/img/no-image.png`;
        const link = `${APP_URL}/productos/${product.slug}`;

        xmlContent += `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${effectivePrice} ARS</g:price>
      <g:condition>new</g:condition>
      <g:brand>Arecofix Componentes</g:brand>
    </item>\n`;
      });
    }

    xmlContent += `  </channel>\n</rss>`;

    // Retorna XML Nativo
    return new Response(xmlContent, {
      headers: { ...corsHeaders, 'Content-Type': 'application/xml; charset=utf-8' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
