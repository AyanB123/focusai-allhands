module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/renderer/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/renderer/pages/$1',
    '^@store/(.*)$': '<rootDir>/src/renderer/store/$1',
    '^@styles/(.*)$': '<rootDir>/src/renderer/styles/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main/main.js',
    '!src/renderer/index.js',
  ],
};