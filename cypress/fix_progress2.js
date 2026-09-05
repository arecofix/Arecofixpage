const fs = require('fs');

function fixProgressTest2() {
  const file = 'cypress/e2e/ui/academy-progress-certs.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Put loginAsAdmin AFTER clearLocalStorage
  c = c.replace(/beforeEach\(\(\) => \{\n    cy\.clearLocalStorage\(\);\n    cy\.clearCookies\(\);\n  \}\);/, 
    "beforeEach(() => {\n    cy.clearLocalStorage();\n    cy.clearCookies();\n    cy.loginAsAdmin('/');\n  });");

  // Remove loginAsAdmin from it blocks
  c = c.replace(/cy\.loginAsAdmin\('\/'\);\n\n    cy\.visit/g, 'cy.visit');
  c = c.replace(/cy\.loginAsAdmin\('\/'\);\n    cy\.visit/g, 'cy.visit');

  fs.writeFileSync(file, c);
  console.log('Fixed academy progress certs 2');
}

fixProgressTest2();
