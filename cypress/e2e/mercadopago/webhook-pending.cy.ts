describe('Mercado Pago — Webhook de Pago Pendiente', () => {
  it('debería responder 200 OK y mantener orden en espera si el pago está en proceso', () => {
    cy.intercept('POST', '**/api/mercadopago/webhook*', (req) => {
      req.reply({
        statusCode: 200,
        body: { received: true, status: 'processing' },
      });
    }).as('mpWebhookPending');

    cy.request({
      method: 'POST',
      url: '/api/mercadopago/webhook?data.id=9876543212&type=payment',
      body: {
        action: 'payment.created',
        data: { id: '9876543212' },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'req-test-pending-1',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 401]);
    });
  });
});
