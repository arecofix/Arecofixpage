// @ts-nocheck
// Deno Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers for the Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate random password (12 chars, mixed)
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function generateSlug(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, businessName, userName, subtitle, whatsapp, currency, logo_url } = await req.json();

    if (!email || !businessName || !whatsapp) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email or whatsapp already exist in profiles
    const { data: existingProfiles, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('id, email, phone')
      .or(`email.eq.${email},phone.eq.${whatsapp}`);

    if (profileErr) throw profileErr;

    if (existingProfiles && existingProfiles.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Ya existe una cuenta o prueba gratuita registrada con este correo o WhatsApp.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Create Tenant (72h trial)
    const tenantSlug = generateSlug(businessName);
    const trialExpiresAt = new Date();
    trialExpiresAt.setHours(trialExpiresAt.getHours() + 72);

    const { data: tenant, error: tenantErr } = await supabaseAdmin
      .from('tenants')
      .insert({
        name: businessName,
        slug: tenantSlug,
        plan_type: 'basic',
        is_active: true,
        currency: currency || 'ARS',
        tax_percentage: 21,
        contact_email: email,
        contact_phone: whatsapp,
        branding_settings: {
          logo_url: logo_url || null,
          company_name: businessName,
          whatsapp: whatsapp,
          subtitle: subtitle
        }
      })
      .select()
      .single();

    if (tenantErr) {
        console.error("Tenant insertion error:", tenantErr);
        throw tenantErr;
    }

    // 2. Create Branch
    const branchSlug = generateSlug(businessName);
    const { data: branch, error: branchErr } = await supabaseAdmin
      .from('branches')
      .insert({
        tenant_id: tenant.id,
        name: businessName,
        slug: branchSlug,
        is_active: true,
        address: 'Dirección por definir',
        contact_phone: whatsapp
      })
      .select()
      .single();

    if (branchErr) {
        // Rollback tenant
        await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
        throw branchErr;
    }

    // 3. Create Auth User with must_change_password flag
    const generatedPassword = generatePassword();
    const ownerName = userName || businessName + ' Admin';

    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        tenant_id: tenant.id,
        branch_id: branch.id,
        role: 'tenant_owner',
        full_name: ownerName,
        must_change_password: true
      }
    });

    if (authErr) {
        // Rollback branch & tenant
        await supabaseAdmin.from('branches').delete().eq('id', branch.id);
        await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
        throw authErr;
    }

    const userId = authUser.user.id;

    // 4. Create Profile (upsert – may be auto-created by trigger)
    const { error: updateProfileErr } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        tenant_id: tenant.id,
        branch_id: branch.id,
        role: 'tenant_owner',
        email: email,
        full_name: ownerName,
        phone: whatsapp,
        is_active: true,
        must_change_password: true
      });

    if (updateProfileErr) console.warn("Could not upsert profile (might be created by trigger):", updateProfileErr);

    // 5. Create admin notification so the super admin is alerted
    const notificationPayload = {
      tenant_id: null,           // system-level: no tenant isolation
      user_id: null,             // broadcast to all super admins
      scope: 'admin',
      type: 'info',
      title: '🆕 Nueva Prueba Gratuita Registrada',
      message: `${ownerName} (${businessName}) se registró con el email ${email}. WhatsApp: ${whatsapp}.`,
      is_read: false,
      payload: {
        route: '/admin/branches',
        tenant_id: tenant.id,
        branch_id: branch.id,
        business_name: businessName,
        owner_name: ownerName,
        owner_email: email,
        owner_whatsapp: whatsapp,
        logo_url: logo_url || null
      }
    };

    const { error: notifErr } = await supabaseAdmin
      .from('notifications')
      .insert(notificationPayload);

    if (notifErr) {
      // Non-critical: log but don't fail the request
      console.warn("Could not create admin notification:", notifErr.message);
    }

    return new Response(
      JSON.stringify({ 
          success: true, 
          message: 'Prueba gratuita creada con éxito.',
          credentials: {
              email: email,
              password: generatedPassword
          },
          tenantId: tenant.id,
          branchId: branch.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating trial:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
