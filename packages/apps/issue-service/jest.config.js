module.exports = {
  displayName: 'issue-service',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@sankar-dev-labs/common$': '<rootDir>/../../libs/common/src/index.ts',
    '^@sankar-dev-labs/config$': '<rootDir>/../../libs/config/src/index.ts',
    '^@sankar-dev-labs/database$': '<rootDir>/../../libs/database/src/index.ts',
    '^@sankar-dev-labs/dto$': '<rootDir>/../../libs/dto/src/index.ts',
    '^@sankar-dev-labs/interfaces$': '<rootDir>/../../libs/interfaces/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
