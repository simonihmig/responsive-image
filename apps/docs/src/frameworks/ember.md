# Ember.js

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
> For more information on how to configure `@responsive-image/webpack` and `setupLoaders()` refer to the [webpack plugin](./packages/webpack/README.md) documentation.

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
> For more information on how to configure `@responsive-image/webpack` and `setupLoaders()` refer to the [webpack plugin](./packages/webpack/README.md) documentation.

### Embroider + Vite

TODO

## Remote images

Multiple image provider helpers are provided to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<ResponsiveImage/>` component.

::: code-group

```hbs [Cloudinary]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider 'path/to/image.jpg'}}
/>
```

```hbs [Imgix]
<ResponsiveImage @src={{responsive-image-imgix-provider 'path/to/image.jpg'}} />
```

:::

The helpers all expect the path to the image (as referred to by the CDN) as the first positional argument. The different _optional_ parameters supported by the respective CDN can be passed as named arguments to the helper:

::: code-group

```hbs [Cloudinary]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    transformations=(hash co='rgb:20a020' e='colorize:50')
    quality=50
    formats=(array 'webp' 'avif')
  }}
/>
```

```hbs [Imgix]
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/image.jpg'
    params=(hash monochrome='44768B' px=10)
    quality=50
    formats=(array 'webp' 'avif')
  }}
/>
```

:::

> [!IMPORTANT]
> Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options of the respective image CDN.

### Configuration

Image CDNs will require some config like your basic account information to be set up globally in in your app's `config/addons.js` (create that if it does not exist yet!) file:

::: code-group

```js [Cloudinary]
use strict';

module.exports = {
  '@responsive-image/cloudinary': {
    cloudName: 'my-org',
  },
};
```

```js [Imgix]
'use strict';

module.exports = {
  '@responsive-image/imgix': {
    domain: 'my-org.imgix.net',
  },
};
```

:::

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
