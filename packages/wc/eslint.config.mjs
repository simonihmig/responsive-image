import { configs } from 'eslint-plugin-lit';
import { base, browser, nodeESM } from '@responsive-image/internals/eslint';

export default [
  ...base,
  ...browser.map((c) => ({
    ...c,
    files: ['src/**/*'],
  })),
  configs['flat/recommended'],
  ...nodeESM.map((c) => ({
    ...c,
    files: ['eslint.config.mjs', 'vitest.config.ts'],
  })),
];
