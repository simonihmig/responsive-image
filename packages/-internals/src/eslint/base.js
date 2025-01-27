import { resolve } from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import ts from 'typescript-eslint';

export default ts.config(
  includeIgnoreFile(resolve('./.gitignore')),
  js.configs.recommended,
  ...ts.configs.recommended.map((c) => ({
    ...c,
    files: ['**/*.{ts,tsx,mts,cts,gts,svelte}'],
  })),
  prettier,
  {
    files: ['**/*.{ts,tsx,mts,cts,gts,svelte}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // we want to handle this by eslint-plugin-import
      'n/no-missing-import': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            ['sibling', 'parent'],
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
);
