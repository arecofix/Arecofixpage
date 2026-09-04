// ─── Shared mock data ────────────────────────────────────────────────────────

const ARECOFIX_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

const MOCK_TENANT = {
  id: ARECOFIX_TENANT_ID,
  name: 'Arecofix Central',
  slug: 'arecofix',
  is_active: true,
  plan_type: 'premium',
  currency: 'ARS',
  usd_rate: 1,
  tax_percentage: 21,
  custom_domain: null,
  branding_settings: { primary_color: '#3b82f6' }
};

const MOCK_PROFILE = {
  id: 'super-admin-id',
  email: 'admin@arecofix.com',  // must match the JWT user email
  role: 'super_admin',          // triggers isSuperAdmin.set(true) in AuthService
  is_active: true,
  tenant_id: ARECOFIX_TENANT_ID,
  branch_id: null,
  first_name: 'Super',
  last_name: 'Admin'
};

const MOCK_BRANCHES = [
  { id: 'branch-1', tenant_id: ARECOFIX_TENANT_ID, name: 'Sede Central',    city: 'Buenos Aires', slug: null },
  { id: 'branch-2', tenant_id: ARECOFIX_TENANT_ID, name: 'Sede Secundaria', city: 'Rosario',      slug: null }
];

// ─── visitWithAuth ────────────────────────────────────────────────────────────
/**
 * Sets up a mock Supabase session + profile in localStorage **before** Angular
 * bootstraps, then navigates to the given URL.
 *
 * Key points:
 *  - The Supabase client reads the session from localStorage on init.
 *  - AuthService.ensureProfile reads the profile from localStorage when
 *    navigator.onLine is false, but in CI the app IS online so we also need a
 *    proper Cypress intercept for the REST call (set up in beforeEach).
 *  - user_metadata.role='super_admin' is checked by roleGuard via authState.user.
 */
function visitWithAuth(url: string) {
  cy.visit(url, {
    onBeforeLoad: (win) => {
      const mockSession = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoic3VwZXItYWRtaW4taWQifQ.signature',
        expires_in:   3600,
        expires_at:   Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        token_type:   'bearer',
        user: {
          id:                 'super-admin-id',
          aud:                'authenticated',
          role:               'authenticated',
          email:              'admin@arecofix.com',
          email_confirmed_at: new Date().toISOString(),
          app_metadata:       { provider: 'email', providers: ['email'] },
          user_metadata:      { role: 'super_admin' },  // used by roleGuard
          identities:         [],
          created_at:         new Date().toISOString(),
          updated_at:         new Date().toISOString()
        }
      };

      win.localStorage.setItem('sb-db-auth-token', JSON.stringify(mockSession));
      win.localStorage.setItem('supabase-remember-me', 'true');
      // Cache profile so AuthService can read it (online mode reads from Supabase, but the
      // interceptor below also covers that path)
      win.localStorage.setItem(`arecofix_profile_super-admin-id`, JSON.stringify(MOCK_PROFILE));
      win.localStorage.setItem('arecofix_tenant_id', ARECOFIX_TENANT_ID);
      win.localStorage.setItem('cypress-test', 'true');
    }
  });
}

// ─── Describe block ───────────────────────────────────────────────────────────

describe('Admin Tenant Flow (Multi-tenant & RLS Isolation)', () => {

  beforeEach(() => {
    // ── Auth ──────────────────────────────────────────────────────────────────
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: 'super-admin-id', email: 'admin@arecofix.com' }
    }).as('getUser');

    // ── Profiles ──────────────────────────────────────────────────────────────
    // Return a full profile so AuthService sets isSuperAdmin = true.
    // The global e2e.ts intercept also modifies profile responses, so we
    // override here with a static response that wins (last-registered wins in Cypress).
    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: [MOCK_PROFILE]
    }).as('getProfile');

    // ── Tenants ───────────────────────────────────────────────────────────────
    // TenantService uses .maybeSingle() which expects at most ONE row.
    // We mock each lookup separately so the right shape is returned.

    // 1. custom_domain lookup → localhost has no custom-domain tenant → empty
    cy.intercept('GET', '**/rest/v1/tenants?*custom_domain*', {
      statusCode: 200,
      body: []
    });

    // 2. slug lookup → return the one Arecofix tenant
    cy.intercept('GET', '**/rest/v1/tenants?*slug*', {
      statusCode: 200,
      body: [MOCK_TENANT]
    });

    // 3. General / fallback (list queries, limit=1, etc.)
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [MOCK_TENANT]
    }).as('getTenants');

    // ── Branches ──────────────────────────────────────────────────────────────
    // Slugs are nulled so AdminLayout won't prepend a slug to admin URLs.
    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      body: MOCK_BRANCHES
    }).as('getBranches');
  });

  // ── Test 1: create new tenant ───────────────────────────────────────────────

  it('debería permitir al Super Admin crear un nuevo tenant', () => {
    cy.intercept('POST', '**/functions/v1/create-trial-tenant', {
      statusCode: 200,
      body: { success: true, message: 'Tenant created successfully' }
    }).as('createTenant');

    visitWithAuth('/admin/branches');
    // Guard must pass and land on the correct page
    cy.url({ timeout: 10000 }).should('include', '/admin/branches');
    cy.wait(['@getProfile', '@getTenants', '@getBranches']);
    cy.wait(1000);

    cy.contains(/nueva sucursal/i, { matchCase: false }).click();

    // General tab
    cy.contains('Nombre Comercial').parent().find('input')
      .invoke('val', 'Nueva Empresa S.A.').trigger('input')
      .should('have.value', 'Nueva Empresa S.A.');
    cy.contains('Razón Social').parent().find('input')
      .invoke('val', 'Nueva Empresa Subtitle').trigger('input')
      .should('have.value', 'Nueva Empresa Subtitle');
    cy.contains('Plan Actual').parent().find('select').select('premium');

    // Contact tab
    cy.contains('Contacto').click({ force: true });
    cy.contains('Email Público').parent().find('input')
      .invoke('val', 'contacto@nuevaempresa.com').trigger('input')
      .should('have.value', 'contacto@nuevaempresa.com');
    cy.contains('Línea de Atención WhatsApp').parent().find('input')
      .invoke('val', '+5491122334455').trigger('input')
      .should('have.value', '+5491122334455');

    // Submit
    cy.get('button').contains(/Aplicar Cambios/i, { matchCase: false }).click();

    cy.wait('@createTenant').its('request.body').should('contain', {
      businessName: 'Nueva Empresa S.A.',
      email:        'contacto@nuevaempresa.com'
    });

    cy.contains(/creado con éxito/i, { matchCase: false }).should('exist');
  });

  // ── Test 2: RLS isolation ───────────────────────────────────────────────────

  it('debería manejar errores de RLS asegurando aislamiento (Isolation)', () => {
    cy.intercept('GET', '**/rest/v1/orders*', {
      statusCode: 403,
      body: {
        code:    '42501',
        message: 'new row violates row-level security policy',
        details: 'Tenant ID mismatch'
      }
    }).as('getOrdersFail');

    visitWithAuth('/admin/orders');

    cy.contains(/no tienes permisos/i, { matchCase: false, timeout: 5000 }).should('exist');
  });

  // ── Test 3: change branch plan ──────────────────────────────────────────────

  it('debería permitir cambiar el plan de un tenant y afectar la UI', () => {
    visitWithAuth('/admin/branches');
    cy.url({ timeout: 10000 }).should('include', '/admin/branches');
    cy.wait(['@getProfile', '@getTenants', '@getBranches']);
    cy.wait(1000);

    // Click the settings (Ajustes) button on Sede Secundaria card
    cy.contains('Sede Secundaria').parents('.group').find('button[data-tip="Ajustes"]').click({ force: true });

    cy.intercept('PATCH', '**/rest/v1/branches*', {
      statusCode: 200,
      body: [{ id: 'branch-2', plan_id: 'premium' }]
    }).as('updateBranch');

    cy.contains('Plan Actual').parent().find('select').select('premium');
    cy.get('button').contains(/Aplicar Cambios/i, { matchCase: false }).click();

    cy.wait('@updateBranch').its('request.body').should('contain', {
      plan_id: 'premium'
    });
  });
});
