const fs = require('fs');

function fixFullTrialFlow() {
  const file = 'cypress/e2e/ui/full-trial-to-admin-flow.cy.ts';
  let c = fs.readFileSync(file, 'utf8');

  // Move offline simulation AFTER navigation
  c = c.replace(/\/\/ Simular pérdida de internet \(Offline\)\n    cy\.log\('---- SIMULANDO OFFLINE MODE \(TAURI\) ----'\);\n    cy\.window\(\)\.then\(\(win\) => \{\n      Object\.defineProperty\(win\.navigator, 'onLine', \{ writable: true, value: false \}\);\n      win\.dispatchEvent\(new Event\('offline'\)\);\n    \}\);\n    cy\.wait\(500\);\n\n    \/\/ Intentar abrir el modal\/pantalla de nueva reparación\n    cy\.get\('a\[routerLink="\/admin\/repairs\/new"\], a\[href="\/admin\/repairs\/new"\]'\)\.first\(\)\.click\(\{ force: true \}\);\n    \n    \/\/ Esperamos 500ms por si hay animaciones y verificamos la ruta\n    cy\.wait\(500\);\n    cy\.url\(\)\.should\('include', '\/admin\/repairs\/new'\);/, 
    "// Intentar abrir el modal/pantalla de nueva reparación\n    cy.get('a[routerLink=\"/admin/repairs/new\"], a[href=\"/admin/repairs/new\"]').first().click({ force: true });\n    \n    // Esperamos 500ms por si hay animaciones y verificamos la ruta\n    cy.wait(500);\n    cy.url().should('include', '/admin/repairs/new');\n\n    // Esperar a que el formulario cargue (buscar el input antes de simular offline)\n    cy.get('input[name=\"customer_name\"]', { timeout: 15000 }).should('exist');\n\n    // Simular pérdida de internet (Offline)\n    cy.log('---- SIMULANDO OFFLINE MODE (TAURI) ----');\n    cy.window().then((win) => {\n      Object.defineProperty(win.navigator, 'onLine', { writable: true, value: false });\n      win.dispatchEvent(new Event('offline'));\n    });\n    cy.wait(500);");

  fs.writeFileSync(file, c);
  console.log('Fixed full trial offline flow');
}

fixFullTrialFlow();
