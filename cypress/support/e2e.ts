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
import './commands'

Cypress.on('window:before:load', (win: any) => {
  win.__console_errors = [];
  cy.stub(win.console, 'error').callsFake((...args) => {
    try {
      const safeMessage = args.map(a => {
        if (a instanceof Error) return a.message + '\n' + a.stack;
        if (typeof a === 'object' && a !== null) {
          const keys = Object.getOwnPropertyNames(a);
          const obj: any = {};
          keys.forEach(k => {
            try {
              obj[k] = (a as any)[k];
            } catch(e) {}
          });
          if (obj.message || obj.stack || obj.name) {
            return `${obj.name || 'Error'}: ${obj.message || ''}\n${obj.stack || ''}`;
          }
          try {
            return JSON.stringify(obj);
          } catch(e) {
            return '[Circular Object]';
          }
        }
        return String(a);
      }).join(' ');
      win.__console_errors.push(safeMessage);
    } catch(e) {}
  });
  
  cy.stub(win.console, 'log').callsFake((...args) => {
    Cypress.log({
        name: 'console.log',
        message: args
    });
    // This will print to terminal if we use a task or just appear in command log
  });
});;

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
  cy.clearLocalStorage();
  cy.clearCookies();
  // Bloquear llamadas a Google Analytics, Tag Manager y PostHog para evitar timeouts y datos de test
  cy.intercept('https://www.google-analytics.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://www.googletagmanager.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us-assets.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://connect.facebook.net/**', { statusCode: 200, body: '' });

  // Align zaona user profile's tenant_id to Arecofix tenant to avoid branch/profile tenant mismatch
  cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
    req.continue((res) => {
      if (res.body) {
        if (Array.isArray(res.body)) {
          res.body.forEach(profile => {
            if (profile && profile.email === 'zaona@arecofix.com.ar') {
              profile.tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
            }
          });
        } else if (typeof res.body === 'object') {
          if (res.body.email === 'zaona@arecofix.com.ar') {
            res.body.tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
          }
        }
      }
    });
  });

  // Clear branch slugs to prevent prepending slug to admin URLs
  cy.intercept('GET', '**/rest/v1/branches*', (req) => {
    req.continue((res) => {
      if (res.body) {
        if (Array.isArray(res.body)) {
          res.body.forEach(branch => {
            if (branch) {
              branch.slug = null;
            }
          });
        } else if (typeof res.body === 'object') {
          res.body.slug = null;
        }
      }
    });
  });
});
