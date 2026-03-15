# Vue image component

The `@responsive-image/vue` package provides a native [Vue.js](https://vuejs.org/) image component to render responsive images.

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/vue
```

```bash [yarn]
yarn add @responsive-image/vue
```

```bash [pnpm]
pnpm add @responsive-image/vue
```

:::

## Image component

The addon provides a `<ResponsiveImage>` component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `src` prop. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

### Usage as a Vue plugin

While importing the image component wherever you need it is recommended (e.g. for tree-shaking), you can also install the package as a [Vue plugin](https://vuejs.org/guide/reusability/plugins.html) to [register the component globally](https://vuejs.org/guide/components/registration.html#global-registration) as `<ResponsiveImage>`:

```js
import { createApp } from 'vue';
import ResponsiveImagePlugin from '@responsive-image/vue';

const app = createApp({});

app.use(ResponsiveImagePlugin);
```

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

### Nuxt

If your app is built with Nuxt, add the Vite plugin to your `nuxt.config.ts`:

```ts
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineNuxtConfig({
  // ...
  vite: {
    plugins: [setupPlugins()],
  },
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/vite-plugin` and `setupPlugins()` refer to the [Vite plugin](../build/vite.md) documentation.

## Remote images

The `@responsibe-image/cdn` package provides multiple helper functions to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<responsive-image/>` component.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.
