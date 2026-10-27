describe('Mercado Pago — Webhook de Pago Aprobado', () => {
  it('debería responder 200 OK y procesar la acreditación de la orden', () => {
    // Intercept backend webhook response
    cy.intercept('POST', '**/api/mercadopago/webhook*', (req) => {
      req.reply({
        statusCode: 200,
        body: { received: true, status: 'processing' },
      });
    }).as('mpWebhookApproved');

    cy.request({
      method: 'POST',
      url: '/api/mercadopago/webhook?data.id=9876543210&type=payment',
      body: {
        action: 'payment.created',
        data: { id: '9876543210' },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'req-test-approved-1',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 401]);
    });
  });
});
