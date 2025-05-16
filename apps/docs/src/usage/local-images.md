# Local images

Local images are static images that are part of your app's code base and its git repository. At build-time of your app, these will be processed by a [build plugin](../build/index.md), which will generate all the combinations of image sizes and [image formats](./image-formats.md).

This happens whenever you import such an image in your code. The returned value of that import is a `ImageData` structure that you can pass directly into the `src` argument of your framework's [image component](./component.md).

## Setting up the build plugin

Which build plugin to use depends on the build tool (bundler) you use in your app. This project supports both [Vite](../build/vite.md) and [webpack](../build/webpack.md). Please refer to the respective guides for detailled setup instructions!

> [!TIP]
> While there can be different ways to set things up, we recommend setting up the build plugin in such a way that it only gets used for an image import that has an explicit `?responsive` query parameter. This is to preserve the ability to import images using the build tools' original asset support ([asset modules](https://webpack.js.org/guides/asset-modules/) for webpack or Vite's built-in [static assets](https://vitejs.dev/guide/assets)), if all you need is the image URL. So only the images that you want to pass to the responsive image component will need to get imported with that `?responsive` query parameter.

## Specifying image processing parameters

The build plugins support a number of parameters that influence how the imported responsive images get processed. The most essential ones are for setting the image sizes (widths) and [image formats](./image-formats.md), but there a lot more for e.g. image effects.

These can be specified globally as defaults to the build plugin. But all of them can be overriden for every instance of an image import by specifying them as query parameters added to the imported image path. This lets you use the same original image with different parameters, depending on where and how it is going to be rendered.

The following example is using a `200px` wide [fixed layout](./component.md#fixed-layout), therefore it only needs to generate the image with a width of 200 as well as 400 (for high density displays aka "retina"). On top of that it tweaks the image quality and adds an inlined small image as a [Low Quality Image Placeholder](./lqip.md):

::: code-group

```gjs [Ember]
import { ResponsiveImage } from '@responsive-image/ember';
import image from './image.jpg?w=200;400&quality=90&lqip=inline&responsive';

<template>
  <ResponsiveImage @src={{image}} @width={{200}} />
</template>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import image from './image.jpg?w=200;400&quality=90&lqip=inline&responsive';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image .src=${image} with="200"></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import image from './image.jpg?w=200;400&quality=90&lqip=inline&responsive';

export default function MyApp() {
  return <ResponsiveImage src={image} width={200} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import image from './image.jpg?w=200;400&quality=90&lqip=inline&responsive';

export default function MyApp() {
  return <ResponsiveImage src={image} width={200} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import image from './image.jpg?w=200;400&quality=90&lqip=inline&responsive';
</script>

<ResponsiveImage src={image} width={200} />
```

:::

## Image parameters reference

### Core parameters

#### `w: number[]`

The image widths to be generated. For responsive images this should match the typical device sizes, eventually taking account when the image is not covering the full screen size, like `50vw`. For fixed size images this should be the intended size and twice of it for 2x displays. Pass this as a semicolon separated list when using query params.

Defaults: `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

```js
import image from 'image.jpg?w=200;400&responsive';
```

#### `format: string[]`

The [image formats](./image-formats.md) to generate. Pass this as a semicolon separated list when using query params. Supported formats are:

- `original` refers to whatever the original image's type is.
- `jpeg`
- `png`
- `webp`
- `avif`

Defaults: `['original', 'webp']`

```js
import image from 'image.jpg?format=original;webp;avif&responsive';
```

#### `lqip: string | json`

Specify the options to render Low Quality Image Placeholders. Please refer to the [LQIP](./lqip.md) guide for details and examples.

### Image processing parameters

The following table lists all supported image parameters that apply image optional adjustments or effects.

> [!Note]
> These parameters are supported by the [imagetools](https://github.com/JonasKruckenberg/imagetools) library. The following section provides a brief summary, you can find its more detailed [documentation here](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/parameters.md). Do not use any of its "output parameters" though, as they are not supported nor needed for ResponsiveImage.

#### `background: string`

This instructs other parameters (e.g. `rotate`) to use the specified color when filling empty spots in the image.

```js
import image from 'image.jpg?background=#FFFFFFAA&responsive';
import image from 'image.jpg?background=hsl(360,100%,50%)&responsive';
import image from 'image.jpg?background=rgb(200,200,200)&responsive';
import image from 'image.jpg?background=blue&responsive';
```

#### `blur: number | boolean`

Blurs the image. When no argument is provided it performs a fast blur, otherwise a more accurate gaussian blur.

```js
import image from 'image.jpg?blur&responsive';
import image from 'image.jpg?blur=0.75&responsive';
import image from 'image.jpg?blur=100&responsive';
```

#### `fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'`

When `aspect` is provided (which adjust the height, while width is always given implicitly), then this parameter specifies the method to fit the image into the given dimensions.

```js
import image from 'image.jpg?fit=cover&responsive';
```

#### `flatten: boolean`

Remove the alpha channel of the image, transparent pixels will be merged with the color set by [background](#background-string).

#### `flip: boolean`

Flip the image about the vertical axis. This step is always performed **after** any rotation.

```js
import image from 'image.jpg?flip&responsive';
```

#### `flop: boolean`

Flop the image about the horizontal axis. This step is always performed **after** any rotation.

```js
import image from 'image.jpg?flop&responsive';
```

#### `grayscale: boolean`

Converts the image to a grayscale image.

```js
import image from 'image.jpg?grayscale&responsive';
```

#### `hue: number`

Adjusts the images hue rotation by the given number of degrees.

#### `saturation: number`

Adjusts the images saturation with the given saturation multiplier.

#### `brightness: number`

Adjusts the images brightness with the given brightness multiplier.

#### `invert: boolean`

Invert the image.

```js
import image from 'image.jpg?invert&responsive';
```

#### `lossless: boolean`

Use lossless compression mode where supported (`avif` and `webp`).

```js
import image from 'image.jpg?format=webp&lossless&responsive';
```

#### `median: number | boolean`

Applies a median filter. This is commonly used to remove noise from images.

```js
import image from 'image.jpg?median&responsive';
import image from 'image.jpg?median=3&responsive';
import image from 'image.jpg?median=50&responsive';
```

#### `normalize: boolean`

Stretching its luminance to cover the full dynamic range enhancing its contrast.

```js
import image from 'image.jpg?normalize&responsive';
```

#### `position: string`

When `aspect` is provided and `fit` is one of `cover` or `contain`, then this parameter can be used to set the position of the image.

See sharp's [resize options](https://sharp.pixelplumbing.com/api-resize#resize) for a detailed explanation of each.

#### `quality: number`

Adjust the image quality (1 - 100). Higher number means better quality but also larger file size.

```js
import image from 'image.jpg?format=webp&quality=100&responsive';
```

<!-- #### `w: number`

Resizes the image to be the specified amount of pixels wide. If not given the height will be scaled accordingly.

```js
import image from 'image.jpg?w=200&responsive';
import image from 'image.jpg?w=200;400;700&responsive';
```

#### `h: number`

Set the height explicitly. Usually this is derived from the image's aspect ratio and the given width.

```js
import image from 'image.jpg?h=200&responsive';
import image from 'image.jpg?h=200;400;700&responsive';
``` -->

#### `aspect: string | number`

Adjust the height of the image (width is always given implicitly) to match the specified aspect ratio. The value can be a string in the form `16:9` or a positive number representing the width/height ratio.

```js
import image from 'image.jpg?aspect=16:9&responsive';
import image from 'image.jpg?aspect=1.5&responsive';
```

<!-- ### Without# `withoutEnlargement: boolean`

Prevents the image from being resized if the specified or calculated width or height are greater than the original width or height. Must be passed with a [width](#width), [height](#height) or [aspect](#aspect) parameter.

```js
import image from 'image.jpg?w=200;400&withoutEnlargement&responsive';
import image from 'image.jpg?aspect=16:9&withoutEnlargement&responsive';
import Images from 'image.jpg?aspect=16:9&h=200;400;700&withoutEnlargement&responsive';
``` -->

<!-- ### Without# `withoutReduction: boolean`

Prevents the image from being resized if the specified or calculated width or height are less than the original width or height. Must be passed with a [width](#width), [height](#height) or [aspect](#aspect) parameter.

```js
import image from 'image.jpg?height=300;600;900&withoutReduction&responsive';
import image from 'image.jpg?aspect=9:16&withoutReduction&responsive';
import Images from 'image.jpg?aspect=16:9&h=200;400;700&withoutEnlargement&withoutReduction&responsive';
``` -->

#### `rotate: number`

Rotate the image by the specified number of degrees.

> NOTE: You can change the background color the empty parts are filled with by setting the [background](#background-string) parameter.

```js
import image from 'image.jpg?rotate=90&responsive';
```

#### `tint: string`

Tints the image using the provided chroma while preserving the image luminance.

```js
import image from 'image.jpg?tint=#ffaa22&responsive';
import image from 'image.jpg?tint=rgba(10,33,127)&responsive';
```

## TypeScript

To make TypeScript understand your image imports, we tag them using a `responsive` query parameter, that has to come _last_!

Add this ambient declaration to a file in your app, like e.g. `types/global.d.ts` (and make sure that your `tsconfig.json` includes that file!):

```ts
declare module '*responsive' {
  import type { ImageData } from '@responsive-image/core';
  const value: ImageData;
  export default value;
}
```

> [!NOTE]
> We cannot use something like `*.jpg*` that works with queries, as TS only supports a single wildcard. That's why any image imports needs the `responsive` query parameter, and it has to come _last_!
> See https://github.com/microsoft/TypeScript/issues/38638
