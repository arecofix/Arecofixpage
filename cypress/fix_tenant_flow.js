const fs = require('fs');

function fixTenantFlow() {
  const file = 'cypress/e2e/ui/admin-tenant-flow.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Move cy.loginAsAdmin to top of beforeEach
  c = c.replace(/cy\.loginAsAdmin\('\/admin\/branches'\);\n    \/\/ Guard must pass/, '// Guard must pass');
  c = c.replace(/cy\.loginAsAdmin\('\/admin\/orders'\);/, '');
  c = c.replace(/cy\.loginAsAdmin\('\/admin\/branches'\);/, '');
  
  c = c.replace(/beforeEach\(\(\) => \{/, "beforeEach(() => {\n    cy.loginAsAdmin('/');");

  // Add cy.visit to the tests instead
  c = c.replace(/cy\.url\(\{ timeout: 10000 \}\)\.should\('include', '\/admin\/branches'\);/, "cy.visit('/admin/branches');\n    cy.url({ timeout: 10000 }).should('include', '/admin/branches');");
  
  c = c.replace(/cy\.contains\(\/no tienes permisos\/i, \{ matchCase: false, timeout: 5000 \}\)\.should\('exist'\);/, "cy.visit('/admin/orders');\n    cy.contains(/no tienes permisos/i, { matchCase: false, timeout: 5000 }).should('exist');");
  
  fs.writeFileSync(file, c);
  console.log('Fixed tenant flow');
}

fixTenantFlow();
