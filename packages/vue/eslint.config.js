import { base, browser, nodeESM } from '@responsive-image/internals/eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  ...base,
  ...browser.map((c) => ({
    ...c,
    files: ['src/**/*'],
  })),
  ...nodeESM.map((c) => ({
    ...c,
    files: [
      'eslint.config.js',
      'rollup.config.js',
      'vite.config.ts',
      'vitest.config.ts',
    ],
  })),
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];
