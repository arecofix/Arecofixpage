import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { orderId, items, shippingCost } = body;

    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') || 'APP_USR-8491686631401074-110201-8ea65d98ac8d5ed52e03deef65d84b77-374364423';

    // Map each item from the cart
    const mpItems = items.map((item: any) => ({
      id: item.product_id,
      title: item.product_name,
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      unit_price: Number(item.unit_price) > 0 ? Number(Number(item.unit_price).toFixed(2)) : 0.01,
      currency_id: 'ARS'
    }));

    // Add shipping as a separate item if applicable
    if (Number(shippingCost) > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Costo de envío',
        quantity: 1,
        unit_price: Number(Number(shippingCost).toFixed(2)),
        currency_id: 'ARS'
      });
    }

    const mpBody = {
      items: mpItems,
      external_reference: String(orderId)
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mpBody)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('MercadoPago Error:', data);
      // Return 200 so Supabase JS client doesn't hide the error body
      return new Response(JSON.stringify({ success: false, error: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, init_point: data.init_point, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
