describe('Adversarial — Concurrent Webhooks Handling', () => {
  it('debería procesar ráfagas concurrentes de webhooks de forma segura', () => {
    const paymentId = '7777777777';
    const requests = Array.from({ length: 5 }, (_, i) =>
      cy.request({
        method: 'POST',
        url: `/api/mercadopago/webhook?data.id=${paymentId}&type=payment`,
        body: {
          action: 'payment.created',
          data: { id: paymentId },
          type: 'payment',
        },
        headers: {
          'x-request-id': `concurrent-req-${i}`,
        },
        failOnStatusCode: false,
      })
    );

    // All should complete with 200 or 401, never 500
    requests.forEach((req) => {
      req.then((res) => {
        expect(res.status).to.be.oneOf([200, 401]);
      });
    });
  });
});
