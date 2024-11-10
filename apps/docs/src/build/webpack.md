# Building local images with webpack

## Compatibility

- webpack v5
- node 20+

## Installation

::: code-group

```bash [npm]
npm install @responsive-image/webpack @responsive-image/core
```

```bash [yarn]
yarn add @responsive-image/webpack @responsive-image/core
```

```bash [pnpm]
pnpm add @responsive-image/webpack @responsive-image/core
```

:::

## Usage

This package provides several webpack loaders for specific aspects of image processing and transforming an import of a [local image](../usage/local-images.md) into an ES module whose exported value you can pass to the [image component](../usage/component.md).

The easiest and recommended way to set these up is to use the provided `setupLoaders` utility function:

```js
const {
  setupLoaders,
} = require('@responsive-image/webpack @responsive-image/core');
```

The function will return an array of loaders (so called chained loaders), that you can `use` to set up a webpack module rule. In your webpack config file (`webpack.config.js`) add such a module rule that tells webpack to use the provided loaders for importing images:

```js
const {
  setupLoaders,
} = require('@responsive-image/webpack @responsive-image/core');

const config = {
  entry: './src/index.ts',
  // ...
  module: {
    rules: [
      // other rules...
      {
        resourceQuery: /responsive/,
        use: setupLoaders(),
      },
    ],
  },
};
```

> [!TIP]
> While you could define the module rule to use our webpack loader for all kind of image imports, we recommend preserving the ability to import images using webpack's built-in [asset modules](https://webpack.js.org/guides/asset-modules/) if all you need is the image URL. When following the example config above, you would opt-in to responsive image processing only when importing using a `?responsive` query parameter, like `import image from './assets/hero.jpg?responsive';`.

## Configuration

### Global configuration

The package comes with reasonable defaults, but if you want to customize these for all image imports globally, then you can pass an optional object with [configuration options](#configuration-options) to `setupLoaders()`:

```js
setupLoaders({
  w: [1024, 2048],
  format: ['original', 'avif'],
});
```

### Query params

Besides global settings, you can also pass all the supported [configuration options](#configuration-options) as query parameters when importing an image:

```js
import logo from './logo.jpg?&w=32;64&quality=95&responsive';
```

Query params always take precedence over global settings passed to `setupLoaders()`.

### Configuration options

All the general [image parameters](../usage/local-images.md#image-parameters-reference) for local images can be specified both as global options or as query params, as explained above.

On top of that, there are the following webpack specific options, that you can customize the same way. In most cses, the existing defaults should be sufficient though.

#### `name: string`

The template for the generated image files. Certains placeholders like `[ext]` and `[width]` and all the common Webpack placeholders are replaced with real values.

Default: `[name]-[width]w-[hash].[ext]`

```js
setupLoaders({
  name: '[name]_[width].[hash].[ext]',
});
```

#### `webPath: string`

The public URL the emitted files are referenced from. By default, this matches Webpacks public URL and the path generated from `outputPath`.

```js
setupLoaders({
  webPath: 'https://images.example.com/',
});
```

#### `outputPath: string`

The file path where the public image files are emitted to. This is relative to the default folder configured for public asset files in Webpack.

Default: `images`
