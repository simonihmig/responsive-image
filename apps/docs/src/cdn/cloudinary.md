# Cloudinary

The image processing capabilities of the [Cloudinary](https://cloudinary.com) image CDN are supported by a helper function provided to you by this library.

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

You need to specify the `cloudName` in your configuration, which you can set up in your application (e.g. `app.js`):

```js
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  cloudinary: {
    cloudName: 'my-org',
  },
});
```

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the cloudinary provider function passing the reference to the image on the CDN and optional transformations, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{cloudinary 'path/to/uploaded/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary 'path/to/uploaded/image.jpg'}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary('path/to/uploaded/image.jpg')}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={cloudinary('path/to/uploaded/image.jpg')} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return <ResponsiveImage src={cloudinary('path/to/uploaded/image.jpg')} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage src={cloudinary('path/to/uploaded/image.jpg')} />
```

:::

### Aspect Ratio

For the image component to be able to render `width` and `height` attributes to prevent layout shifts after loading has completed, it needs to know the aspect ratio of the source image. Unlike [local images](../usage/local-images.md) it cannot know this upfront for remote images, that's why it is recommended to supply the `aspectRatio` parameter if possible:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinary
      '/path/to/image.jpg'
      aspectRatio=1.5
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary '/path/to/image.jpg' aspectRatio=1.5}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary('/path/to/image.jpg', {
        aspectRatio: 1.5,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        aspectRatio: 1.5,
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        aspectRatio: 1.5,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={cloudinary('path/to/uploaded/image.jpg', {
    aspectRatio: 1.5,
  })}
/>
```

:::

### Transformations

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [Cloudinary transformations](https://cloudinary.com/documentation/transformation_reference) by using the
`transformations` parameter:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinary
      'path/to/uploaded/image.jpg'
      transformations=(hash co='rgb:20a020' e='colorize:50')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary
    'path/to/uploaded/image.jpg'
    transformations=(hash co='rgb:20a020' e='colorize:50')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary('path/to/uploaded/image.jpg', {
        co: 'rgb:20a020',
        e: 'colorize:50',
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        co: 'rgb:20a020',
        e: 'colorize:50',
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        co: 'rgb:20a020',
        e: 'colorize:50',
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={cloudinary('path/to/uploaded/image.jpg', {
    co: 'rgb:20a020',
    e: 'colorize:50',
  })}
/>
```

:::

It accepts an object of transformations, or an array of objects for [chained transformations](https://cloudinary.com/documentation/image_transformations#chained_transformations).

### Quality

Use the `quality` parameter to pass a custom [quality](https://cloudinary.com/documentation/transformation_reference#q_quality) setting
instead of the default `auto`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinary
      'path/to/uploaded/image.jpg'
      quality=50
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary 'path/to/uploaded/image.jpg' quality=50}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={cloudinary('path/to/uploaded/image.jpg', {
    quality: 50,
  })}
/>
```

:::

### Image formats

By default, modern image formats (webp, avif) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinary
      'path/to/uploaded/image.jpg'
      formats=(array 'webp' 'avif')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary
    'path/to/uploaded/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={cloudinary('path/to/uploaded/image.jpg', {
    formats: ['webp', 'avif'],
  })}
/>
```

:::

### Remote source

The provider supports Cloudinary's [`fetch`](https://cloudinary.com/documentation/fetch_remote_images) mode to automatically fetch images from a remote source and deliver them (with optional custom transformations) through Cloudinary's CDN. Simply pass a fully qualified http(s) URL:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinary } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinary
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinary(
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      )}
    ></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary(
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      )}
    />
  );
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import { cloudinary } from '@responsive-image/cdn';

export default function MyApp() {
  return (
    <ResponsiveImage
      src={cloudinary(
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      )}
    />
  );
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import { cloudinary } from '@responsive-image/cdn';
</script>

<ResponsiveImage
  src={cloudinary(
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
  )}
/>
```

:::
