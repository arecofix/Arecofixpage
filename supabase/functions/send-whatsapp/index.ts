// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const payload: MassMessagePayload = await req.json();

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');
    
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
        throw new Error("Missing WhatsApp API Configuration in environment variables.");
    }

    // Inicializar Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    let recipients: string[] = [];

    // Recolectar a quienes se les enviará
    if (payload.testNumber) {
        recipients.push(payload.testNumber);
    } else if (payload.targetType === 'suppliers') {
        const { data: suppliers, error } = await supabase.from('suppliers').select('phone').eq('is_active', true);
        if (error) throw error;
        recipients = suppliers.map((s: any) => s.phone).filter((p: any) => !!p);
    } else {
        const { data: clients, error } = await supabase.from('profiles').select('phone').eq('is_active', true).eq('role', 'user');
        if (error) throw error;
        recipients = clients.map((c: any) => c.phone).filter((p: any) => !!p);
    }

    if (recipients.length === 0) {
        return new Response(JSON.stringify({ success: true, message: "No recipients found to send." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Enviar batch a Meta (Se procesan en serie o batches pequeños para no saturar API Rate Limits)
    // Para gran escala usar una cola/queue nativa de Supabase, aquí ilustramos envío directo
    for (const phone of recipients) {
        // Limpiamos formato. WhatsApp API exige prefijo ej. 54 en Argentina sin +
        const formatPhone = phone.replace(/\D/g, ''); 

        const messageBody = {
            messaging_product: "whatsapp",
            to: formatPhone,
            type: "template",
            template: {
                name: payload.messageTemplate,
                language: {
                    code: payload.templateLanguage
                },
                components: payload.variables ? [
                  {
                    type: "body",
                    parameters: payload.variables.map((v: any) => ({ type: "text", text: v }))
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
