describe('Adversarial — Order Tampering Attack Prevention', () => {
  it('debería rechazar solicitudes con orderId inexistente, malformado o de inyección SQL', () => {
    const maliciousOrderIds = [
      'non-existent-order-uuid',
      "' OR 1=1 --",
      '<script>alert(1)</script>',
      '../../etc/passwd',
    ];

    maliciousOrderIds.forEach((badId) => {
      cy.request({
        method: 'POST',
        url: '/api/mercadopago/create-preference',
        body: {
          orderId: badId,
          items: [],
          shippingCost: 0,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 404, 500]);
        expect(res.body.success).to.be.false;
      });
    });
  });
});
