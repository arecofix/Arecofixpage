describe('Hostile UI Interactions (Spam Submit)', () => {
  beforeEach(() => {
    cy.loginAsAdmin('/admin/repairs/new');
    cy.get('input[formControlName="customer_name"]').should('be.visible');
  });

  it('no debería permitir envíos duplicados si el usuario hace spam de clicks', () => {
    // Interceptar la llamada para contar cuántas veces se hace
    let postCount = 0;
    cy.intercept('POST', '**/rest/v1/repairs*', (req) => {
      postCount++;
      req.reply({ statusCode: 201, body: [{ id: 'mock-id' }] });
    }).as('repairPost');

    // Llenar el formulario
    cy.get('input[formControlName="customer_name"]').type('Cliente Spam');
    cy.get('input[formControlName="customer_phone"]').type('11111111');
    cy.get('input[formControlName="device_model"]').type('Motorola G20');
    cy.get('textarea[formControlName="issue_description"]').type('Bateria hinchada');

    // Hacer spam de clicks (simulando 10 clicks super rápidos)
    const submitBtn = cy.get('button[type="submit"]');
    for (let i = 0; i < 10; i++) {
        submitBtn.click({ force: true });
    }

    // Esperar un poco para asegurar que las llamadas (si hay más de una) tendrían tiempo de salir
    cy.wait(500);

    // Verificar que solo se hizo UNA llamada a la API
    cy.wrap(null).then(() => {
      expect(postCount).to.be.lte(1, 'El formulario permitió envíos múltiples');
    });
  });
});
