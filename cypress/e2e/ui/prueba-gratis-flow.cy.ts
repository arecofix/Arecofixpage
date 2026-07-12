describe('Flujo de Prueba Gratis - Arecofix', () => {
  const edgeFunctionUrl = '**/functions/v1/create-trial-tenant*';

  beforeEach(() => {
    // Interceptamos la llamada a la edge function para no crear tenants reales en la BD de pruebas
    cy.intercept('POST', '**/functions/v1/create-trial-tenant', {
      statusCode: 200,
      body: {
        success: true,
        tenantId: 'mock-tenant-id'
      },
    }).as('createTrialTenant');

    cy.intercept('POST', '**').as('allPosts');
  });

  it('debe permitir navegar desde fixtecnicos y completar el formulario de solicitud', () => {
    // 1. Visitamos la página FixTécnicos
    cy.visit('/fixtecnicos');

    // 2. Hacemos click en el botón de "Obtener Licencia"
    cy.get('a[routerLink="/prueba-gratis"], a[href="/prueba-gratis"]').first().click({ force: true });

    // 3. Validamos que la URL haya cambiado y esperamos a que el DOM se estabilice
    cy.url().should('include', '/prueba-gratis');
    cy.wait(1000); // Esperamos a que Angular inicialice los Reactive Forms

    // 4. Llenamos el formulario con un ligero delay para asegurar que Angular detecte los cambios
    cy.get('input[formControlName="businessName"]').type('Taller Test E2E', { delay: 50 });
    cy.get('input[formControlName="userName"]').type('Usuario QA', { delay: 50 });
    cy.get('input[formControlName="whatsapp"]').type('1122334455', { delay: 50 });
    cy.get('input[formControlName="email"]').type('qa.test@arecofix.com.ar', { delay: 50 });

    // 5. Enviamos el formulario
    cy.get('button[type="submit"]').contains('Solicitar Prueba Gratis').click();

    // 6. Esperamos a que la petición mockeada sea llamada
    cy.wait('@createTrialTenant').then((interception) => {
      expect(interception.request.body.businessName).to.eq('Taller Test E2E');
      expect(interception.request.body.email).to.eq('qa.test@arecofix.com.ar');
      expect(interception.request.body.whatsapp).to.eq('1122334455');
    });

    // 7. Validamos que la UI haya cambiado al estado de éxito
    cy.contains('¡Tu sucursal ha sido creada!').should('be.visible');
    cy.contains('qa.test@arecofix.com.ar').should('be.visible');

    // 8. Validamos que el botón de descarga del instalador esté presente
    cy.get('button').contains('Descargar Arecofix Desktop').should('be.visible');
  });
});
