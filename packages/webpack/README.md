# @responsive-image/webpack

Wepack image loaders, that process and resize images for use with `responsive-image`.

## Compatibility

- Webpack v5

## Installation

```
npm install @responsive-image/webpack
// or
yarn add @responsive-image/webpack
// or
pnpm add @responsive-image/webpack
```

## Usage

Please refer to the [main documentation](../../README.md) for how to set up your Ember app to use image imports using these loaders and how to use the main addon's `<ResponsiveImage/>` component.

This package provides several Webpack loaders for specific aspects of image processing and compiling an importable ES module with the necessary image data.

The easiest and recommended way to set these up is to the provided `setupLoaders` utility function:

```js
const { setupLoaders } = require('@responsive-image/webpack');
```

The function will return an array of loaders (so called chained loaders), that you can `use` to set up a Webpack module rule:

```js
module: {
  rules: [
    {
      resourceQuery: /responsive/,
      use: setupLoaders(),
    },
  ],
},
```

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

Besides globa settings, you can also pass all the supported configuration options as query parameters when importimng an image:

```js
import logo from './logo.jpg?responsive&w=32;64&quality=95';
```

Query params alwas take precedence of global settings passed to `setupLoaders()`.

### Configuration options

| option       | type                                                                                                             | description                                                                                                                                                                                                                                                                                                                                                     | default                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `w`          | `Array<number>`                                                                                                  | The image widths to be generated. For responsive images this should match the typical device sizes, eventually taking account when the image is not covering the full screen size, like `50vw`. For fixed size images this should be the intended size and twice of it for 2x displays. Pass this as a comma separated list when using query params.            | `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]` |
| `format`     | `Array<'original'\|'png'\|'jpeg'\|'webp'\|'avif'>`                                                               | The image formats to generate. `original` refers to whatever the original image's type is. Pass this as a comma separated list when using query params.                                                                                                                                                                                                         | `['original', 'webp']`                          |
| `quality`    | `number`                                                                                                         | The image quality (0 - 100).                                                                                                                                                                                                                                                                                                                                    | 80                                              |
| `name`       | `string`                                                                                                         | The template for the generated image files. Certains placeholders like `[ext]` and `[width]` and all the common Webpack placeholders are replaced with real values.                                                                                                                                                                                             | [name]-[width]w-[hash].[ext]                    |
| `webPath`    | `string`                                                                                                         | The public URL the emitted files are referenced from. By default, this matches Webpacks public URL and the path generated from `outputPath`.                                                                                                                                                                                                                    |
| `outputPath` | `string`                                                                                                         | The file path where the public image files are emitted to. This is relative to the default folder configured for public asset files in Webpack.                                                                                                                                                                                                                 | images                                          |
| `lqip`       | `{ type: 'color' } \| {type: 'inline'; targetPixels?: number; } \| { type: 'blurhash'; targetPixels?: number; }` | Configuration for [Low Quality Image Placeholders](../../README.md#lqip). For passing this as a query param to your import, you can pass this as a string when you don't need to set anything beyond `type` (e.g. `image.jpg?lqip=inline&responsive`), or as a JSON stringified value (e.g. `image.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive`). |

---

## License

This project is licensed under the [MIT License](../../LICENSE.md).
