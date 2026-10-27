/**
 * Supabase Helper for Cypress E2E Tests
 */

export function interceptRlsError(table: string, status = 401) {
  cy.intercept('POST', `**/rest/v1/${table}*`, {
    statusCode: status,
    body: {
      code: '42501',
      details: null,
      hint: null,
      message: `new row violates row-level security policy for table "${table}"`,
    },
  }).as(`rlsError_${table}`);
}

export function interceptNetworkError(urlPattern: string | RegExp) {
  cy.intercept('POST', urlPattern, { forceNetworkError: true }).as('networkError');
}
