describe('Security Regression P0 (H-09): Verify Admin Authorization and Backdoor Elimination', () => {

  it('1. GET /api/admin/dashboard/metrics SIN auth debe devolver 401 (Unauthorized)', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/metrics',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('error');
    });
  });

  it('2. GET /api/admin/dashboard/metrics con ?test_bypass=true SIN auth debe devolver 401 (Backdoor Cerrado)', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/metrics?test_bypass=true',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('3. GET /api/admin/dashboard/metrics con User-Agent Cypress SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/metrics',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Cypress/13.0.0'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('4. GET /api/admin/dashboard/metrics con x-cypress-mock: true SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/metrics',
      headers: {
        'x-cypress-mock': 'true'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('5. GET /api/admin/dashboard/db-health SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/db-health',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('6. GET /api/admin/dashboard/analytics SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard/analytics',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('7. GET /api/admin/services SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/services',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  it('8. GET /api/admin/services con ?test_bypass=true SIN auth debe devolver 401', () => {
    cy.request({
      method: 'GET',
      url: '/api/admin/services?test_bypass=true',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('success', false);
    });
  });

});
