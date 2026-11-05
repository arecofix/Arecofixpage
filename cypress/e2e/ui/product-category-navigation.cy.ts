import { buildMockProduct } from '../../support/mock-factories';

describe('Product Category Navigation & Reactivity Flow', () => {
  const catModulos = {
    id: 'cat-modulos-uuid',
    name: 'Módulos y Pantallas',
    slug: 'modulos',
    parent_id: 'cat-repuestos-uuid',
    is_active: true,
  };

  const catHerramientas = {
    id: 'cat-herramientas-uuid',
    name: 'Herramientas de Precisión',
    slug: 'herramientas',
    parent_id: null,
    is_active: true,
  };

  const productModulo = buildMockProduct({
    id: 'prod-modulo-1',
    name: 'Módulo Samsung A32 OLED',
    category_id: 'cat-modulos-uuid',
    price: 25000,
    stock: 5,
  });

  const productHerramienta = buildMockProduct({
    id: 'prod-herramienta-1',
    name: 'Estación de Soldar Yaxun',
    category_id: 'cat-herramientas-uuid',
    price: 85000,
    stock: 3,
  });

  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake(() => {});
      cy.stub(win.console, 'warn').callsFake(() => {});
    });

    cy.intercept('GET', '**/rest/v1/*categor*slug=eq.modulos*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [catModulos],
    }).as('getModulosCat');

    cy.intercept('GET', '**/rest/v1/*categor*slug=eq.herramientas*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [catHerramientas],
    }).as('getHerramientasCat');

    cy.intercept('GET', '**/rest/v1/*categor*is_active=eq.true*', {
      statusCode: 200,
      body: [catModulos, catHerramientas],
    }).as('getAllCategories');
  });

  it('debería cargar la categoría inicial y refrescar reactivamente al cambiar a otra categoría', () => {
    cy.intercept('GET', '**/rest/v1/products?select=*&category_id=in.*cat-modulos-uuid*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [productModulo],
    }).as('getProductsModulos');

    cy.intercept('GET', '**/rest/v1/products?select=*&category_id=in.*cat-herramientas-uuid*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [productHerramienta],
    }).as('getProductsHerramientas');

    // 1. Visitar primera categoría
    cy.visit('/productos/categoria/repuestos/modulos');
    cy.wait('@getModulosCat');

    // El título y breadcrumbs deben reflejar Módulos
    cy.get('h1').should('contain', 'Módulos');

    // 2. Navegar a otra categoría
    cy.visit('/productos/categoria/herramientas');
    cy.wait('@getHerramientasCat');

    // El título debe reflejar la nueva categoría
    cy.get('h1').should('contain', 'Herramientas');
  });

  it('debería actualizar la query URL al buscar dentro de la categoría', () => {
    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [productModulo],
    }).as('getProductsSearch');

    cy.visit('/productos/categoria/repuestos/modulos');
    cy.wait('@getModulosCat');

    // Buscar con el input de búsqueda de la página de categoría
    cy.get('products-by-category-page input[placeholder*="Buscar"]:visible')
      .first()
      .clear()
      .type('Samsung', { delay: 50 });
    cy.wait(800);

    // La URL debe actualizarse con ?q=Samsung
    cy.url().should('include', 'q=Samsung');
  });
});
