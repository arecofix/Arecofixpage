/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginAsAdmin(url?: string): Chainable<void>;
      loginRealAdmin(url?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginRealAdmin', (url = '/') => {
  const email = 'admin@arecofix.com.ar';
  const password = 'admin2026';
  const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

  cy.request({
    method: 'POST',
    url: `${supabaseUrl}/auth/v1/token?grant_type=password`,
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: { email, password }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const session = response.body;
    
    cy.visit(url, {
      onBeforeLoad: (win) => {
        // Inject auth token BEFORE Angular initializes so the guard reads it on first load
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('supabase-remember-me', 'true');
        // Pre-set branch so the admin guard doesn't bounce back to /
        win.localStorage.setItem('arecofix_current_branch_id', 'de967f68-7b15-44c0-bc98-952ccf06e1e5');
        win.localStorage.setItem('arecofix_admin_branch_id', 'de967f68-7b15-44c0-bc98-952ccf06e1e5');
      }
    });
  });
});

Cypress.Commands.add('loginAsAdmin', (url = '/') => {
  const session = {
    provider_token: null,
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay1hZG1pbi1pZCJ9.signature',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    user: {
      id: 'mock-admin-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@arecofix.com',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'super_admin' },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  // 1. PRIMERO definimos los interceptores

  cy.intercept('**/rest/v1/**', {
    statusCode: 200,
    body: []
  }).as('catchAllSupabase');

  // Intercept the /auth/v1/user call
  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: session.user
  }).as('getUser');

  const mockProfile = {
    id: 'mock-admin-id',
    email: 'admin@arecofix.com',
    role: 'super_admin',
    first_name: 'Admin',
    last_name: 'Test',
    is_active: true
  };

  cy.intercept('GET', '**/rest/v1/profiles?id=eq.mock-admin-id*', {
    statusCode: 200,
    body: mockProfile
  }).as('getProfileSingle');

  cy.intercept('GET', '**/rest/v1/profiles', {
    statusCode: 200,
    body: [mockProfile]
  }).as('getProfile');

  // Mock Dashboard RPCs
  cy.intercept('POST', '**/rest/v1/rpc/get_dashboard_stats_v2*', {
    statusCode: 200,
    body: {
      users: 15,
      products: 120,
      sales: 45,
      devices_fixed: 89,
      products_chart: [
        { name: 'Módulo iPhone 11', quantity: 12 },
        { name: 'Batería Samsung S20', quantity: 8 },
        { name: 'Pin de Carga Tipo C', quantity: 25 }
      ],
      category_chart: [
        { name: 'Reparaciones', count: 45 },
        { name: 'Accesorios', count: 30 },
        { name: 'Repuestos', count: 25 }
      ]
    }
  }).as('getLegacyStats');

  cy.intercept('POST', '**/rest/v1/rpc/get_financial_analytics_v3*', {
    statusCode: 200,
    body: {
      total_gross_revenue: 1500000,
      total_cost: 400000,
      current_month_gross: 250000,
      current_month_cost: 60000,
      monthly_breakdown: [
        { period: '2025-01', gross_revenue: 200000, cost: 50000, repairs_revenue: 150000, sales_revenue: 50000, repairs_cost: 20000, sales_cost: 30000 },
        { period: '2025-02', gross_revenue: 250000, cost: 60000, repairs_revenue: 180000, sales_revenue: 70000, repairs_cost: 25000, sales_cost: 35000 }
      ]
    }
  }).as('getFinanceStats');



  // Mock tenants
  cy.intercept('GET', '**/rest/v1/tenants?*select=*&slug=eq.*', {
    statusCode: 200,
    body: { id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }
  });

  cy.intercept('GET', '**/rest/v1/tenants?*select=*&id=eq.*', {
    statusCode: 200,
    body: { id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }
  });

  cy.intercept('GET', '**/rest/v1/tenants*', {
    statusCode: 200,
    body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }]
  }).as('getTenants');

  // Mock branches
  cy.intercept('GET', '**/rest/v1/branches?*id=eq.*', {
    statusCode: 200,
    body: { id: 'branch-1', name: 'Sede Central' }
  });

  cy.intercept('GET', '**/rest/v1/branches*', {
    statusCode: 200,
    body: [{ id: 'branch-1', name: 'Sede Central' }]
  }).as('getBranches');

  // 2. Ejecutamos un cy.visit rápido a la raíz con onBeforeLoad
  // Esto garantiza que el origen es correcto y que el token se inyecta ANTES de que Angular y Supabase se inicialicen.
  cy.visit(url, { 
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
      win.localStorage.setItem('supabase-remember-me', 'true');
      win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
      win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
      win.localStorage.setItem('cypress-test', 'true');
    }
  });
});