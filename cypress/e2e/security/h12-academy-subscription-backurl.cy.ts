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

  it('2. POST /api/academy/subscribe con backUrl malicioso no debe reflejarlo en redirecciones o errores', () => {
    cy.request({
      method: 'POST',
      url: '/api/academy/subscribe',
      failOnStatusCode: false,
      body: {
        userId: '00000000-0000-0000-0000-000000000099',
        payerEmail: 'victim@arecofix.com.ar',
        payerName: 'Victim User',
        backUrl: 'https://evil-attacker-site.com/exploit?token=hijack'
      }
    }).then((res) => {
      // El server jamás debe reflejar o permitir redirigir hacia el dominio malicioso
      const bodyStr = JSON.stringify(res.body || {});
      expect(bodyStr).not.to.include('evil-attacker-site.com');
      // Debe responder 200 (si MP preference fue creada) o 500/404 de Supabase/MP si las credenciales fallan, pero nunca filtrar el open redirect
      expect(res.status).to.be.oneOf([200, 400, 404, 500]);
    });
  });

  it('3. POST /api/academy/subscribe con backUrl javascript: scheme no debe reflejarlo', () => {
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
});
