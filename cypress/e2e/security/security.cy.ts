describe('Security and Destructive Tests', () => {
  

  it('Should resist XSS payloads in Customer Forms', () => {
    // Mocks login to be in admin mode
    cy.loginAsAdmin('/admin/clients/new');

    const xssPayload = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
    
    cy.get('input[name="first_name"]').type(xssPayload);
    cy.get('input[name="last_name"]').type(xssPayload);
    cy.get('input[name="email"]').type('test-xss@example.com');
    cy.get('button[type="submit"]').click();

    // Verify it doesn't break the UI, but gets sanitized or escaped in the DOM
    cy.visit('/admin/clients');
    cy.contains(xssPayload).should('not.exist');
    cy.get('body').invoke('html').should('not.include', '<script>alert("XSS")</script>');
  });

  it('Should prevent Route Guard Bypass (Unauthorized access)', () => {
    // Simulate being logged in as a normal user, not admin
    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sb-db-auth-token', '{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk","user":{"role":"authenticated"}}');
        win.localStorage.setItem('sb-db-auth-token', '{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk","user":{"role":"authenticated"}}');
      }
    });

    // The guard should intercept and redirect to / o /auth/login
    cy.url().should('not.include', '/admin/dashboard');
  });

  it('Should handle 500 Internal Server Error gracefully', () => {
    // Ensure user is authenticated as admin
    cy.loginAsAdmin('/admin/dashboard');

    // Intercept a crucial API call and force a 500 (overrides catchAllSupabase)
    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getRepairsError');

    cy.visit('/admin/repairs');
    cy.wait('@getRepairsError');

    // UI should show empty state or continue running, but NOT crash completely
    cy.get('body').should('not.contain', 'Object doesn\'t support property');
    cy.get('body').should('be.visible');
  });

  it('Should fallback to Dexie Offline PWA Storage when Network Drops during POST', () => {
    // Mock the network offline event
    cy.loginAsAdmin('/admin/repairs/new');

    cy.get('input[name="customer_name"]').should('be.visible').type('Offline Client');
    cy.get('input[name="customer_name"]').invoke('val', 'Offline Client').trigger('input');
    cy.get('input[name="device_model"]').should('be.visible').type('iPhone 11');
    cy.get('input[name="device_model"]').invoke('val', 'iPhone 11').trigger('input');
    cy.get('textarea[name="issue_description"]').should('be.visible').type('Broken Screen');
    cy.get('textarea[name="issue_description"]').invoke('val', 'Broken Screen').trigger('input');

    // Go offline!
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', { value: false });
      (win as any).forceOffline = true;
      win.dispatchEvent(new Event('offline'));
    });

    cy.get('button[type="submit"]').click();

    // It should save to indexedDB locally and show notification or badge
    cy.contains(/guardado localmente|offline/i, { timeout: 10000 }).should('exist');
  });

});
