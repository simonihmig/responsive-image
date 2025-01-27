import n from 'eslint-plugin-n';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  n.configs['flat/recommended'],
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // we want to handle this by eslint-plugin-import
      'n/no-missing-import': 'off',
    },
  },
);
