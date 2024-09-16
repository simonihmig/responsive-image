# @responsive-image/vite

Vite plugins that process and resize images for use with `responsive-image`.

## Compatibility

- Webpack v5
- Vite v5

## Installation

```
npm install @responsive-image/vite-plugin
// or
yarn add @responsive-image/vite-plugin
// or
pnpm add @responsive-image/vite-plugin
```

## Usage

Please refer to the [main documentation](../../README.md) for how to set up your Ember app to use image imports using these loaders and how to use the main addon's `<ResponsiveImage/>` component.

This package provides several Vite plugins for specific aspects of image processing and compiling an importable ES module with the necessary image data.

```js
import logo from './logo.jpg?responsive';
```

Todo

## Configuration

### Global configuration

The package comes with reasonable defaults, but if you want to customize these for all image imports globally, then you can pass an optional configuration object to `setupLoaders()`:

Example:

```js
import { setupPlugins as responsiveImages } from '@responsive-image/vite-plugin'

export default defineConfig({
  plugins: [
    responsiveImages({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
})
```

TODO

### Query params

Besides global settings, you can also pass all the supported configuration options as query parameters when importimng an image:

```js
import logo from './logo.jpg?responsive&w=32;64&quality=95';
```

Query params always take precedence of global settings passed to `setupLoaders()`.

### Configuration options

TODO


### TypeScript

If you are using TypeScript, you need to augment Vite types, to allow `?responsive` query parameter:

```json
// tsconfig.json
{
  "include": ["...", "responsive.d.ts"],
}
```

```ts
// responsive.d.ts
import 'vite/client.d.ts'
import type { ImageData } from '@responsive-image/core'

/**
 * Augment the global Vite client module
 *
 * Adds support for importing images with the `?responsive` query parameter.
 *
 * @see https://vitejs.dev/guide/api-plugin.html#typescript-for-custom-events
 */
declare module 'vite/client.d.ts' {
  declare module '*?responsive' {
    const imageData: ImageData
    export default imageData
  }
}
```

## License

This project is licensed under the [MIT License](../../LICENSE.md).
