describe('Admin Capture Screenshots', () => {
  it('Captures Admin Orders panel', () => {
    cy.loginRealAdmin('/admin/orders');
    cy.wait(4000);
    cy.screenshot('admin_orders_panel', { overwrite: true });
  });

  it('Captures Admin Leads panel', () => {
    cy.loginRealAdmin('/admin/leads');
    cy.wait(4000);
    cy.screenshot('admin_leads_panel', { overwrite: true });
  });
});
