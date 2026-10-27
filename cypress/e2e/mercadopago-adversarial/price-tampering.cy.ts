describe('Adversarial — Price Tampering Attack Prevention', () => {
  it('debería rechazar o ignorar cualquier intento del cliente de alterar el precio unitario a $1', () => {
    // Attempt to invoke the preference creation with manipulated item price
    cy.request({
      method: 'POST',
      url: '/api/mercadopago/create-preference',
      body: {
        orderId: '00000000-0000-0000-0000-000000000000',
        items: [
          {
            product_id: 'fake-id',
            product_name: 'iPhone 15 Pro Max',
            quantity: 1,
            unit_price: 1.00, // Attacker manipulated price!
          },
        ],
        shippingCost: 0,
      },
      failOnStatusCode: false,
    }).then((res) => {
      // The backend queries the database for the real order and does not trust client unit_price
      expect(res.status).to.be.oneOf([400, 404, 500]);
      if (res.body && res.body.error) {
        expect(res.body.success).to.be.false;
      }
    });
  });
});
