# Building local images with Vite

## Compatibility

- vite v5
- node 20+

## Installation

::: code-group

```bash [npm]
npm install @responsive-image/vite-plugin
```

```bash [yarn]
yarn add @responsive-image/vite-plugin
```

```bash [pnpm]
pnpm add @responsive-image/vite-plugin
```

:::

## Usage

This package provides several Vite plugins for specific aspects of image processing and transforming an import of an image into an ES module whose exported value you can pass to the `<ResponsiveImage/>` component.

The easiest and recommended way to set these up is to use the provided `setupPlugins` utility function:

```js
import { setupPlugins } from '@responsive-image/vite-plugin';
```

The function will return an array of plugins, that you can add to the list of other plugins inside your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
    // all your other plugins ...
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
});
```

> [!TIP]
> While you could define the config to use our plugins for all kind of image imports, we recommend preserving the ability to import images using Vite's built-in [static assets support](https://vitejs.dev/guide/assets.html) if all you need is the image URL. When following the example config above, you would opt-in to responsive image processing only when importing using a `?responsive` query parameter, like `import image from './assets/hero.jpg?responsive';`.

## Configuration

### Global configuration

The package comes with reasonable defaults, but if you want to customize these for all image imports globally, then you can pass an optional configuration object to `setupPlugins()`:

```js
setupPlugins({
  include: /^[^?]+\.jpg\?.*responsive.*$/,
  w: [1024, 2048],
  format: ['original', 'avif'],
});
```

### Query params

Besides global settings, you can also pass all the supported configuration options as query parameters when importimng an image:

```js
import logo from './logo.jpg?responsive&w=32,64&quality=95';
```

Query params alwas take precedence of global settings passed to `setupPlugins()`.

### Configuration options

| option    | type                                                                                                             | description                                                                                                                                                                                                                                                                                                                                                     | default                                       |
| --------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `w`       | `Array<number>`                                                                                                  | The image widths to be generated. For responsive images this should match the typical device sizes, eventually taking account when the image is not covering the full screen size, like `50vw`. For fixed size images this should be the intended size and twice of it for 2x displays. Pass this as a comma separated list when using query params.            | `640, 750, 828, 1080, 1200, 1920, 2048, 3840` |
| `format`  | `Array<'original' \| 'png' \| 'jpeg' \| 'webp'\|'avif'>`                                                         | The image formats to generate. `original` refers to whatever the original image's type is. Pass this as a comma separated list when using query params.                                                                                                                                                                                                         | `['original', 'webp']`                        |
| `quality` | `number`                                                                                                         | The image quality (0 - 100).                                                                                                                                                                                                                                                                                                                                    | 80                                            |
| `name`    | `string`                                                                                                         | The template for the generated image files. The placeholders `[name]`, `[ext]` and `[width]` are replaced with real values.                                                                                                                                                                                                                                     | [name]-[width]w.[ext]                         |
| `lqip`    | `{ type: 'color' } \| {type: 'inline'; targetPixels?: number; } \| { type: 'blurhash'; targetPixels?: number; }` | Configuration for [Low Quality Image Placeholders](../../README.md#lqip). For passing this as a query param to your import, you can pass this as a string when you don't need to set anything beyond `type` (e.g. `image.jpg?responsive&lqip=inline`), or as a JSON stringified value (e.g. `image.jpg?responsive&lqip={"type":"blurhash","targetPixels":16}`). |

---
