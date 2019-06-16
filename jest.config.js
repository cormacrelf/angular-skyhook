module.exports = {
  bail: true,
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.html?$',
      tsConfig: './tsconfig.test.json',
      useExperimentalLanguageServer: true,
    },
  },
  testURL: 'http://localhost',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/test/test-setup.ts',
  ],
  moduleNameMapper: {
    '@angular-skyhook/(.*)': '<rootDir>/packages/$1',
  },
  testRegex: '.*spec.ts$',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  transformIgnorePatterns: [
      // the dnd folks started building esnext with import/export statements
    '/node_modules/(?!dnd-core|react-dnd-test-backend)/',
    '/dist/',
  ],
  modulePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  projects: [
    '<rootDir>',
  ],
  collectCoverageFrom: [
    'packages/core/*/src/**/*.ts',
    'packages/multi-backend/*/src/**/*.ts',
    'packages/sortable/*/src/**/*.ts',
  ],
  coveragePathIgnorePatterns: [
    '.*(spec|const|config|mock|module|public-api|index|mock|model|d).ts',
  ],
  coverageReporters: [
    'lcovonly',
    'html',
  ],
}

