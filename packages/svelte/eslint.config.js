import { base, browser, nodeESM } from '@responsive-image/internals/eslint';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default [
	...base,
	...browser.map((c) => ({
		...c,
		files: ['src/**/*']
	})),
	...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	...nodeESM.map((c) => ({
		...c,
		files: ['eslint.config.js', 'vite.config.ts']
	}))
];
