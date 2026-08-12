import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress/flat';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  cypress.configs.recommended,
  {
    ignores: [
      'dist/',
      '.angular/',
      'node_modules/',
      'coverage/',
      'cypress/videos/',
      'cypress/screenshots/'
    ],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Arecofix standard currently has some anys, disable to prevent massive errors
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  {
    files: ['cypress/**/*.ts'],
    rules: {
      'cypress/no-unnecessary-waiting': 'warn',
    }
  }
);
