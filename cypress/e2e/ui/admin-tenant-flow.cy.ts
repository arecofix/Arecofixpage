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

// ─── Describe block ───────────────────────────────────────────────────────────

describe('Admin Tenant Flow (Multi-tenant & RLS Isolation)', () => {

  beforeEach(() => {
    // ── Login and Setup ────────────────────────────────────────────────────────
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginAsAdmin('/');

    // ── Auth ──────────────────────────────────────────────────────────────────
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: 'super-admin-id', email: 'admin@arecofix.com' }
    }).as('getUser');

    // ── Profiles ──────────────────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? MOCK_PROFILE : [MOCK_PROFILE]
      });
    }).as('getProfile');

    // ── Tenants ───────────────────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/tenants?*custom_domain*', {
      statusCode: 200,
      body: []
    });

    cy.intercept('GET', '**/rest/v1/tenants?*slug*', {
      statusCode: 200,
      body: [MOCK_TENANT]
    });

    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [MOCK_TENANT]
    }).as('getTenants');

    // ── Branches (Paginated) ──────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-1/2' },
      body: MOCK_BRANCHES
    }).as('getBranches');
  });

  // ── Test 1: create new tenant ───────────────────────────────────────────────

  it('debería permitir al Super Admin crear un nuevo tenant', () => {
    cy.intercept('POST', '**/functions/v1/create-trial-tenant', {
      statusCode: 200,
      body: { success: true, message: 'Tenant created successfully' }
    }).as('createTenant');

    // Guard must pass and land on the correct page
    cy.visit('/admin/branches');
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

    cy.visit('/admin/orders');
    cy.contains(/no tienes permisos/i, { matchCase: false, timeout: 5000 }).should('exist');
  });

  // ── Test 3: change branch plan ──────────────────────────────────────────────

  it('debería permitir cambiar el plan de un tenant y afectar la UI', () => {
    cy.visit('/admin/branches');
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
