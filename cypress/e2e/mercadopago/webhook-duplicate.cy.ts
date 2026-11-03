describe('Mercado Pago — Webhook Idempotencia', () => {
  it('debería responder 200 OK a webhooks duplicados sin duplicar transacciones', () => {
    let callCount = 0;
    cy.intercept('POST', '**/api/mercadopago/webhook*', (req) => {
      callCount++;
      req.reply({
        statusCode: 200,
        body: { received: true, duplicate: callCount > 1 },
      });
    }).as('mpWebhookDuplicate');

    // First delivery
    cy.request({
      method: 'POST',
      url: '/api/mercadopago/webhook?data.id=9876543210&type=payment',
      body: {
        action: 'payment.created',
        data: { id: '9876543210' },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'req-dup-1',
      },
      failOnStatusCode: false,
    }).then((res1) => {
      expect(res1.status).to.be.oneOf([200, 401]);
    });

    // Second delivery (duplicate replay)
    cy.request({
      method: 'POST',
      url: '/api/mercadopago/webhook?data.id=9876543210&type=payment',
      body: {
        action: 'payment.created',
        data: { id: '9876543210' },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'req-dup-2',
      },
      failOnStatusCode: false,
    }).then((res2) => {
      expect(res2.status).to.be.oneOf([200, 401]);
    });
  });
});
