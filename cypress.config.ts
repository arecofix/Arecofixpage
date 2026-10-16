import { defineConfig } from "cypress";
import { resetTestTenant } from "./cypress/support/seed-db";

export default defineConfig({
  projectId: 'hfghsi',
  e2e: {
    baseUrl: process.env['CYPRESS_BASE_URL'] || 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    testIsolation: true,
    trashAssetsBeforeRuns: false,
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        async seedDatabase() {
          try {
            const url = config.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
            const key = config.env.SUPABASE_SERVICE_ROLE_KEY;
            const tenantId = config.env.TEST_TENANT_ID || '11111111-1111-1111-1111-111111111111';
            
            if (!key || key === 'your-secret-key') {
              console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is placeholder, skipping DB seed (mocks will be used).');
              return null;
            }
            
            await resetTestTenant(url, key, tenantId);
          } catch (err) {
            console.warn('⚠️ seedDatabase task encountered an error:', err);
          }
          return null;
        }
      });
      return config;
    },
    supportFile: "cypress/support/e2e.ts",
    numTestsKeptInMemory: 0,
  },

  env: {
    apiUrl: "http://localhost:3000/api",
    mobileViewport: { width: 390, height: 844 },
    tabletViewport: { width: 768, height: 1024 },
  },
});

