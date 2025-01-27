import n from 'eslint-plugin-n';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(n.configs['flat/recommended'], {
  languageOptions: {
    sourceType: 'script',
    globals: {
      ...globals.node,
    },
  },
});
