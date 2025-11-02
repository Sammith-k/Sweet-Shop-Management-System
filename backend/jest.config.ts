import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.spec.ts'],
  setupFiles: ['dotenv/config'],
  globalSetup: '<rootDir>/src/tests/globalSetup.ts'
};

export default config;