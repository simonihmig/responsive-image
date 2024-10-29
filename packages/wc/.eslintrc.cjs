'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    '@open-wc',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-shadow': 'off', // causes enum false positives
    'import/no-unresolved': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],
  },
};
