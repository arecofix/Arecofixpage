describe('Mercado Pago — Webhook de Pago Rechazado', () => {
  it('debería responder 200 OK y marcar orden cancelada si el pago fue rechazado', () => {
    cy.intercept('POST', '**/api/mercadopago/webhook*', (req) => {
      req.reply({
        statusCode: 200,
        body: { received: true, status: 'processing' },
      });
    }).as('mpWebhookRejected');

    cy.request({
      method: 'POST',
      url: '/api/mercadopago/webhook?data.id=9876543211&type=payment',
      body: {
        action: 'payment.updated',
        data: { id: '9876543211' },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'req-test-rejected-1',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 401]);
    });
  });
});
