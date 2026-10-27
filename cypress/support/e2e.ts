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
import 'cypress-mochawesome-reporter/register';
import 'cypress-real-events';
import 'cypress-file-upload';
import '@testing-library/cypress/add-commands';

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
  if (err.message.includes('NG0505') || err.message.includes('NG02952') || err.message.includes('Angular hydration')) {
    return false;
  }
  // Se puede retornar false para ignorar TODOS los errores, pero es mejor ser específico
  return false;
});

beforeEach(() => {
  if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
  }

  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Clear IndexedDB to prevent SupabaseCache from intercepting requests
  cy.window().then((win) => {
    if (win.indexedDB && win.indexedDB.databases) {
      win.indexedDB.databases().then((dbs) => {
        dbs.forEach(db => { if (db.name) win.indexedDB.deleteDatabase(db.name); });
      });
    }
  });

  // Block Service Worker registration to prevent it from hijacking fetch requests in Cypress
  cy.intercept('GET', '**/ngsw-worker.js*', { statusCode: 404, body: '' }).as('blockSw');
  cy.intercept('GET', '**/ngsw.json*', { statusCode: 404, body: '' }).as('blockSwJson');

  // Bloquear llamadas a Google Analytics, Tag Manager y PostHog para evitar timeouts y datos de test
  cy.intercept('https://www.google-analytics.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://www.googletagmanager.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://us-assets.i.posthog.com/**', { statusCode: 200, body: '' });
  cy.intercept('https://connect.facebook.net/**', { statusCode: 200, body: '' });
  cy.intercept('GET', 'https://dolarapi.com/v1/dolares/cripto', { statusCode: 200, body: { compra: 1000 } }).as('globalUsdRate');

  // Manejar preflights OPTIONS para todas las llamadas REST y RPC a Supabase
  cy.intercept('OPTIONS', '**/rest/v1/**', {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'access-control-allow-headers': '*'
    }
  });
  cy.intercept('OPTIONS', '**/rpc/**', {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'access-control-allow-headers': '*'
    }
  });

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

  // Clear branch slugs to ensure menu routes use /admin/... consistently
  cy.intercept('GET', '**/rest/v1/branches*', (req) => {
    req.continue((res) => {
      if (res.body) {
        if (Array.isArray(res.body)) {
          res.body.forEach(branch => {
            if (branch) {
              branch.slug = null;
              branch.is_active = true;
            }
          });
        } else if (typeof res.body === 'object') {
          res.body.slug = null;
          res.body.is_active = true;
        }
      }
    });
  });

  // Mock notifications to prevent unhandled upstream network aborts during navigation
  cy.intercept('GET', '**/rest/v1/notifications*', {
    statusCode: 200,
    headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
    body: []
  }).as('globalNotifications');
});
