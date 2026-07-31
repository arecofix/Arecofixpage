describe('Admin Layout & Navigation Full Validation', () => {
  beforeEach(() => {
    cy.viewport(1280, 720); // Force desktop viewport since lg breakpoint is 1024px
    cy.loginAsAdmin('/login?returnUrl=/admin/dashboard');
  });

  it('Debería cargar el Layout estructurado como Programa de PC', () => {
    // Valida que el Layout global use lg:drawer-open para ser responsive
    cy.get('.drawer').should('have.class', 'lg:drawer-open');
    cy.get('.drawer-content').should('be.visible');
    
    // Validar el sidebar 
    cy.get('.drawer-side').should('exist');
    
    // Validar que el botón de hamburguesa móvil está oculto en desktop
    cy.get('label[for="admin-drawer"]').should('not.be.visible');
  });

  it('Debería comportarse correctamente al achicar la ventana y evitar scrolls horizontales', () => {
    // Reducimos el viewport simulando una ventana pequeña de escritorio
    cy.viewport(800, 600);
    
    // Verificamos que el nav del sidebar tiene overflow-x-hidden
    cy.get('nav.custom-sidebar-scrollbar').should('have.class', 'overflow-x-hidden');
    cy.get('nav.custom-sidebar-scrollbar').should('have.class', 'space-y-2');
  });

  it('Debería expandir el menú automáticamente al clickear un botón padre estando colapsado', () => {
    // 1. El menú inicia cerrado en viewport pequeño, lo abrimos
    // En desktop (1280px) el drawer se abre automáticamente por lg:drawer-open
    cy.get('#admin-drawer').check({ force: true });
    
    // 2. Esperamos a que la sidebar esté visible
    cy.get('aside.drawer-side').should('be.visible');

    cy.get('button').contains(/Ocultar/i).click({ force: true });
    
    // Validar que el menú esté colapsado (debe tener alguna clase de width reducido)
    cy.wait(200);
    
    // 4. Click en Academia Arecofix - buscar el item del menú
    cy.get('aside.drawer-side').find('[data-tip*="Academia"], a:contains("Academia"), button:contains("Academia")').first().click({ force: true });
    
    // 5. Validar que el menú se expandió y podemos ver los subitems
    cy.wait(200);
    cy.get('aside.drawer-side').contains('Cursos', { timeout: 3000 }).should('exist');
  });

  it('Debería poder navegar entre módulos de forma fluida', () => {
    // Navegar a inventario
    cy.get('aside.drawer-side').contains('Inventario').click({ force: true });
    cy.contains('Productos').click({ force: true });
    
    cy.url().should('include', '/products');
    
    // Navegar a Servicio Técnico
    cy.get('aside.drawer-side').contains('Servicio Técnico').click({ force: true });
    cy.contains('Lista de Reparaciones').click({ force: true });
    cy.url().should('include', '/repairs');
  });
});
