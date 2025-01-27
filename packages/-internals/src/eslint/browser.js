import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config({
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
});
