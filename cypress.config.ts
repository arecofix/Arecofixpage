import { defineConfig } from "cypress";
import { resetTestTenant } from "./cypress/support/seed-db";

export default defineConfig({
  projectId: 'hfghsi',
  e2e: {
    chromeWebSecurity: false,
    testIsolation: true,
    video: true,
    trashAssetsBeforeRuns: false,
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
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
    baseUrl: "http://localhost:4200",
    supportFile: "cypress/support/e2e.ts",
    numTestsKeptInMemory: 0,
  },

  env: {
    apiUrl: "http://localhost:3000/api", // Ejemplo para API tests
  },

  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
      options: {
        projectConfig: {
          root: "",
          sourceRoot: "src",
          buildOptions: {
            outputPath: "dist/arecofix",
            main: "src/main.ts",
          },
        },
      },
    },
    specPattern: "**/*.cy.ts",
  },
});

