---
outline: [2, 3]
---

# Autorender

The image processing capabilities of the [Autorender](https://autorender.io) image CDN are supported by a helper function provided to you by this library.

## Setup

Make sure you have the `@responsive-image/cdn` package installed:

::: code-group

```bash [npm]
npm install @responsive-image/cdn
```

```bash [yarn]
yarn add @responsive-image/cdn
```

```bash [pnpm]
pnpm add @responsive-image/cdn
```

:::

You need to specify your Autorender `domain` and `workspace` in your configuration, which you can set up in your application (e.g. `app.js`). The workspace ID is the public routing identifier in your delivery URLs and is not a secret:

```js
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  autorender: {
    domain: 'assets.autorender.io',
    workspace: 'wB5HrlVhGq',
  },
});
```

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the autorender provider function passing the source path of the image inside your workspace, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { autorender } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{autorender 'products/chair.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage @src={{responsive-image-autorender 'products/chair.jpg'}} />
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autorender } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${autorender('products/chair.jpg')}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { autorender } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={autorender('products/chair.jpg')} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { autorender } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={autorender('products/chair.jpg')} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { autorender } from '@responsive-image/cdn';
</script>

<ResponsiveImage src={autorender('products/chair.jpg')} />
```

```vue [Vue]
<script setup>
import { ResponsiveImage } from '@responsive-image/vue';
import { autorender } from '@responsive-image/cdn';
</script>

<template>
  <ResponsiveImage :src="autorender('products/chair.jpg')" />
</template>
```

:::

### Aspect Ratio

For the image component to be able to render `width` and `height` attributes to prevent layout shifts after loading has completed, it needs to know the aspect ratio of the source image. Unlike [local images](../usage/local-images.md) it cannot know this upfront for remote images, that's why it is recommended to supply the `aspectRatio` parameter if possible:

```ts [Lit]
autorender('products/chair.jpg', {
  aspectRatio: 1.5,
});
```

### Quality

Use the `quality` parameter to pass a custom quality setting (`1`–`100`) instead of Autorender's per-format default:

```ts [Lit]
autorender('products/chair.jpg', {
  quality: 50,
});
```

### Image formats

By default the component lets Autorender select the format from the request `Accept` header.

If you want a `picture` tag with one or more specific formats as `source` tags you can specify them using the `formats` argument. Autorender supports `avif`, `webp`, `jpeg`, and `png`:

```ts [Lit]
autorender('products/chair.jpg', {
  formats: ['avif', 'webp'],
});
```

### Custom transforms

Besides the resizing and format tokens the library adds implicitly, you can append any additional [Autorender transform tokens](https://www.autorender.io/docs/transformations/introduction) verbatim by passing a `transforms` array:

```ts [Lit]
autorender('products/chair.jpg', {
  transforms: ['e_sharpen', 'br_16'],
});
```
