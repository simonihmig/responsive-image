# Fastly

The [Fastly Image Optimizer](https://www.fastly.com/documentation/reference/io/) (IO)
is supported by using a helper function in the `@responsive-image/cdn` package.

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

You need to specify your `domain` in your configuration, which you can set up in your application (e.g. `app.js`):

```js
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  fastly: {
    domain: 'images.mydomain.com',
  },
});
```

:::info

By default `fastly` is configured to only use the `webp` format since `avif`
requires a higher cost tier of Fastly IO.
You can change which formats get used by default by passing `defaultFormats`
next to `domain` in this configuration.

:::

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the `fastly` provider function passing the pathname to the image on the CDN, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { fastly } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{fastly 'path/to/uploaded/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-fastly 'path/to/uploaded/image.jpg'}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fastly } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${fastly('path/to/uploaded/image.jpg')}
    ></responsive-image>`;
  }
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { fastly } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={fastly('path/to/uploaded/image.jpg')} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { fastly } from '@responsive-image/cdn';
</script>

<ResponsiveImage src={fastly('path/to/uploaded/image.jpg')} />
```

:::

### Aspect Ratio

For the image component to be able to render `width` and `height` attributes to prevent layout shifts after loading has completed, it needs to know the aspect ratio of the source image. Unlike [local images](../usage/local-images.md) it cannot know this upfront for remote images, that's why it is recommended to supply the `aspectRatio` parameter if possible:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { fastly } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{fastly
      '/path/to/image.jpg'
      aspectRatio=1.5
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-fastly '/path/to/image.jpg' aspectRatio=1.5}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fastly } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${fastly('/path/to/image.jpg', {
        aspectRatio: 1.5,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { fastly } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={fastly('path/to/uploaded/image.jpg', {
        aspectRatio: 1.5,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { fastly } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={fastly('path/to/uploaded/image.jpg', {
    aspectRatio: 1.5,
  })}
/>
```

:::

### Custom parameters

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [parameters](https://www.fastly.com/documentation/reference/io/) by passing a `params` object:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { fastly } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{fastly
      'path/to/uploaded/image.jpg'
      params=(hash orient='l' saturation=-100)
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-fastly
    'path/to/uploaded/image.jpg'
    params=(hash orient='l' saturation=-100)
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fastly } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${fastly('path/to/uploaded/image.jpg', {
        orient: 'l',
        saturation: -100,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { fastly } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={fastly('path/to/uploaded/image.jpg', {
        orient: 'l',
        saturation: -100,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { fastly } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={fastly('path/to/uploaded/image.jpg', {
    orient: 'l',
    saturation: -100,
  })}
/>
```

:::

### Quality

Use the `quality` parameter to pass a custom [quality](https://docs.fastly.com/apis/rendering/format/q) setting
instead of the default `auto`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { fastly } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{fastly
      'path/to/uploaded/image.jpg'
      quality=50
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-fastly 'path/to/uploaded/image.jpg' quality=50}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fastly } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${fastly('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { fastly } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={fastly('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { fastly } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={fastly('path/to/uploaded/image.jpg', {
    quality: 50,
  })}
/>
```

:::

### Image formats

By default, a modern image format (webp) is referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { fastly } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{fastly
      'path/to/uploaded/image.jpg'
      formats=(array 'webp' 'avif')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-fastly
    'path/to/uploaded/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fastly } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${fastly('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    ></responsive-image>`;
  }
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { fastly } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={fastly('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { fastly } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={fastly('path/to/uploaded/image.jpg', {
    formats: ['webp', 'avif'],
  })}
/>
```

:::

:::info

See the Fastify reference documentation for a [list of supported formats](https://www.fastly.com/documentation/reference/io/format/).

`avif` requires you pay for [Fastly IO Professional](https://docs.fastly.com/en/guides/about-fastly-image-optimizer#before-you-begin).

:::
