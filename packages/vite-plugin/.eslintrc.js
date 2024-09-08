'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    babelOptions: {
      root: __dirname,
    },
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: false,
    node: true,
  },
  rules: {},
  overrides: [
    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        // Add any custom rules here
      },
    },
    // config files
    {
      files: ['./.eslintrc.js', './.prettierrc.js', 'jest.config.js'],
      parserOptions: {
        sourceType: 'script',
      },
      extends: ['plugin:n/recommended'],
    },
  ],
};
