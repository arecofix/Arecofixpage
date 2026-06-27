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
      loginAsAdmin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
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
  // Intercept the /auth/v1/user call
  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: session.user
  }).as('getUser');

  // Intercept the profile fetch
  cy.intercept('GET', '**/rest/v1/profiles?*', {
    statusCode: 200,
    body: [{
      id: 'mock-admin-id',
      email: 'admin@arecofix.com',
      role: 'super_admin',
      first_name: 'Admin',
      last_name: 'Test',
      is_active: true
    }]
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

  // Catch-all for ANY rest/v1 request (prevents 401 leaks)
  cy.intercept('**/rest/v1/**', (req) => {
    req.reply({
      statusCode: 200,
      body: []
    });
  }).as('catchAllSupabase');

  // Mock tenants
  cy.intercept('GET', '**/rest/v1/tenants?*', {
    statusCode: 200,
    body: [{
      id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      name: 'Arecofix',
      slug: 'arecofix',
      is_active: true
    }]
  }).as('getTenants');

  // Mock branches
  cy.intercept('GET', '**/rest/v1/branches?*', {
    statusCode: 200,
    body: [{ id: 'branch-1', name: 'Sede Central' }]
  }).as('getBranches');

  // 2. Ejecutamos un cy.visit rápido a la raíz con onBeforeLoad
  // Esto garantiza que el origen es correcto y que el token se inyecta ANTES de que Angular y Supabase se inicialicen.
  cy.visit('/', { 
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
      win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
      win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
    }
  });
});