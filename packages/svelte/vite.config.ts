import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		browser: {
			provider: 'playwright', // or 'webdriverio'
			enabled: true,
			name: 'chromium' // browser name is required
		}
	}
});
