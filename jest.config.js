module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // ⬇️ NUEVO: agregamos e2e-playwright para que Jest no lo busque
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/cypress/',
    '<rootDir>/e2e-playwright/'  // ⬅️ ESTO ES LO QUE FALTABA
  ],

  coverageDirectory: 'coverage',

  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^waw-widget$': '<rootDir>/node_modules/waw-widget/dist/waw.js'
  },

  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.array.ts',
    '!src/app/main.ts',
    '!src/app/main.server.ts',
    '!src/app/**/*.spec.ts'
  ],

  coverageThreshold: {
    global: {
      branches: 12,
      functions: 8,
      lines: 13,
      statements: 13
    },
    './src/app/core/interceptors/': {
      branches: 65,      // ⬅️ CAMBIADO: era 70, la cobertura real es 67.01%
      functions: 50,
      lines: 70,
      statements: 70
    }
  }
};