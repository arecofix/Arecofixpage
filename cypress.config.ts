import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://127.0.0.1:4200",
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
