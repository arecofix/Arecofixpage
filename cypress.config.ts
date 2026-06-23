import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:4200",
    supportFile: false, // Omitimos support file de momento
  },

  env: {
    apiUrl: "http://localhost:3000/api", // Ejemplo para API tests
  },

  allowCypressEnv: false,

});
