# Building local images with Vite

## Compatibility

- vite v5
- node 20+

## Installation

::: code-group

```bash [npm]
npm install @responsive-image/vite-plugin @responsive-image/core
```

```bash [yarn]
yarn add @responsive-image/vite-plugin @responsive-image/core
```

```bash [pnpm]
pnpm add @responsive-image/vite-plugin @responsive-image/core
```

:::

## Usage

This package provides several Vite plugins for specific aspects of image processing and transforming an import of an image into an ES module whose exported value you can pass to the `<ResponsiveImage/>` component.

The easiest and recommended way to set these up is to use the provided `setupPlugins` utility function:

```js
import { setupPlugins } from '@responsive-image/vite-plugin @responsive-image/core';
```

The function will return an array of plugins, that you can add to the list of other plugins inside your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import { setupPlugins } from '@responsive-image/vite-plugin @responsive-image/core';

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
import logo from './logo.jpg?&w=32;64&quality=95&responsive';
```

Query params always take precedence over global settings passed to `setupPlugins()`.

### Configuration options

All the general [image parameters](../usage/local-images.md#image-parameters-reference) for local images can be specified both as global options or as query params, as explained above.

On top of that, there are the following Vite specific options, that you can customize the same way. In most cses, the existing defaults should be sufficient though.

#### `name: string`

The template for the generated image files. The placeholders `[name]`, `[ext]` and `[width]` are replaced with real values.

Default: `[name]-[width]w.[ext]`

```js
setsetupPluginsupLoaders({
  name: '[name]_[width].[ext]',
});
```
