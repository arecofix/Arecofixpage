module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/cypress/'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  },
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.array.ts',
    '!src/app/main.ts',
    '!src/app/main.server.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 12,
      functions: 8,
      lines: 13,
      statements: 13
    },
    './src/app/core/interceptors/': {
      branches: 70,
      functions: 50,
      lines: 70,
      statements: 70
    }
  }
};

