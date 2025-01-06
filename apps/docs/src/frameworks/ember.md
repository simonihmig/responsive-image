# Ember.js

The `@responsive-image/ember` package provides a native [Ember.js](https://emberjs.com/) image component.

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/ember
```

```bash [yarn]
yarn add @responsive-image/ember
```

```bash [pnpm]
pnpm add @responsive-image/ember
```

:::

## Image component

The addon provides a `<ResponsiveImage>` component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `@src` input. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

### HTML attributes

Attributes used for image loading and rendering like `src`, `width` and `height` will be automatically set by the component. Some attributes like `loading` and `decoding` have defaults applied which can be customized. All other common `HTMLImageElement` attributes can be set on the component and will be proxied to the underlying `<img />` element.

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

### Classic build with ember-auto-import

In a classic build with ember-auto-import (make sure you are at least on version 2.7.1!), we use the [webpack plugin](../build/webpack.md) to pass the custom webpack config to the `autoImport` options:

```js
// ember-cli-build.js
let app = new EmberApp(defaults, {
  autoImport: {
    allowAppImports: ['images/**/*'],
    webpack: {
      module: {
        rules: [
          {
            resourceQuery: /responsive/,
            use: require('@responsive-image/webpack').setupLoaders(),
          },
        ],
      },
    },
  },
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/webpack` and `setupLoaders()` refer to the [webpack plugin](../build/webpack.md) documentation.

> [!Note]
> Note the use of [`allowAppImports`](https://github.com/embroider-build/ember-auto-import#app-imports) here, which is a way to make the build use ember-auto-import and thus Webpack to handle the files configured by the glob pattern of this configuration option. You can place the images files in a central subfolder under `/app`, like `app/images` as in this example, or even colocate them next to other JavaScript files by targeting specific image extensions instead of certain folders (e.g. `**/*/*.jpg`). Either way make sure that image files you import for use by `@responsive-image/ember` are correctly covered by at least one glob pattern passed to `allowAppImports`!

### Embroider + webpack

To apply this configuration to an Embroider-powered Ember app, edit your `ember-cli-build.js` file and pass the Webpack config using the [options argument of `compatBuild`](https://github.com/embroider-build/embroider?tab=readme-ov-file#options):

```js
const { Webpack } = require('@embroider/webpack');
return require('@embroider/compat').compatBuild(app, Webpack, {
  packagerOptions: {
    webpackConfig: {
      module: {
        rules: [
          {
            resourceQuery: /responsive/,
            use: require('@responsive-image/webpack').setupLoaders(),
          },
        ],
      },
    },
  },
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/webpack` and `setupLoaders()` refer to the [webpack plugin](../build/webpack.md) documentation.

### Embroider + Vite

For an Ember app running on the latest Polaris edition setup using Embroider and Vite (assuming you use the [app v2 blueprint](https://github.com/embroider-build/app-blueprint)), you need to add the image plugins provided by `@responsive-image/vite-plugin` to the `plugins` array of your `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineConfig({
  // other config...
  plugins: [
    // all your other Ember/Vite plugins ...
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
});
```

> [!IMPORTANT]
> For more information on how to configure `@responsive-image/vite-plugin` and `setupPlugins()` refer to the [Vite plugin](../build/vite.md) documentation.

## Remote images

Multiple image provider helpers are provided to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<ResponsiveImage/>` component.

The `@responsive-image/ember` addon exposes these as globally available helpers (app-js) for use in classic `.hbs` files. When using template tag (`.gjs`/`.gts`) you can import there directly from the `@responsive-image/cdn` package.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.

## TypeScript and Glint

All components and helpers have proper [Glint](https://github.com/typed-ember/glint) types, which allow you to get strict type checking in your templates.

Unless you are using [template tag](https://guides.emberjs.com/release/components/template-tag-format/) components with explicit imports already,
you need to import the addon's Glint template registry and extend your app's registry declaration as described in the [Using Addons](https://typed-ember.gitbook.io/glint/using-glint/ember/using-addons#using-glint-enabled-addons) documentation:

```ts
import '@glint/environment-ember-loose';

import type ResponsiveImageRegistry from '@responsive-image/ember/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends ResponsiveImageRegistry /* other addon registries */ {
    // local entries
  }
}
```

If you are using one of the [build plugins](../build/index.md), also make sure to have the necessary ambient declaration for image imports in place as described [here](../usage/local-images.md#typescript)!

## FastBoot

Server-side rendering using FastBoot is fully supported, but might require some tweaks.

If you are using [remote images](../usage/remote-images.md) using some of the providers for [image CDNs](../cdn/index.md), they require exposing some browser globals to the FastBoot sandbox. FastBoot does not allow access to globals that are available in both browser and node.js environments by default, like `fetch` or `URLSearchParams`, and `URL` has some [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816). To workaround these deficiencies, you need to explicitly expose some needed globals by creating a `config/fastboot.js` file in your app:

```js
'use strict';

module.exports = function () {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return { ...defaultGlobals, URL, URLSearchParams };
    },
  };
};
```
