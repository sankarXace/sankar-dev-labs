module.exports = {
  displayName: 'api-gateway',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@sankar-dev-labs/auth$': '<rootDir>/../../libs/auth/src/index.ts',
    '^@sankar-dev-labs/common$': '<rootDir>/../../libs/common/src/index.ts',
    '^@sankar-dev-labs/config$': '<rootDir>/../../libs/config/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
