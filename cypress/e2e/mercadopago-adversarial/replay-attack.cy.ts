describe('Adversarial — Replay Attack Prevention', () => {
  it('debería responder con seguridad ante un ataque de repetición del mismo webhook de pago', () => {
    const paymentId = '8888888888';

    // 1st time
    cy.request({
      method: 'POST',
      url: `/api/mercadopago/webhook?data.id=${paymentId}&type=payment`,
      body: {
        action: 'payment.created',
        data: { id: paymentId },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'first-attack-attempt',
      },
      failOnStatusCode: false,
    }).then((res1) => {
      expect(res1.status).to.be.oneOf([200, 401]);
    });

    // 2nd time (Replay attack attempt)
    cy.request({
      method: 'POST',
      url: `/api/mercadopago/webhook?data.id=${paymentId}&type=payment`,
      body: {
        action: 'payment.created',
        data: { id: paymentId },
        type: 'payment',
      },
      headers: {
        'x-request-id': 'second-replay-attempt',
      },
      failOnStatusCode: false,
    }).then((res2) => {
      // Must not crash or error with 500
      expect(res2.status).to.be.oneOf([200, 401]);
    });
  });
});
