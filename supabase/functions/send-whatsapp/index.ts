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

interface MassMessagePayload {
  tenant_id: string; // REQUERIDO
  targetType: 'suppliers' | 'clients';
  messageTemplate: string;
  templateLanguage: string;
  variables?: string[];
  testNumber?: string;
}

interface DirectMessagePayload {
  tenant_id: string; // REQUERIDO
  to: string;
  type: string;
  template?: any;
  text?: any;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json();

    const tenantId = payload.tenant_id;
    if (!tenantId) {
        throw new Error("Missing tenant_id in payload.");
    }

    // Inicializar Supabase Client con Service Role para leer credenciales del tenant
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener credenciales de Meta del tenant
    const { data: tenantData, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .select('whatsapp_access_token, whatsapp_phone_id, whatsapp_enabled')
        .eq('id', tenantId)
        .single();

    if (tenantError || !tenantData) {
        throw new Error("Tenant not found or error retrieving tenant data.");
    }

    if (!tenantData.whatsapp_enabled) {
        throw new Error("WhatsApp integration is not enabled for this tenant.");
    }

    const WHATSAPP_TOKEN = tenantData.whatsapp_access_token;
    const WHATSAPP_PHONE_ID = tenantData.whatsapp_phone_id;
    
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
        throw new Error("Missing WhatsApp API Configuration for this tenant.");
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;

    // ----------------------------------------------------
    // FORMATO 1: Envío Directo (desde whatsapp.service.ts)
    // ----------------------------------------------------
    if (payload.to && payload.type) {
        const directPayload = payload as DirectMessagePayload;
        const formatPhone = directPayload.to.replace(/\D/g, '');
        
        const messageBody = {
            messaging_product: "whatsapp",
            to: formatPhone,
            type: directPayload.type,
            ...(directPayload.type === 'template' ? { template: directPayload.template } : {}),
            ...(directPayload.type === 'text' ? { text: directPayload.text } : {})
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
    
    let recipients: string[] = [];

    // Recolectar a quienes se les enviará
    if (massPayload.testNumber) {
        recipients.push(massPayload.testNumber);
    } else if (massPayload.targetType === 'suppliers') {
        const { data: suppliers, error } = await supabaseAdmin.from('suppliers').select('phone').eq('is_active', true).eq('tenant_id', tenantId);
        if (error) throw error;
        recipients = suppliers.map((s: any) => s.phone).filter((p: any) => !!p);
    } else if (massPayload.targetType === 'clients') {
        const { data: clients, error } = await supabaseAdmin.from('profiles').select('phone').eq('is_active', true).eq('role', 'user').eq('tenant_id', tenantId);
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
