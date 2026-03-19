# Building local images with Vite

## Compatibility

- vite v5
- node 22+

## Installation

::: code-group

```bash [npm]
npm install -D @responsive-image/vite-plugin @responsive-image/core
```

```bash [yarn]
yarn add -D @responsive-image/vite-plugin @responsive-image/core
```

```bash [pnpm]
pnpm add -D @responsive-image/vite-plugin @responsive-image/core
```

:::

## Usage

This package provides several Vite plugins for specific aspects of image processing and transforming an import of a [local image](../usage/local-images.md) into an ES module whose exported value you can pass to the [image component](../usage/component.md).

TTo set these up use the provided `responsiveImage` function:

```js
import { responsiveImage } from '@responsive-image/vite-plugin';
```

The function will return an array of plugins, that you can add to the list of other plugins inside your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import { responsiveImage } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
    // all your other plugins ...
    responsiveImage(),
  ],
});
```

## Configuration

### Global configuration

The package comes with reasonable defaults, but if you want to customize these for all image imports globally, then you can pass an optional configuration object to `responsiveImage()`:

```js
responsiveImage({
  w: [1024, 2048],
  format: ['original', 'avif'],
});
```

### Query params

Besides global settings, you can also pass all the supported configuration options as query parameters when importimng an image:

```js
import logo from './logo.jpg?&w=32;64&quality=95&responsive';
```

Query params always take precedence over global settings passed to `responsiveImage()`.

### Configuration options

All the general [image parameters](../usage/local-images.md#image-parameters-reference) for local images can be specified both as global options or as query params, as explained above.

On top of that, there are the following Vite specific options, that you can customize the same way. In most cses, the existing defaults should be sufficient though.

### `include: string | RegExp | Array<string | RegExp>`

The path of image imports that should be processed by this plugin.

Default: `/^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)\?.*responsive.*$/`

> [!TIP]
> While you could define the config to use our plugin for all kind of image imports, we recommend preserving the ability to import images using Vite's built-in [static assets support](https://vitejs.dev/guide/assets.html) if all you need is the image URL. When using the default, images would only be processed when importing using a `?responsive` query parameter, like `import image from './assets/hero.jpg?responsive';`.

#### `name: string`

The template for the generated image files. The placeholders `[name]`, `[ext]` and `[width]` are replaced with real values.

Default: `[name]-[width]w.[ext]`

```js
responsiveImage({
  name: '[name]_[width].[ext]',
});
```

#### `styles: 'external' | 'inline'

Some plugin options like [LQIP](../usage/lqip.md) `color` and `inline` options produce CSS output. By default the CSS is emitted in a way that makes it get bundled into an external CSS file. By changing this to `inline`, the CSS is integrated into the same JavaScript bundle and applied inline by the [image component](../usage/component.md). This is especially needed for the [web component](../frameworks/wc.md) based image component, as Shadow DOM prevents any global styles by the external CSS to get applied correctly. For all other cases, using `external` is recommended for performance reasons.

Default: `external`

## TypeScript

To make TypeScript understand your image imports, we tag them using a `responsive` query parameter, that has to come _last_! Add `@responsive-image/vite-plugin/client` types to `compilerOptions.types` of your `tsconfig.json`:

```json [Vite]
{
  "compilerOptions": {
    "types": ["vite/client", "@responsive-image/vite-plugin/client"]
  }
}
```

> [!NOTE]
> We cannot use something like `*.jpg*` that works with queries, as TS only supports a single wildcard. That's why any image imports needs the `responsive` query parameter, and it has to come _last_!
> See https://github.com/microsoft/TypeScript/issues/38638
