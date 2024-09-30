'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: ['*.js', '*.ts', '*.cjs', '.mjs', '.cts', '.mts', '.cts'],
      options: {
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
    {
      files: ['*.json'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.hbs'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.gjs', '*.gts'],
      options: {
        singleQuote: true,
        templateSingleQuote: false,
        trailingComma: 'es5',
      },
    },
  ],
};
