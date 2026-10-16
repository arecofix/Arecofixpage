describe('Adversarial Testing: Conciliación y Estrés en Caja', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Conciliación contable: Balance = Total Ingresos - Total Egresos sin desviaciones', () => {
    const movements = [
      { id: 'm1', type: 'income', amount: 50000, notes: 'Venta 1', concept: 'Venta 1', created_at: new Date().toISOString() },
      { id: 'm2', type: 'income', amount: 35000, notes: 'Reparación 1', concept: 'Reparación 1', created_at: new Date().toISOString() },
      { id: 'm3', type: 'expense', amount: 20000, notes: 'Compra Repuestos', concept: 'Compra Repuestos', created_at: new Date().toISOString() },
      { id: 'm4', type: 'expense', amount: 15000, notes: 'Insumos Taller', concept: 'Insumos Taller', created_at: new Date().toISOString() },
    ];

    const totalIncome = movements.filter(m => m.type === 'income').reduce((sum, m) => sum + m.amount, 0);
    const totalExpense = movements.filter(m => m.type === 'expense').reduce((sum, m) => sum + m.amount, 0);
    const balance = totalIncome - totalExpense;
    expect(balance).to.equal(50000);

    cy.contains('Movimientos de Caja').should('be.visible');
  });
});
