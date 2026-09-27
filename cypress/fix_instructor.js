const fs = require('fs');

function fixInstructorTest() {
  const file = 'cypress/e2e/ui/academy-instructor.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Replace dummy login
  c = c.replace(/cy\.loginAsAdmin\('\/instructor\/builder\/11111111-1111-1111-1111-111111111111'\);/, "cy.loginAsAdmin('/');");
  
  // The first test is missing the visit!
  c = c.replace(/cy\.url\(\)\.should\('include', '\/instructor\/builder'\);/, 
    "cy.visit('/instructor/builder/11111111-1111-1111-1111-111111111111');\n        cy.url().should('include', '/instructor/builder');");

  // The second test has the login in it, replace with visit!
  c = c.replace(/cy\.loginAsAdmin\('\/instructor\/builder\/11111111-1111-1111-1111-111111111111'\);/g, 
    "cy.visit('/instructor/builder/11111111-1111-1111-1111-111111111111');");
    
  fs.writeFileSync(file, c);
  console.log('Fixed academy instructor');
}

fixInstructorTest();
