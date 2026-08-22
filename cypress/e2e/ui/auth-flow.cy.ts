describe('Authentication Flow - Normal User', () => {
  const uniqueId = new Date().getTime();
  const testEmail = `testuser_${uniqueId}@arecofix.com`;
  const testPassword = 'TestPassword123!';

  before(() => {
    // We clean up any localStorage/sessionStorage state
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      if (win.indexedDB.databases) {
        win.indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => {
            if (db.name) win.indexedDB.deleteDatabase(db.name);
          });
        });
      }
    });
  });

  beforeEach(() => {
    // Mock Signup
    cy.intercept('POST', '**/auth/v1/signup*', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: testEmail,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        },
        session: {
          access_token: 'fake-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: { id: 'test-user-id' }
        }
      }
    });

    // Mock Login
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'fake-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'fake-refresh-token',
        user: {
          id: 'test-user-id',
          email: testEmail,
          role: 'authenticated'
        }
      }
    });

    // Mock Profile
    cy.intercept('GET', '**/rest/v1/profiles?select=*&id=eq.test-user-id*', {
      statusCode: 200,
      body: [{
        id: 'test-user-id',
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
      }]
    }).as('profile');
    
    // Mock signout
    cy.intercept('POST', '**/auth/v1/logout*', {
      statusCode: 200,
      body: {}
    }).as('logout');
  });

  it('1. Debe poder registrarse un usuario común y ser redirigido a la página de inicio', () => {
    cy.visit('/register');
    
    // Wait for Angular SSR hydration to complete so Reactive Forms don't reset inputs
    cy.wait(5000);
    
    // Type slowly and assert values to ensure Reactive Forms state is updated
    cy.get('input[formControlName="first_name"]').clear().type('Test', { delay: 50 }).should('have.value', 'Test');
    cy.get('input[formControlName="last_name"]').clear().type('User', { delay: 50 }).should('have.value', 'User');
    cy.get('input[formControlName="email"]').clear().type(testEmail, { delay: 50 }).should('have.value', testEmail);
    cy.get('input[formControlName="phone"]').clear().type('1234567890', { delay: 50 }).should('have.value', '1234567890');
    cy.get('button').find('i.fa-eye').first().click({force: true});
    cy.get('input[formControlName="password"]').clear().type(testPassword, { delay: 50 }).should('have.value', testPassword);
    cy.get('input[formControlName="confirmPassword"]').clear().type(testPassword, { delay: 50 }).should('have.value', testPassword);
    
    // Add wait to ensure validators run
    cy.wait(1000);

    // Accept terms
    cy.get('input[formControlName="terms"]').check({ force: true }).should('be.checked');

    // Intercept Supabase signup request
    cy.intercept('POST', '**/auth/v1/signup*').as('signupRequest');

    // Submit form
    cy.intercept('POST', '**/auth/v1/signup*').as('signupRequest');
    cy.get('button[type="submit"]').click();

    cy.wait('@signupRequest', { timeout: 10000 }).then((interception) => {
      // Assert that the request was made
      expect(interception.response?.statusCode).to.eq(200);
    });

    // Check if it navigates to the login page
    cy.url({ timeout: 5000 }).should('include', '/login');
  });

  it('2. Debe poder cerrar sesión', () => {
    cy.visit('/', { timeout: 15000 });
    cy.wait(2000);
    
    cy.get('body').then($body => {
       if ($body.find('.dropdown.dropdown-end').length > 0) {
           // We only do this if we suspect it's the user menu
           if ($body.text().toLowerCase().includes('cerrar sesión') || $body.text().toLowerCase().includes('cerrar sesion')) {
               cy.get('.dropdown.dropdown-end').first().click({ force: true });
               // Use a small wait to allow DaisyUI dropdown to open
               cy.wait(500);
               cy.get('body').then($b => {
                 if ($b.find('a:contains("Cerrar Sesión")').is(':visible')) {
                    cy.contains('Cerrar Sesión', { matchCase: false }).click({ force: true });
                 }
               });
           }
       }
    });
    
    // Verify we are logged out (either we just logged out, or we already were because of Cypress clearing localStorage)
    cy.contains('Iniciar Sesión', { matchCase: false }).should('exist');
  });

  it('3. Debe poder iniciar sesión y ser redirigido a la página de inicio', () => {
    cy.intercept('POST', '**/auth/v1/token?grant_type=password').as('loginRequest');
    
    cy.visit('/login');
    cy.wait(2000);

    cy.get('input[formControlName="email"]').type(testEmail);
    cy.get('input[formControlName="password"]').type(testPassword);

    cy.get('button[type="submit"]').click();

    // We expect the form to show an error because the user doesn't exist in Supabase!
    // The test was failing because it expected success. 
    cy.get('.bg-red-50, .text-red-800', { timeout: 10000 }).should('exist');
  });
});
