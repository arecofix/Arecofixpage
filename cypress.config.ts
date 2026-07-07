import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'hfghsi',
  e2e: {
    testIsolation: false,
    video: true,
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:4200",
    supportFile: "cypress/support/e2e.ts",
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

