describe('Security Regression P1 (H-11): Verify Academy Certificate Endpoints Require Admin Auth', () => {
  const testSecretHeader = {
    'x-test-secret': 'test-bypass-key-2026'
  };

  describe('1. POST /api/academy/certificates/issue', () => {
    it('debe devolver 401 sin Authorization header', () => {
      cy.request({
        method: 'POST',
        url: '/api/academy/certificates/issue',
        failOnStatusCode: false,
        body: { courseId: 'fake-id', studentEmail: 'test@example.com' }
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.success).to.be.false;
      });
    });

    it('debe devolver 401 con ?test_bypass=true sin auth', () => {
      cy.request({
        method: 'POST',
        url: '/api/academy/certificates/issue?test_bypass=true',
        failOnStatusCode: false,
        body: { courseId: 'fake-id' }
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('debe permitir acceso administrativo en modo test con x-test-secret', () => {
      cy.request({
        method: 'POST',
        url: '/api/academy/certificates/issue',
        failOnStatusCode: false,
        headers: testSecretHeader,
        body: { courseId: 'fake-id', studentEmail: 'test@example.com' }
      }).then((res) => {
        // Con auth válida el endpoint no rechaza con 401 (puede ser 200 o 400 si falta el curso real)
        expect(res.status).to.not.eq(401);
        expect(res.status).to.not.eq(403);
      });
    });
  });

  describe('2. GET /api/academy/certificates', () => {
    it('debe devolver 401 sin Authorization header', () => {
      cy.request({
        method: 'GET',
        url: '/api/academy/certificates',
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.success).to.be.false;
      });
    });

    it('debe devolver 401 con ?test_bypass=true sin auth', () => {
      cy.request({
        method: 'GET',
        url: '/api/academy/certificates?test_bypass=true',
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('debe permitir acceso administrativo con auth admin válida (test mode)', () => {
      cy.request({
        method: 'GET',
        url: '/api/academy/certificates',
        failOnStatusCode: false,
        headers: testSecretHeader
      }).then((res) => {
        expect(res.status).to.not.eq(401);
        expect(res.status).to.not.eq(403);
      });
    });
  });

  describe('3. PATCH /api/academy/certificates/:id/revoke', () => {
    it('debe devolver 401 sin Authorization header', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/revoke',
        failOnStatusCode: false,
        body: { reason: 'Test' }
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.success).to.be.false;
      });
    });

    it('debe devolver 401 con ?test_bypass=true sin auth', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/revoke?test_bypass=true',
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('debe permitir acceso administrativo con auth admin válida (test mode)', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/revoke',
        failOnStatusCode: false,
        headers: testSecretHeader,
        body: { reason: 'Test' }
      }).then((res) => {
        expect(res.status).to.not.eq(401);
        expect(res.status).to.not.eq(403);
      });
    });
  });

  describe('4. PATCH /api/academy/certificates/:id/reactivate', () => {
    it('debe devolver 401 sin Authorization header', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/reactivate',
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.success).to.be.false;
      });
    });

    it('debe devolver 401 con ?test_bypass=true sin auth', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/reactivate?test_bypass=true',
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('debe permitir acceso administrativo con auth admin válida (test mode)', () => {
      cy.request({
        method: 'PATCH',
        url: '/api/academy/certificates/00000000-0000-0000-0000-000000000001/reactivate',
        failOnStatusCode: false,
        headers: testSecretHeader
      }).then((res) => {
        expect(res.status).to.not.eq(401);
        expect(res.status).to.not.eq(403);
      });
    });
  });
});
