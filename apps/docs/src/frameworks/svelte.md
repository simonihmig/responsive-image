# Svelte

The `@responsive-image/svelte` package provides a native [Svelte](https://svelte.dev/) image component.

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/svelte
```

```bash [yarn]
yarn add @responsive-image/svelte
```

```bash [pnpm]
pnpm add @responsive-image/svelte
```

:::

## Image component

The addon provides a `<ResponsiveImage>` component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `src` prop. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

### SvelteKit

If your app is built with SvelteKit, add the Vite plugin to your `vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { setupPlugins } from '@responsive-image/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/vite-plugin` and `setupPlugins()` refer to the [Vite plugin](../build/vite.md) documentation.

## Remote images

The `@responsibe-image/cdn` package provides multiple helper functions to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<responsive-image/>` component.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.
