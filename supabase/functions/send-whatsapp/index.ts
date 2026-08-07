// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

// DTO del cliente Angular
interface MassMessagePayload {
  targetType: 'suppliers' | 'clients';
  messageTemplate: string;
  templateLanguage: string; // Ej: 'es_AR'
  variables?: string[];
  testNumber?: string; // Para enviar prueba a 1 solo numero
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json();

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');
    
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
        throw new Error("Missing WhatsApp API Configuration in environment variables.");
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;

    // ----------------------------------------------------
    // FORMATO 1: Envío Directo (desde whatsapp.service.ts)
    // ----------------------------------------------------
    if (payload.to && payload.type) {
        const formatPhone = payload.to.replace(/\D/g, '');
        
        const messageBody = {
            messaging_product: "whatsapp",
            to: formatPhone,
            type: payload.type,
            ...(payload.type === 'template' ? { template: payload.template } : {}),
            ...(payload.type === 'text' ? { text: payload.text } : {})
        };

        const apiResp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageBody)
        });

        const respData = await apiResp.json();

        if (apiResp.ok) {
            return new Response(JSON.stringify({ success: true, data: respData }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ success: false, error: respData }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }
    }

    // ----------------------------------------------------
    // FORMATO 2: Envío Masivo (MassMessagePayload)
    // ----------------------------------------------------
    const massPayload = payload as MassMessagePayload;
    
    // Inicializar Supabase Client para consultas a BDD
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    let recipients: string[] = [];

    // Recolectar a quienes se les enviará
    if (massPayload.testNumber) {
        recipients.push(massPayload.testNumber);
    } else if (massPayload.targetType === 'suppliers') {
        const { data: suppliers, error } = await supabase.from('suppliers').select('phone').eq('is_active', true);
        if (error) throw error;
        recipients = suppliers.map((s: any) => s.phone).filter((p: any) => !!p);
    } else if (massPayload.targetType === 'clients') {
        const { data: clients, error } = await supabase.from('profiles').select('phone').eq('is_active', true).eq('role', 'user');
        if (error) throw error;
        recipients = clients.map((c: any) => c.phone).filter((p: any) => !!p);
    } else {
        throw new Error("Invalid payload format.");
    }

    if (recipients.length === 0) {
        return new Response(JSON.stringify({ success: true, message: "No recipients found to send." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const phone of recipients) {
        const formatPhone = phone.replace(/\D/g, ''); 

        const messageBody = {
            messaging_product: "whatsapp",
            to: formatPhone,
            type: "template",
            template: {
                name: massPayload.messageTemplate,
                language: {
                    code: massPayload.templateLanguage
                },
                components: massPayload.variables ? [
                  {
                    type: "body",
                    parameters: massPayload.variables.map((v: any) => ({ type: "text", text: v }))
                  }
                ] : []
            }
        };

        try {
            const apiResp = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageBody)
            });

            if (apiResp.ok) {
                successCount++;
                results.push({ phone: formatPhone, status: 'sent' });
            } else {
                errorCount++;
                results.push({ phone: formatPhone, status: 'failed', error: await apiResp.json() });
            }
        } catch (e: any) {
            errorCount++;
            results.push({ phone: formatPhone, status: 'network_fail', error: e.toString() });
        }
    }

    return new Response(JSON.stringify({ 
        success: true, 
        summary: { total: recipients.length, successful: successCount, failed: errorCount },
        details: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
