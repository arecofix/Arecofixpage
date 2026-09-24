// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: any;
  old_record: any;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase configuration");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let tenantId = payload.record?.tenant_id;
    if (!tenantId) {
        return new Response(JSON.stringify({ success: true, message: "No tenant_id found in record." }), { headers: corsHeaders, status: 200 });
    }

    // 1. Obtener datos del Tenant y configuración de WhatsApp
    const { data: tenantData, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .select('whatsapp_access_token, whatsapp_phone_id, whatsapp_enabled, name')
        .eq('id', tenantId)
        .single();

    if (tenantError || !tenantData || !tenantData.whatsapp_enabled) {
        console.log(`WhatsApp disabled or not configured for tenant ${tenantId}`);
        return new Response(JSON.stringify({ success: true, message: "WhatsApp not enabled." }), { headers: corsHeaders, status: 200 });
    }

    const WHATSAPP_TOKEN = tenantData.whatsapp_access_token;
    const WHATSAPP_PHONE_ID = tenantData.whatsapp_phone_id;

    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
        console.log(`Missing WhatsApp credentials for tenant ${tenantId}`);
        return new Response(JSON.stringify({ success: true, message: "Missing credentials." }), { headers: corsHeaders, status: 200 });
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
    
    let phoneNumberToNotify = '';
    let templateName = '';
    let templateVariables: string[] = [];

    // 2. Lógica específica por tabla
    if (payload.table === 'repair_status_history' && payload.type === 'INSERT') {
        const repairId = payload.record.repair_id;
        const statusTypeId = payload.record.status_type_id;

        // Obtener la reparación para saber el cliente y el dispositivo
        const { data: repairData } = await supabaseAdmin
            .from('repairs')
            .select(`
                tracking_code, 
                whatsapp_notifications,
                client:client_id (
                    first_name, 
                    last_name, 
                    phone
                ),
                device:device_id (
                    brand:brand_id (name),
                    model:model_id (name)
                )
            `)
            .eq('id', repairId)
            .single();

        if (!repairData || !repairData.client || !repairData.client.phone || !repairData.whatsapp_notifications) {
            console.log("No valid client phone or notifications disabled for this repair.");
            return new Response(JSON.stringify({ success: true, message: "Not notifying." }), { headers: corsHeaders, status: 200 });
        }

        phoneNumberToNotify = repairData.client.phone;
        
        // Obtener el nombre del estado
        const { data: statusData } = await supabaseAdmin
            .from('repair_status_types')
            .select('name')
            .eq('id', statusTypeId)
            .single();

        const statusName = statusData?.name || 'Actualizado';

        templateName = 'repair_status_update'; 
        // Parámetros: [Nombre Cliente, Código Reparación, Nuevo Estado]
        templateVariables = [
            repairData.client.first_name || 'Cliente', 
            repairData.tracking_code || '---', 
            statusName
        ];
    } 
    else if (payload.table === 'orders' && payload.type === 'UPDATE') {
        // Enviar solo si cambió el status
        if (payload.record.status === payload.old_record.status) {
            return new Response(JSON.stringify({ success: true, message: "Status unchanged." }), { headers: corsHeaders, status: 200 });
        }

        const newStatus = payload.record.status;
        phoneNumberToNotify = payload.record.customer_phone;

        if (!phoneNumberToNotify) {
            console.log("No customer phone in order.");
            return new Response(JSON.stringify({ success: true, message: "Not notifying." }), { headers: corsHeaders, status: 200 });
        }

        templateName = 'order_status_update';
        // Parámetros: [Nombre Cliente, Número de Orden, Nuevo Estado]
        templateVariables = [
            payload.record.customer_name || 'Cliente', 
            payload.record.order_number || '---', 
            newStatus
        ];
    } else {
        return new Response(JSON.stringify({ success: true, message: "Table/Action not mapped for notifications." }), { headers: corsHeaders, status: 200 });
    }

    // 3. Enviar a Meta API
    const formatPhone = phoneNumberToNotify.replace(/\D/g, ''); 

    const messageBody = {
        messaging_product: "whatsapp",
        to: formatPhone,
        type: "template",
        template: {
            name: templateName,
            language: {
                code: "es_AR" // Idioma por defecto de las plantillas (puede ser parametrizable)
            },
            components: templateVariables.length > 0 ? [
                {
                    type: "body",
                    parameters: templateVariables.map(v => ({ type: "text", text: v }))
                }
            ] : []
        }
    };

    const apiResp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageBody)
    });

    const responseJSON = await apiResp.json();

    if (!apiResp.ok) {
        console.error("Meta API Error:", responseJSON);
        throw new Error("Failed to send WhatsApp message");
    }

    return new Response(JSON.stringify({ success: true, data: responseJSON }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
    });
  }
});
