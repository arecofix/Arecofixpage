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
import { 
  buildMockSession, 
  buildMockProfile, 
  buildMockTenant, 
  buildMockBranch 
} from './mock-factories';

export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginAsAdmin(url?: string, options?: { isTauri?: boolean }): Chainable<void>;
      loginRealAdmin(url?: string, options?: { isTauri?: boolean }): Chainable<void>;
      setupCheckoutSession(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginRealAdmin', (url = '/', options: { isTauri?: boolean } = {}) => {
  const session = {
    provider_token: null,
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    user: {
      id: 'mock-admin-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@arecofix.com.ar',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'super_admin' },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  const fakeProfile = {
    id: session.user.id,
    email: 'admin@arecofix.com.ar',
    role: 'super_admin',
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
    first_name: 'Admin',
    last_name: 'Test',
    is_active: true
  };

  cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
    const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
    req.reply({
      statusCode: 200,
      body: wantsObject ? fakeProfile : [fakeProfile]
    });
  }).as('getProfile');

  // Intercept other basic things like branches/tenants that could fail in online mock mode
  cy.intercept('GET', '**/rest/v1/tenants*', {
    statusCode: 200,
    body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }]
  }).as('getTenants');

  cy.intercept('GET', '**/rest/v1/branches*', {
    statusCode: 200,
    body: [{ id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5', name: 'Sede Central' }]
  }).as('getBranches');

  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: session.user
  }).as('getUser');

  cy.intercept('POST', '**/auth/v1/token*', {
    statusCode: 200,
    body: {
      access_token: session.access_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      user: session.user
    }
  }).as('refreshToken');

  const targetUrl = (options.isTauri && !url.startsWith('/#')) ? `/#${url.startsWith('/') ? url : '/' + url}` : url;

  cy.visit(targetUrl, {
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      // Inject auth token BEFORE Angular initializes
      win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
      win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
      win.localStorage.setItem(`arecofix_profile_${session.user.id}`, JSON.stringify(fakeProfile));
      win.localStorage.setItem('supabase-remember-me', 'true');
      win.localStorage.setItem('arecofix_current_branch_id', 'de967f68-7b15-44c0-bc98-952ccf06e1e5');
      win.localStorage.setItem('arecofix_admin_branch_id', 'de967f68-7b15-44c0-bc98-952ccf06e1e5');
      win.localStorage.setItem('cypress-test', 'true');
      
      if (options.isTauri) {
        // Forzar Tauri para validación offline absoluta
        (win as any).__TAURI__ = true;
      }
    }
  });
});

Cypress.Commands.add('loginAsAdmin', (url = '/', options = {}) => {
  const session = {
    provider_token: null,
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
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

  cy.intercept('POST', '**/auth/v1/token*', {
    statusCode: 200,
    body: {
      access_token: session.access_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      user: session.user
    }
  }).as('refreshToken');

  const mockProfile = {
    id: 'mock-admin-id',
    email: 'admin@arecofix.com',
    role: 'super_admin',
    first_name: 'Admin',
    last_name: 'Test',
    is_active: true
  };

  cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockProfile : [mockProfile]
    });
  }).as('getProfile');

  cy.intercept('GET', '**/rest/v1/v_unified_clients*', {
    statusCode: 200,
    headers: {
      'content-range': '0-1/2'
    },
    body: [{
      ...mockProfile,
      source: 'profile',
      repair_count: 0,
      order_count: 0
    }]
  }).as('getUnifiedClientsGlobal');

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



  const mockTenant = { id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true };
  
  cy.intercept('GET', '**/rest/v1/tenants*', (req) => {
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockTenant : [mockTenant]
    });
  }).as('getTenants');

  const mockBranch = { id: 'branch-1', name: 'Sede Central' };

  cy.intercept('GET', '**/rest/v1/branches*', (req) => {
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockBranch : [mockBranch]
    });
  }).as('getBranches');

  const targetUrl = (options.isTauri && !url.startsWith('/#')) ? `/#${url.startsWith('/') ? url : '/' + url}` : url;

  // 2. Ejecutamos un cy.visit rápido a la raíz con onBeforeLoad
  // Esto garantiza que el origen es correcto y que el token se inyecta ANTES de que Angular y Supabase se inicialicen.
  cy.visit(targetUrl, { 
    failOnStatusCode: false,
    onBeforeLoad: (win) => {
      win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
      win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
      win.localStorage.setItem('arecofix_profile_mock-admin-id', JSON.stringify(mockProfile));
      win.localStorage.setItem('supabase-remember-me', 'true');
      win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
      win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
      win.localStorage.setItem('cypress-test', 'true');
      
      if (options.isTauri) {
        (win as any).__TAURI__ = true;
      }
    }
  });
});

Cypress.Commands.add('setupCheckoutSession', () => {
  const session = buildMockSession();
  const profile = buildMockProfile();
  const tenant = buildMockTenant();
  const branch = buildMockBranch();

  // Inject session into local storage BEFORE anything loads
  cy.window().then(w => w.indexedDB.deleteDatabase('ArecofixOfflineDB'));
    cy.on('window:before:load', (win) => {
    win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
    win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
    win.localStorage.setItem('arecofix_current_branch_id', branch.id);
  });

  // Basic intercepts required for the app to function
  cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? profile : [profile]
    });
  }).as('getProfile');

  cy.intercept('GET', '**/rest/v1/tenants*', {
    statusCode: 200,
    body: [tenant]
  }).as('getTenant');

  cy.intercept('GET', '**/rest/v1/companies*', {
    statusCode: 200,
    body: [{ id: 'company-1', name: 'Arecofix' }]
  }).as('getCompany');

  cy.intercept('GET', '**/rest/v1/branches*', {
    statusCode: 200,
    body: [branch]
  }).as('getBranch');

  // Supabase auth user
  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: session.user
  }).as('getUser');
});
