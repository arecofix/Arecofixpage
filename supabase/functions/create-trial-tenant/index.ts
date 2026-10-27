// @ts-nocheck
// Deno Edge Function: create-trial-tenant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers for the Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-test-secret',
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
    // --------------------------------------------------------------------------
    // 1. IP Extraction & Fail-CLOSED (Anti-DoS)
    // --------------------------------------------------------------------------
    const clientIp = req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0].trim();

    if (!clientIp) {
      return new Response(
        JSON.stringify({ error: 'Origen no identificable.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --------------------------------------------------------------------------
    // 2. Rate Limiting Check (Cheapest, in DB via atomic RPC)
    // --------------------------------------------------------------------------
    const RATE_LIMIT_PER_HOUR = Number(Deno.env.get('RATE_LIMIT_PER_HOUR') || '5');

    // SHA-256 IP Hash for privacy
    const encoder = new TextEncoder();
    const ipData = encoder.encode(clientIp);
    const hashBuffer = await crypto.subtle.digest('SHA-256', ipData);
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const { data: isAllowed, error: rateLimitErr } = await supabaseAdmin.rpc(
      'check_trial_rate_limit',
      {
        p_ip_hash: ipHash,
        p_limit: RATE_LIMIT_PER_HOUR,
        p_window_seconds: 3600
      }
    );

    // Fail-CLOSED on RPC error
    if (rateLimitErr) {
      console.error('[RateLimit RPC Error]', rateLimitErr);
      return new Response(
        JSON.stringify({ error: 'Servicio temporalmente no disponible.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isAllowed === false) {
      return new Response(
        JSON.stringify({ error: 'Límite de solicitudes de prueba gratuita excedido. Por favor intente más tarde.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse Request Body
    const body = await req.json().catch(() => ({}));

    // --------------------------------------------------------------------------
    // 3. Cloudflare Turnstile Verification (Anti-bot)
    // --------------------------------------------------------------------------
    // Test mode bypass: strictly conditioned with NODE_ENV as first short-circuit
    const isTestBypass =
      Deno.env.get('NODE_ENV') === 'test' &&
      Boolean(Deno.env.get('TEST_SECRET')) &&
      req.headers.get('x-test-secret') === Deno.env.get('TEST_SECRET');

    if (!isTestBypass) {
      const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
      if (!turnstileSecret) {
        console.error('[Turnstile Config Error] TURNSTILE_SECRET_KEY no configurado.');
        return new Response(
          JSON.stringify({ error: 'Configuración de seguridad incompleta en el servidor.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const turnstileToken = body['cf-turnstile-response'] || body['turnstileToken'] || body['turnstile_token'];

      if (!turnstileToken || typeof turnstileToken !== 'string' || turnstileToken.length > 2048) {
        return new Response(
          JSON.stringify({ error: 'Verificación de captcha requerida.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      let verifyRes: Response;
      try {
        verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: AbortSignal.timeout(10_000),
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: clientIp,
          }),
        });
      } catch (networkErr: unknown) {
        console.error('[Turnstile Network Error]', networkErr);
        return new Response(
          JSON.stringify({ error: 'Servicio de verificación temporalmente no disponible.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!verifyRes.ok) {
        console.error('[Turnstile 5xx Response]', verifyRes.status);
        return new Response(
          JSON.stringify({ error: 'Servicio de verificación no disponible.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn('[Turnstile Token Invalid]', verifyData['error-codes']);
        return new Response(
          JSON.stringify({ error: 'Verificación de captcha fallida o token inválido.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (verifyData.action && verifyData.action !== 'trial_signup') {
        console.warn('[Turnstile Action Mismatch]', verifyData.action);
        return new Response(
          JSON.stringify({ error: 'Acción de captcha no autorizada.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const allowedHostnames = Deno.env.get('TURNSTILE_HOSTNAMES');
      if (allowedHostnames) {
        const hostnames = new Set(allowedHostnames.split(',').map(h => h.trim().toLowerCase()).filter(Boolean));
        if (verifyData.hostname && !hostnames.has(verifyData.hostname.toLowerCase())) {
          console.warn('[Turnstile Hostname Mismatch]', verifyData.hostname, 'Allowed:', [...hostnames]);
          return new Response(
            JSON.stringify({ error: 'Dominio de captcha no autorizado.' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // --------------------------------------------------------------------------
    // 4. Input Validation (Format & required fields)
    // --------------------------------------------------------------------------
    const { email, businessName, userName, subtitle, whatsapp, currency, logo_url } = body;

    if (!email || !businessName || !whatsapp) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(whatsapp).trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: 'Formato de correo electrónico inválido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ error: 'Formato de WhatsApp inválido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --------------------------------------------------------------------------
    // 5. Sanitized Database Queries (.or() eradicated -> parameterized .eq())
    // --------------------------------------------------------------------------
    const { data: emailProfiles, error: emailErr } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .limit(1);

    if (emailErr) throw emailErr;

    const { data: phoneProfiles, error: phoneErr } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('phone', cleanPhone)
      .limit(1);

    if (phoneErr) throw phoneErr;

    if ((emailProfiles && emailProfiles.length > 0) || (phoneProfiles && phoneProfiles.length > 0)) {
      return new Response(
        JSON.stringify({ error: 'Ya existe una cuenta o prueba gratuita registrada con este correo o WhatsApp.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --------------------------------------------------------------------------
    // 6. Expensive Operations (Tenant, Branch, Auth User provisioning)
    // --------------------------------------------------------------------------
    // 6.1 Create Tenant (72h trial)
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
        contact_email: cleanEmail,
        contact_phone: cleanPhone,
        branding_settings: {
          logo_url: logo_url || null,
          company_name: businessName,
          whatsapp: cleanPhone,
          subtitle: subtitle
        }
      })
      .select()
      .single();

    if (tenantErr) {
      console.error("Tenant insertion error:", tenantErr);
      throw tenantErr;
    }

    // 6.2 Create Branch
    const branchSlug = generateSlug(businessName);
    const { data: branch, error: branchErr } = await supabaseAdmin
      .from('branches')
      .insert({
        tenant_id: tenant.id,
        name: businessName,
        slug: branchSlug,
        is_active: true,
        address: 'Dirección por definir',
        contact_phone: cleanPhone
      })
      .select()
      .single();

    if (branchErr) {
      // Rollback tenant
      await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
      throw branchErr;
    }

    // 6.3 Create Auth User with must_change_password flag
    const generatedPassword = generatePassword();
    const ownerName = userName || businessName + ' Admin';

    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
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

    // Link the owner to the tenant
    await supabaseAdmin.from('tenants').update({ owner_id: userId }).eq('id', tenant.id);

    // 6.4 Create/Upsert Profile
    const { error: updateProfileErr } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        tenant_id: tenant.id,
        branch_id: branch.id,
        role: 'tenant_owner',
        email: cleanEmail,
        full_name: ownerName,
        phone: cleanPhone,
        is_active: true,
        must_change_password: true
      });

    if (updateProfileErr) console.warn("Could not upsert profile (might be created by trigger):", updateProfileErr);

    // 6.5 Create admin notification
    const notificationPayload = {
      tenant_id: null,
      user_id: null,
      scope: 'admin',
      type: 'info',
      title: '🆕 Nueva Prueba Gratuita Registrada',
      message: `${ownerName} (${businessName}) se registró con el email ${cleanEmail}. WhatsApp: ${cleanPhone}.`,
      is_read: false,
      payload: {
        route: '/admin/branches',
        tenant_id: tenant.id,
        branch_id: branch.id,
        business_name: businessName,
        owner_name: ownerName,
        owner_email: cleanEmail,
        owner_whatsapp: cleanPhone,
        logo_url: logo_url || null
      }
    };

    const { error: notifErr } = await supabaseAdmin
      .from('notifications')
      .insert(notificationPayload);

    if (notifErr) {
      console.warn("Could not create admin notification:", notifErr.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prueba gratuita creada con éxito.',
        credentials: {
          email: cleanEmail,
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
