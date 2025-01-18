import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],

	test: {
		include: ['tests/**/*.{test,test.svelte}.{js,ts}'],
		watch: false,
		browser: {
			provider: 'playwright', // or 'webdriverio'
			enabled: true,
			name: 'chromium', // browser name is required,
			providerOptions: {
				launch: {
					channel: 'chrome'
				}
			}
		}
	}
});
