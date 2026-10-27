import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Checkout — Validaciones de Formulario', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 10000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
    });
  });

  it('debería rechazar checkout con carrito vacío', () => {
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [],
    });

    cy.visit('/checkout');
    cy.get('[data-cy="btn-go-payment"]').should('be.disabled');
  });

  it('debería exigir campos obligatorios (nombre, email, teléfono, dirección)', () => {
    cy.visit('/checkout');

    // Touch name field without entering text
    cy.get('[data-cy="checkout-name"]').focus().blur();
    cy.contains('El nombre es requerido').should('be.visible');
  });

  it('debería mostrar error de validación cuando el email es inválido', () => {
    cy.visit('/checkout');

    cy.get('[data-cy="checkout-email"]').clear().type('correo-invalido').blur();
    cy.contains('Email inválido').should('be.visible');
  });

  it('debería exigir código postal de 4 dígitos', () => {
    cy.visit('/checkout');

    cy.get('[data-cy="checkout-postal-code"]').clear().type('12').blur();
    cy.contains('4 dígitos').should('be.visible');
  });
});
