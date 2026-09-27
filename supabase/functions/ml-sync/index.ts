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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    // Use service role to bypass RLS in the edge function, or pass JWT from frontend
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { productId, tenantId } = await req.json();

    if (!productId || !tenantId) {
      throw new Error('Missing productId or tenantId');
    }

    // 1. Fetch Tenant ML Config
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('ml_access_token, ml_markup_percentage')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) throw new Error('Tenant not found or error fetching tenant');
    if (!tenant.ml_access_token) throw new Error('Mercado Libre account not connected');

    // 2. Fetch Product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) throw new Error('Product not found');
    if (!product.ml_category_id) throw new Error('Product needs an ML category ID to be synced');

    // 3. Calculate Markup Price
    const markup = tenant.ml_markup_percentage ?? 5;
    const basePrice = product.sale_price ?? product.price;
    const syncedPrice = Math.round(basePrice * (1 + markup / 100));

    // 4. Prepare ML Item Payload
    const mlPayload = {
      title: product.name.substring(0, 60), // ML limit is 60 chars
      category_id: product.ml_category_id,
      price: syncedPrice,
      currency_id: 'ARS',
      available_quantity: product.stock > 0 ? product.stock : 1,
      buying_mode: 'buy_it_now',
      condition: 'new',
      listing_type_id: 'gold_special', // Classic listing
      pictures: product.image_url ? [{ source: product.image_url }] : [], // Additional pictures can be added from gallery_urls
      attributes: [
        {
          id: "ITEM_CONDITION",
          value_name: "Nuevo"
        }
      ]
    };

    // 5. Send to ML API
    let mlResponse;
    if (product.ml_item_id) {
      // Update existing item
      mlResponse = await fetch(`https://api.mercadolibre.com/items/${product.ml_item_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tenant.ml_access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: mlPayload.title,
          price: mlPayload.price,
          available_quantity: mlPayload.available_quantity,
          pictures: mlPayload.pictures
        })
      });
    } else {
      // Create new item
      mlResponse = await fetch('https://api.mercadolibre.com/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tenant.ml_access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mlPayload)
      });
    }

    const mlData = await mlResponse.json();

    if (!mlResponse.ok) {
      // Update sync status to error
      await supabase.from('products').update({ ml_sync_status: 'error' }).eq('id', productId);
      throw new Error(`ML API Error: ${JSON.stringify(mlData)}`);
    }

    // 6. Update Product in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({
        ml_item_id: mlData.id,
        ml_sync_status: 'synced',
        ml_last_sync: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, ml_item_id: mlData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
