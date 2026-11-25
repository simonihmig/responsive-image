---
outline: [2, 3]
---

# Bunny Optimizer

The [Dynamic Image API](https://bunny.net/docs/optimizer/dynamic-images) of [Bunny Optimizer](https://bunny.net/optimizer/) is supported by a helper function provided to you by this library.

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

In your [bunny.net](https://bunny.net) dashboard, enable Bunny Optimizer on your Pull Zone and turn on the **Dynamic Image API** under **Optimizer → Settings**. To let Bunny Optimizer pick the best format automatically, also enable **WebP** there.

Then set the hostname of your Pull Zone in your configuration, which you can set up in your application (e.g. `app.js`):

```js
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  bunny: {
    domain: 'my-zone.b-cdn.net',
  },
});
```

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the `bunny` provider function passing the path to the image on your Pull Zone, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { bunny } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{bunny 'path/to/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage @src={{responsive-image-bunny 'path/to/image.jpg'}} />
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bunny } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${bunny('path/to/image.jpg')}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={bunny('path/to/image.jpg')} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={bunny('path/to/image.jpg')} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { bunny } from '@responsive-image/cdn';
</script>

<ResponsiveImage src={bunny('path/to/image.jpg')} />
```

```vue [Vue]
<script setup>
import { ResponsiveImage } from '@responsive-image/vue';
import { bunny } from '@responsive-image/cdn';
</script>

<template>
  <ResponsiveImage :src="bunny('path/to/image.jpg')" />
</template>
```

:::

You can also pass a full URL, which is useful if you serve images from more than one Pull Zone. In that case the configured `domain` is not used:

```js
bunny('https://other-zone.b-cdn.net/path/to/image.jpg');
```

### Aspect Ratio

For the image component to be able to render `width` and `height` attributes to prevent layout shifts after loading has completed, it needs to know the aspect ratio of the source image. Unlike [local images](../usage/local-images.md) it cannot know this upfront for remote images, that's why it is recommended to supply the `aspectRatio` parameter if possible:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { bunny } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{bunny 'path/to/image.jpg' aspectRatio=1.5}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-bunny 'path/to/image.jpg' aspectRatio=1.5}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bunny } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${bunny('path/to/image.jpg', {
        aspectRatio: 1.5,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        aspectRatio: 1.5,
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        aspectRatio: 1.5,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { bunny } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={bunny('path/to/image.jpg', {
    aspectRatio: 1.5,
  })}
/>
```

:::

### Custom parameters

Besides the `width`, `format` and `quality` parameters that the library adds itself,
you can add any other [Bunny Optimizer parameter](https://bunny.net/docs/optimizer/dynamic-images) by passing a `params` object:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { bunny } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{bunny
      'path/to/image.jpg'
      params=(hash aspect_ratio='16:9' sharpen='true')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-bunny
    'path/to/image.jpg'
    params=(hash aspect_ratio='16:9' sharpen='true')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bunny } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${bunny('path/to/image.jpg', {
        params: { aspect_ratio: '16:9', sharpen: 'true' },
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        params: { aspect_ratio: '16:9', sharpen: 'true' },
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        params: { aspect_ratio: '16:9', sharpen: 'true' },
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { bunny } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={bunny('path/to/image.jpg', {
    params: { aspect_ratio: '16:9', sharpen: 'true' },
  })}
/>
```

:::

If you crop the image with `aspect_ratio`, remember to pass the matching `aspectRatio` option too (e.g. `aspectRatio: 16 / 9`).

### Quality

Use the `quality` parameter (`0` to `100`) to override the default quality,
which is `85` or the value from your Pull Zone's Smart Image Optimization settings:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { bunny } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{bunny 'path/to/image.jpg' quality=50}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-bunny 'path/to/image.jpg' quality=50}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bunny } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${bunny('path/to/image.jpg', {
        quality: 50,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        quality: 50,
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        quality: 50,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { bunny } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={bunny('path/to/image.jpg', {
    quality: 50,
  })}
/>
```

:::

### Image formats

By default no `format` parameter is sent, so Bunny Optimizer picks the format based on what the browser supports (WebP must be enabled in your Optimizer settings for this).

If you want a `picture` tag with one or more specific formats as `source` tags you can specify them using the `formats` argument. Supported formats are `webp`, `avif`, `jpeg`, `png` and `gif`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { bunny } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{bunny
      'path/to/image.jpg'
      formats=(array 'avif' 'webp')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-bunny
    'path/to/image.jpg'
    formats=(array 'avif' 'webp')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bunny } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${bunny('path/to/image.jpg', {
        formats: ['avif', 'webp'],
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        formats: ['avif', 'webp'],
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { bunny } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={bunny('path/to/image.jpg', {
        formats: ['avif', 'webp'],
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { bunny } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={bunny('path/to/image.jpg', {
    formats: ['avif', 'webp'],
  })}
/>
```

:::

> [!NOTE]
> Bunny Optimizer only produces AVIF for images up to 4 megapixels and falls back to another format for larger ones.
