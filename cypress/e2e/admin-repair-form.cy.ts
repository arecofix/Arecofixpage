describe('Admin Repair Form', () => {
  beforeEach(() => {
    cy.loginAsAdmin('/admin/repairs/new');
    // Wait for the form to fully load by checking customer_name is visible
    cy.get('input[formControlName="customer_name"]').should('be.visible');
  });

  it('should fill the repair form without errors', () => {
    // wait a moment for any async initializations
    cy.wait(1000);

    cy.get('input[formControlName="customer_name"]').should('be.visible').type('Juan Perez', { delay: 50 });
    cy.get('input[formControlName="customer_name"]').should('have.value', 'Juan Perez');
    
    cy.get('input[formControlName="customer_phone"]').type('123456789');
    cy.get('input[formControlName="device_model"]').type('iPhone 12');
    cy.get('textarea[formControlName="issue_description"]').type('No enciende');
  });
});
