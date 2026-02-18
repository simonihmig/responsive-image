import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte()],
	test: {
		include: ['tests/**/*.{test,test.svelte}.{js,ts}'],
		watch: false,
		browser: {
			provider: playwright({
				launchOptions: { channel: 'chrome' }
			}),
			enabled: true,
			instances: [
				{
					browser: 'chromium'
				}
			]
		}
	}
});
