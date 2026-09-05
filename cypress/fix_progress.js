const fs = require('fs');

function fixProgressTest() {
  const file = 'cypress/e2e/ui/academy-progress-certs.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Fix beforeEach
  c = c.replace(/beforeEach\(\(\) => \{\n    cy\.loginAsAdmin\(`\/admin\/courses\/\$\{courseId\}\/materials`\);\n    cy\.clearLocalStorage\(\);\n    cy\.clearCookies\(\);\n  \}\);/, 
    "beforeEach(() => {\n    cy.clearLocalStorage();\n    cy.clearCookies();\n  });");

  // Fix test 1
  c = c.replace(/cy\.wait\('@getModules', \{ timeout: 10000 \}\);/, 
    "cy.loginAsAdmin('/');\n\n    cy.visit(`/admin/courses/${courseId}/materials`);\n    cy.wait('@getModules', { timeout: 10000 });");

  // Fix test 2
  c = c.replace(/cy\.loginAsAdmin\(`\/academy\/curso-e2e-test\/aula`\);/,
    "cy.loginAsAdmin('/');\n    cy.visit(`/academy/curso-e2e-test/aula`);");

  fs.writeFileSync(file, c);
  console.log('Fixed academy progress certs');
}

fixProgressTest();
