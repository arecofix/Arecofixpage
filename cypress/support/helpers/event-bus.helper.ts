/**
 * EventBus & Cash Movement Helper for Cypress E2E Tests
 */

export function setupCashMovementMocks() {
  const cashMovements: any[] = [];

  cy.intercept('GET', '**/rest/v1/cash_movements*', (req) => {
    req.reply({
      statusCode: 200,
      headers: { 'content-range': `0-${Math.max(0, cashMovements.length - 1)}/${cashMovements.length}` },
      body: cashMovements,
    });
  }).as('getCashMovements');

  cy.intercept('POST', '**/rest/v1/cash_movements*', (req) => {
    const item = {
      id: 'cash-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
      ...req.body,
    };
    cashMovements.push(item);
    req.reply({
      statusCode: 201,
      body: item,
    });
  }).as('postCashMovement');

  return { cashMovements };
}
