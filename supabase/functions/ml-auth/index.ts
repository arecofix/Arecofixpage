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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const tenantId = url.searchParams.get('state');

    if (!code || !tenantId) {
      throw new Error('Missing code or state (tenant_id) parameter');
    }

    const APP_ID = Deno.env.get('ML_APP_ID');
    const CLIENT_SECRET = Deno.env.get('ML_CLIENT_SECRET');
    const REDIRECT_URI = Deno.env.get('ML_REDIRECT_URI'); // This function's URL

    if (!APP_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error('Mercado Libre credentials not configured in Edge Function secrets');
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Error from ML: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save tokens in tenant table
    const { error: updateError } = await supabase
      .from('tenants')
      .update({
        ml_access_token: tokenData.access_token,
        ml_refresh_token: tokenData.refresh_token,
        ml_user_id: tokenData.user_id,
        ml_expires_in: tokenData.expires_in,
        ml_token_updated_at: new Date().toISOString()
      })
      .eq('id', tenantId);

    if (updateError) throw updateError;

    // Redirect to frontend success page
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:4200';
    return Response.redirect(`${frontendUrl}/admin/company?ml_connected=true`, 302);

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
