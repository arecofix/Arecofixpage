
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// --------------------------------------------------------------------------
// CONFIGURATION
// --------------------------------------------------------------------------
// In production, these should be securely stored in Supabase Secrets.
// For this setup, we use the provided constants.
const META_PIXEL_ID = '1304105440826069';
const META_ACCESS_TOKEN = 'EAARLwIJnO30BQi7b0v1gzDzhx5vZAFNhv1z62sABM1F0YKKueqLcQZBYwebFSXUsZBwWZAXKx9OpQyhqy7yWqZCf8to1mdkJTqXBHcx5gL5xHoJUDUwCFFoJisNtBT2YgCFd3fbZCLz8KR2ZAXUZBuEspQiWNUMYuio6P72vlIsZCz8BbKfQUEIk1ypEED5EH1ijZCAmgPFBMSTQwb0Ss3B0aO4YbrF9L3vSPaBufoge5RlEjpLRQ67zmgVlxGkmDdsRtmx7B1iZCFMoTeZAXaYiEEQ9g91t00UGfAZDZD';
const GRAPH_API_VERSION = 'v19.0';
const TEST_EVENT_CODE = 'TEST71801';

console.log("Meta Events CAPI Function Up!");

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { event_name, user_data, custom_data, event_source_url } = await req.json();

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Construct the CAPI Payload
    const payload = {
      data: [
        {
          event_name: event_name || 'TestEvent',
          event_time: currentTimestamp,
          action_source: 'website',
          event_source_url: event_source_url || 'https://arecofix.com.ar',
          user_data: {
            client_ip_address: user_data?.client_ip_address || req.headers.get('x-forwarded-for') || '0.0.0.0',
            client_user_agent: user_data?.client_user_agent || req.headers.get('user-agent'),
            em: user_data?.em, // Must be hashed SHA256 if not already, assume client sends it hashed or we should hash it
            ph: user_data?.ph,
            ...user_data
          },
          custom_data: custom_data || {},
        },
      ],
      // Include test_event_code only if provided (or hardcoded for dev)
      test_event_code: TEST_EVENT_CODE 
    };

    console.log("Sending Payload to Meta:", JSON.stringify(payload));

    // Send to Meta Graph API
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("Meta Response:", result);

    if (!response.ok) {
      throw new Error(`Meta API Error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
