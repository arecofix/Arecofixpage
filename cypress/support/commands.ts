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

  // Catch-all
  cy.intercept('**/rest/v1/*', (req) => {
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