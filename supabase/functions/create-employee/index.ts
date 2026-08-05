// @ts-nocheck
// Deno Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers for the Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Admin Client using the Service Role Key
    // This allows us to bypass RLS and use the Admin API (e.g. auth.admin.createUser)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Validate the JWT of the user invoking this function
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: invokerUser }, error: invokerError } = await supabaseAdmin.auth.getUser(token);

    if (invokerError || !invokerUser) {
       return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
         status: 401,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }

    // 3. Verify permissions (must be super_admin or tenant_owner)
    // We check the invoker's profile to see if they have the required role
    const { data: invokerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, tenant_id')
      .eq('id', invokerUser.id)
      .single();

    if (profileError || !invokerProfile) {
      return new Response(JSON.stringify({ error: 'Forbidden: Profile not found' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    // Parse the request payload first to inspect the target role
    const reqBody = await req.json();
    const { email, password, first_name, last_name, role, phone, avatar_url, tenant_id, branch_id } = reqBody;

    const allowedRoles = ['super_admin', 'tenant_owner', 'admin'];
    const isStaffCreatingUser = (invokerProfile.role === 'staff' || invokerProfile.role === 'technician') && role === 'user';
    if (!allowedRoles.includes(invokerProfile.role) && !isStaffCreatingUser) {
       return new Response(JSON.stringify({ error: 'Forbidden: Insufficient permissions to create employees' }), {
         status: 403,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Bad Request: Missing required fields (email, password, role)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. Create the Auth User securely using the Admin API
    // We inject tenant_id and branch_id into user_metadata in case a database trigger requires them.
    // 🛡️ SECURITY FIX: Only super_admin can inject a custom tenant_id. All others are forced to their own.
    let targetTenantId = invokerProfile.tenant_id;
    if (invokerProfile.role === 'super_admin' && tenant_id) {
        targetTenantId = tenant_id;
    }
    
    // 🛡️ SANITIZATION: Prevent trigger failures (Foreign Key or Casting errors)
    if (
      !targetTenantId ||
      targetTenantId === '00000000-0000-0000-0000-000000000000' ||
      targetTenantId === 'undefined' || 
      targetTenantId === 'null'
    ) {
      targetTenantId = null;
    }

    // 🕵️ DEBUG: Validar preventivamente que el tenant exista, para ver si es la llave foránea lo que explota.
    if (targetTenantId) {
      const { data: tenantExists, error: tenantErr } = await supabaseAdmin.from('tenants').select('id').eq('id', targetTenantId).maybeSingle();
      if (tenantErr || !tenantExists) {
        return new Response(JSON.stringify({ 
          error: `CRITICAL DEBUG: El tenant_id '${targetTenantId}' no existe en la tabla tenants. Esto causaría que el Trigger falle por Foreign Key. Error interno: ${tenantErr?.message || 'Not found'}` 
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm the user since it's created by an admin
      user_metadata: {
        first_name,
        last_name,
        full_name: `${first_name || ''} ${last_name || ''}`.trim(),
        role,
        tenant_id: targetTenantId,
        branch_id: branch_id || invokerProfile.branch_id
      }
    });

    if (createError) {
      console.error('Auth Admin Create Error:', createError);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 5. Update the public.profiles record
    // The auth user might have fired a trigger that already created a basic profile row,
    // so we use an upsert to guarantee we set the correct tenant_id and role.
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        role: role,
        phone: phone,
        avatar_url: avatar_url,
        tenant_id: targetTenantId,
        branch_id: branch_id,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (upsertError) {
      console.error('Profile Upsert Error:', upsertError);
      // We don't necessarily delete the user here, but we return a 500 so the admin knows it failed
      return new Response(JSON.stringify({ error: 'User created but failed to sync profile data: ' + upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Success
    return new Response(JSON.stringify({ 
        message: 'Employee created successfully', 
        user: { id: newUser.user.id, email: newUser.user.email } 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Unexpected function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
