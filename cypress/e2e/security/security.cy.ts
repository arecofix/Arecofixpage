describe('Security and Destructive Tests', () => {
  

  it('Should resist XSS payloads in Customer Forms', () => {
    // Mocks login to be in admin mode
    cy.visit('/admin/customers/new', {
      onBeforeLoad(win) {
        win.localStorage.setItem('supabase.auth.token', '{"access_token":"fake-admin-token"}');
      }
    });

    const xssPayload = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
    
    cy.get('input[formControlName="firstName"]').type(xssPayload);
    cy.get('input[formControlName="lastName"]').type(xssPayload);
    cy.get('input[formControlName="email"]').type('test-xss@example.com');
    cy.get('button[type="submit"]').click();

    // Verify it doesn't break the UI, but gets sanitized or escaped in the DOM
    cy.visit('/admin/customers');
    cy.contains(xssPayload).should('not.exist');
    cy.get('body').invoke('html').should('not.include', '<script>alert("XSS")</script>');
  });

  it('Should prevent Route Guard Bypass (Unauthorized access)', () => {
    // Simulate being logged in as a normal user, not admin
    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('supabase.auth.token', '{"access_token":"fake-user-token"}');
      }
    });

    // The guard should intercept and redirect to / o /auth/login
    cy.url().should('not.include', '/admin/dashboard');
  });

  it('Should handle 500 Internal Server Error gracefully', () => {
    // Intercept a crucial API call and force a 500
    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getRepairsError');

    cy.visit('/admin/repairs');
    cy.wait('@getRepairsError');

    // UI should show a toast or empty state, but NOT crash completely
    cy.get('.toast-error, .alert-error').should('exist');
    cy.get('body').should('not.contain', 'Object doesn\'t support property');
  });

  it('Should fallback to Dexie Offline PWA Storage when Network Drops during POST', () => {
    // Mock the network offline event
    cy.visit('/admin/repairs/new');

    cy.get('input[formControlName="customerName"]').type('Offline Client');
    cy.get('input[formControlName="issueDescription"]').type('Broken Screen');

    // Go offline!
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', { value: false });
      win.dispatchEvent(new Event('offline'));
    });

    cy.get('button[type="submit"]').click();

    // It should save to indexedDB locally
    cy.window().then(async (win) => {
      // Assuming we expose ArecofixUnifiedDB for test environments or check UI state
      cy.get('.toast-success, .alert-info').contains(/offline/i).should('exist');
    });
  });

});
