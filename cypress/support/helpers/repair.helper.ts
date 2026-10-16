/**
 * Repair Orders Helper for Cypress E2E Tests
 */

export function setupRepairMocks() {
  cy.fixture('repair-orders.json').then((repairs) => {
    cy.intercept('GET', '**/rest/v1/repairs*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${repairs.length - 1}/${repairs.length}` },
        body: repairs,
      });
    }).as('getRepairs');

    cy.intercept('GET', '**/rest/v1/repair_orders*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${repairs.length - 1}/${repairs.length}` },
        body: repairs,
      });
    }).as('getRepairOrders');
  });

  cy.intercept('PATCH', '**/rest/v1/repairs*', (req) => {
    req.reply({
      statusCode: 200,
      body: req.body,
    });
  }).as('patchRepair');
}
