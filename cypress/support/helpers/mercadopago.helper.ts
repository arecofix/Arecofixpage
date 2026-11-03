/**
 * Mercado Pago Cypress E2E Helper
 */

export interface MockPreferenceOptions {
  id?: string;
  initPoint?: string;
  statusCode?: number;
  bodyOverride?: Record<string, unknown>;
}

export function interceptCreatePreference(options: MockPreferenceOptions = {}) {
  const defaultBody = {
    success: true,
    id: options.id || 'pref_test_123456789',
    init_point: options.initPoint || 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_test_123456789',
    sandbox_init_point: options.initPoint || 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_test_123456789',
    ...options.bodyOverride,
  };

  return cy.intercept('POST', '**/api/mercadopago/create-preference', (req) => {
    if (options.statusCode && options.statusCode >= 400) {
      req.reply({
        statusCode: options.statusCode,
        body: { success: false, error: 'Mercado Pago error simulated' },
      });
    } else {
      req.reply({
        statusCode: options.statusCode || 200,
        body: defaultBody,
      });
    }
  }).as('createPreferenceRequest');
}

export function interceptMpCheckoutDirect() {
  return cy.intercept('POST', 'https://api.mercadopago.com/checkout/preferences', {
    fixture: 'mp-preference-approved.json',
  }).as('mpDirectPreference');
}
