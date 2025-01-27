import {
  base,
  browser,
  nodeCJS,
  nodeESM,
} from '@responsive-image/internals/eslint';
import ember from 'eslint-plugin-ember/recommended';

export default [
  ...base,
  ...browser,
  ember.configs.base,
  ember.configs.gjs,
  ember.configs.gts,
  {
    files: ['src/**/*'],
    rules: {
      // require relative imports use full extensions
      'import/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  ...nodeCJS.map((c) => ({
    ...c,
    files: ['**/*.cjs'],
  })),
  ...nodeESM.map((c) => ({
    ...c,
    files: ['**/*.mjs'],
  })),
];
