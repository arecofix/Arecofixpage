/// <reference types="cypress" />

describe('Home Hero CTA & Mobile Layout E2E', () => {
  it('debería centrar verticalmente el botón secundario en la vista mobile (390x844)', () => {
    cy.viewport(390, 844);
    cy.visit('/');

    // 1. Validar el botón secundario del Hero
    cy.contains('a', /Descubrir cómo pueden ayudarme/i)
      .should('be.visible')
      .should('have.attr', 'href', '/portfolio')
      .then(($btn) => {
        const height = $btn.outerHeight();
        // Debe tener una altura consistente mayor a 50px
        expect(height).to.be.at.least(50);
        // Debe tener flex centering
        expect($btn).to.have.class('flex');
        expect($btn).to.have.class('items-center');
        expect($btn).to.have.class('justify-center');
      });

    // 2. Validar que el botón primario también esté presente y alineado
    cy.contains('a', /Agendar una asesoría gratuita/i)
      .should('be.visible')
      .should('have.attr', 'href', '/contacto');
  });

  it('debería interactuar con el enlace y navegar correctamente', () => {
    cy.viewport(1280, 720);
    cy.visit('/');

    cy.contains('a', /Descubrir cómo pueden ayudarme/i).click();
    cy.url().should('include', '/portfolio');
  });

  it('NO debería mostrar el botón global de compartir en la Home ni antes del footer', () => {
    cy.viewport(1280, 720);
    cy.visit('/');

    // Validar que el footer existe pero no hay app-share-buttons en el layout general
    cy.get('app-footer').should('exist');
    cy.get('app-share-buttons').should('not.exist');
  });

  it('debería mostrar el botón discreto de compartir en la página de detalle de producto', () => {
    cy.viewport(1280, 720);

    const testSlug = 'modulo-samsung-a36-oled-original-test';
    const mockTenantId = 'de967f68-7b15-44c0-bc98-952ccf06e1e5';

    // Interceptar llamadas API necesarias
    cy.intercept('GET', '**/rest/v1/product_reviews*', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-1', name: 'Repuestos', slug: 'repuestos' }]
    });
    cy.intercept('GET', 'https://dolarapi.com/v1/dolares/cripto', {
      statusCode: 200,
      body: { venta: 1250 }
    });

    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [{
        id: '3de57634-3b65-49be-b7a8-4a01176e82a0',
        name: 'Modulo samsung a36 OLED Original',
        slug: testSlug,
        description: 'Módulo de repuesto premium con garantía.',
        price: 95000,
        currency: 'ARS',
        stock: 10,
        is_active: true,
        is_featured: true,
        sku: 'MOD-A36-OLED',
        meta_title: 'Modulo samsung a36 OLED Original - Arecofix',
        meta_description: 'Módulo de repuesto premium.',
        specifications: { quality: 'Original' },
        branch_stock: [{ branch_id: mockTenantId, quantity: 10 }]
      }]
    }).as('getProduct');

    cy.visit(`/productos/detalle/${testSlug}`);
    cy.wait('@getProduct');

    // 1. Debe existir app-share-buttons en la ficha del producto
    cy.get('app-share-buttons').should('exist');

    // 2. El botón disparador discreto debe tener nombre accesible y texto 'Compartir'
    cy.get('app-share-buttons button[aria-label="Compartir este producto"]')
      .should('exist')
      .and('contain.text', 'Compartir')
      .as('shareBtn');

    // 3. No debe tener clases fixed ni sticky
    cy.get('@shareBtn').should('not.have.class', 'fixed').and('not.have.class', 'sticky');

    // 4. Al hacer clic, debe desplegar el menú de redes hacia abajo
    cy.get('@shareBtn').click();
    cy.get('app-share-buttons div[role="menu"]')
      .should('be.visible')
      .and('have.class', 'absolute')
      .and('have.class', 'top-full');

    cy.get('app-share-buttons button[aria-label="Compartir en WhatsApp"]').should('be.visible');
    cy.get('app-share-buttons button[aria-label="Copiar enlace al portapapeles"]').should('be.visible');

    // 5. Al presionar Escape, debe cerrarse
    cy.get('body').type('{esc}');
    cy.get('app-share-buttons div[role="menu"]').should('not.exist');
  });
});
