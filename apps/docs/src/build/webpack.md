# Building local images with webpack

## Compatibility

- webpack v5
- node 20+

## Installation

::: code-group

```bash [npm]
npm install @responsive-image/webpack
```

```bash [yarn]
yarn add @responsive-image/webpack
```

```bash [pnpm]
pnpm add @responsive-image/webpack
```

:::

## Usage

This package provides several webpack loaders for specific aspects of image processing and transforming an import of an image into an ES module whose exported value you can pass to the `<ResponsiveImage/>` component.

The easiest and recommended way to set these up is to use the provided `setupLoaders` utility function:

```js
const { setupLoaders } = require('@responsive-image/webpack');
```

The function will return an array of loaders (so called chained loaders), that you can `use` to set up a webpack module rule. In your webpack config file (`webpack.config.js`) add such a module rule that tells webpack to use the provided loaders for importing images:

```js
const { setupLoaders } = require('@responsive-image/webpack');

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

The package comes with reasonable defaults, but if you want to customize these for all image imports globally, then you can pass an optional configuration object to `setupLoaders()`:

```js
setupLoaders({
  w: [1024, 2048],
  format: ['original', 'avif'],
});
```

### Query params

Besides global settings, you can also pass all the supported configuration options as query parameters when importimng an image:

```js
import logo from './logo.jpg?responsive&w=32,64&quality=95';
```

Query params alwas take precedence of global settings passed to `setupLoaders()`.

### Configuration options

| option       | type                                                                                                             | description                                                                                                                                                                                                                                                                                                                                                     | default                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `w`          | `Array<number>`                                                                                                  | The image widths to be generated. For responsive images this should match the typical device sizes, eventually taking account when the image is not covering the full screen size, like `50vw`. For fixed size images this should be the intended size and twice of it for 2x displays. Pass this as a comma separated list when using query params.            | `640, 750, 828, 1080, 1200, 1920, 2048, 3840` |
| `format`     | `Array<'original' \| 'png' \| 'jpeg' \| 'webp'\|'avif'>`                                                         | The image formats to generate. `original` refers to whatever the original image's type is. Pass this as a comma separated list when using query params.                                                                                                                                                                                                         | `['original', 'webp']`                        |
| `quality`    | `number`                                                                                                         | The image quality (0 - 100).                                                                                                                                                                                                                                                                                                                                    | 80                                            |
| `name`       | `string`                                                                                                         | The template for the generated image files. Certains placeholders like `[ext]` and `[width]` and all the common Webpack placeholders are replaced with real values.                                                                                                                                                                                             | [name]-[width]w-[hash].[ext]                  |
| `webPath`    | `string`                                                                                                         | The public URL the emitted files are referenced from. By default, this matches Webpacks public URL and the path generated from `outputPath`.                                                                                                                                                                                                                    |
| `outputPath` | `string`                                                                                                         | The file path where the public image files are emitted to. This is relative to the default folder configured for public asset files in Webpack.                                                                                                                                                                                                                 | images                                        |
| `lqip`       | `{ type: 'color' } \| {type: 'inline'; targetPixels?: number; } \| { type: 'blurhash'; targetPixels?: number; }` | Configuration for [Low Quality Image Placeholders](../../README.md#lqip). For passing this as a query param to your import, you can pass this as a string when you don't need to set anything beyond `type` (e.g. `image.jpg?responsive&lqip=inline`), or as a JSON stringified value (e.g. `image.jpg?responsive&lqip={"type":"blurhash","targetPixels":16}`). |

---
