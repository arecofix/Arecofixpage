const fs = require('fs');

function fixFailover() {
  const file = 'cypress/e2e/ui/failover.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Replace intercept to mock the worker response to 200
  c = c.replace(/cy\.intercept\('GET', 'https:\/\/arecofix-d1-failover\.ezequielenrico15\.workers\.dev\/\*'\)\.as\('d1Failover'\);/, 
    "cy.intercept('GET', 'https://arecofix-d1-failover.ezequielenrico15.workers.dev/*', { statusCode: 200, body: '<html><body><app-root><h1>Failover</h1></app-root></body></html>' }).as('d1Failover');");
  
  fs.writeFileSync(file, c);
  console.log('Fixed failover');
}

fixFailover();
