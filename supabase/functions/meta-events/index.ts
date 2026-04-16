// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// DTO from Angular Client
interface MetaEventPayload {
  eventName: string; // 'Purchase', 'AddToCart', 'ViewContent'
  eventTime?: number;
  userData: {
    email?: string;
    phone?: string;
    fbp?: string; // Facebook Browser ID
    fbc?: string; // Facebook Click ID
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
  customData: {
    value?: number;
    currency?: string;
    contentIds?: string[];
    contentType?: string;
  };
  eventSourceUrl?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: MetaEventPayload = await req.json();

    const META_ACCESS_TOKEN = Deno.env.get('META_API_ACCESS_TOKEN');
    const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID');

    if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
      throw new Error("Missing Meta Conversions API credentials in Supabase Environment Variables");
    }

    // Funciones de Hashing Seguro (Requerido rigurosamente por Meta CAPI)
    const hashData = async (data: string) => {
        const msgUint8 = new TextEncoder().encode(data.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Estructurar el User Data Hacheado
    const hashedUserData: any = {};
    if (payload.userData.email) hashedUserData.em = [await hashData(payload.userData.email)];
    if (payload.userData.phone) hashedUserData.ph = [await hashData(payload.userData.phone)];
    if (payload.userData.clientIpAddress) hashedUserData.client_ip_address = payload.userData.clientIpAddress;
    if (payload.userData.clientUserAgent) hashedUserData.client_user_agent = payload.userData.clientUserAgent;
    if (payload.userData.fbp) hashedUserData.fbp = payload.userData.fbp;
    if (payload.userData.fbc) hashedUserData.fbc = payload.userData.fbc;

    // Body a inyectar en el Graph API de Meta
    const graphData = {
      data: [{
        event_name: payload.eventName,
        event_time: payload.eventTime || Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: payload.eventSourceUrl || "https://arecofix.com.ar",
        user_data: hashedUserData,
        custom_data: {
          value: payload.customData.value,
          currency: payload.customData.currency || "ARS",
          content_ids: payload.customData.contentIds,
          content_type: payload.customData.contentType || "product"
        }
      }]
    };

    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphData)
    });

    const responseJSON = await fbRes.json();
    
    if (!fbRes.ok) {
        console.error("Meta Graph API Error", responseJSON);
        throw new Error(JSON.stringify(responseJSON));
    }

    return new Response(JSON.stringify({ success: true, metaResponse: responseJSON }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Meta Event processing error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
