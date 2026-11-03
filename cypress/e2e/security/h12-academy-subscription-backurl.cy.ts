describe('Security Regression P1 (H-12): Prevent Open Redirect via backUrl in Academy Subscription', () => {
  it('1. POST /api/academy/subscribe sin userId debe rechazar con 400', () => {
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        backUrl: 'https://evil.com/phishing'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.include('userId');
    });
  });

  it('2. POST /api/academy/subscribe con formato de userId inválido debe devolver 400', () => {
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        userId: 'invalid-non-uuid-format',
        backUrl: 'https://evil.com/phishing'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.include('formato');
    });
  });

  it('3. POST /api/academy/subscribe con userId UUID no existente debe devolver 404 (no 500)', () => {
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        userId: '00000000-0000-0000-0000-000000000099',
        payerEmail: 'ghost@arecofix.com.ar',
        backUrl: 'https://evil.com/phishing'
      }
    }).then((res) => {
      // Debe responder 404 cleanly, no 500 error no controlado
      expect(res.status).to.eq(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.include('Usuario no encontrado');
    });
  });

  it('4. POST /api/academy/subscribe con backUrl javascript: scheme no debe reflejarlo', () => {
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        userId: '00000000-0000-0000-0000-000000000099',
        backUrl: 'javascript:alert(document.cookie)'
      }
    }).then((res) => {
      const bodyStr = JSON.stringify(res.body || {});
      expect(bodyStr).not.to.include('javascript:alert');
    });
  });

  it('5. Flujo completo: POST /api/academy/subscribe con usuario válido y backUrl malicioso genera preferencia en Mercado Pago sin reflejar evil.com', () => {
    // Usamos el ID del usuario real existente en la base de datos
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        userId: '8976d369-1dfb-4daf-a8c6-bbf54a4d107c',
        payerEmail: 'info@arecofix.com.ar',
        payerName: 'Info Arecofix',
        backUrl: 'https://evil-attacker-site.com/exploit?token=hijack'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.preference_id).to.be.a('string');
      expect(res.body.init_point).to.include('mercadopago.com');
      // Verificamos que jamás se reflejó el sitio malicioso
      const bodyStr = JSON.stringify(res.body);
      expect(bodyStr).not.to.include('evil-attacker-site.com');
    });
  });
});
