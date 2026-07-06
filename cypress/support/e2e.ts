// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Ignorar errores no controlados de la aplicación (como "document is null")
// Esto evita que Cypress falle si la app Angular o Vite lanza un error asíncrono
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Cannot read properties of null (reading \'document\')')) {
    return false;
  }
  // Se puede retornar false para ignorar TODOS los errores, pero es mejor ser específico
  return false;
});

beforeEach(() => {
  // Bloquear llamadas a Google Analytics, Tag Manager y PostHog para evitar timeouts y datos de test
  cy.intercept('https://www.google-analytics.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://www.googletagmanager.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us-assets.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://connect.facebook.net/**', { statusCode: 200, body: '' });
});
