# Solid

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/solid
```

```bash [yarn]
yarn add @responsive-image/solid
```

```bash [pnpm]
pnpm add @responsive-image/solid
```

:::

## Image component

The addon provides a `<ResponsiveImage>` component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `src` prop. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

### HTML attributes

Attributes used for image loading and rendering like `src`, `width` and `height` will be automatically set by the component. Some attributes like `loading` and `decoding` have defaults applied which can be customized. All other common `HTMLImageElement` attributes can be set on the component and will be proxied to the underlying `<img />` element.

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

### SolidStart

If your app is built with SolidStart, add the Vite plugin to your `app.config.ts`:

```ts
import { setupPlugins } from '@responsive-image/vite-plugin';
import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  vite: {
    plugins: [
      setupPlugins({
        include: /^[^?]+\.jpg\?.*responsive.*$/,
      }),
    ],
  },
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/vite-plugin` and `setupPlugins()` refer to the [Vite plugin](../build/vite.md) documentation.

## Remote images

The `@responsibe-image/cdn` package provides multiple helper functions to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<responsive-image/>` component.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.
