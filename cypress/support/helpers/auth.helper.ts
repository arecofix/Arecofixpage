/**
 * Auth Helper for Cypress E2E Tests
 */

export function setupAdminAuthMocks() {
  const session = {
    provider_token: null,
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    user: {
      id: '00000000-0000-0000-0000-000000000000',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@arecofix.com.ar',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'super_admin' },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  const fakeProfile = {
    id: session.user.id,
    email: 'admin@arecofix.com.ar',
    role: 'super_admin',
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
    first_name: 'Admin',
    last_name: 'Arecofix',
    is_active: true
  };

  cy.intercept('**/rest/v1/profiles*', (req) => {
    const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
    req.reply({
      statusCode: 200,
      body: wantsObject ? fakeProfile : [fakeProfile]
    });
  }).as('getProfileMock');

  cy.intercept('**/rest/v1/tenants*', (req) => {
    const mockTenant = {
      id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      name: 'Arecofix',
      slug: 'arecofix',
      custom_domain: 'localhost',
      is_active: true,
      features: {
        hasProducts: true,
        hasServices: true,
        hasCourses: true,
        hasRepairs: true,
        hasBlog: true
      },
      usd_rate: 1000
    };
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockTenant : [mockTenant]
    });
  }).as('getTenantsMock');

  cy.intercept('GET', '**/rest/v1/branches*', (req) => {
    const mockBranch = {
      id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
      name: 'Sede Central',
      slug: null,
      is_active: true,
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
    };
    req.reply({
      statusCode: 200,
      body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockBranch : [mockBranch]
    });
  }).as('getBranchesMock');

  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: session.user
  }).as('getUserMock');

  return { session, fakeProfile };
}
