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

You need to specify the `cloudName` in your configuration, which can vary across the supported frameworks:

::: code-group

```js [Ember]
// config/addons.js
module.exports = {
  '@responsive-image/ember': {
    cloudinary: {
      cloudName: 'my-org',
    },
  },
};
```

```js [Lit]
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  cloudinary: {
    cloudName: 'my-org',
  },
});
```

:::

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the cloudinary provider function passing the reference to the image on the CDN and optional transformations, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinaryProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{cloudinaryProvider 'path/to/uploaded/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider 'path/to/uploaded/image.jpg'}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinaryProvider('path/to/uploaded/image.jpg')}
    ></responsive-image>`;
  }
}
```

:::

### Transformations

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [Cloudinary transformations](https://cloudinary.com/documentation/transformation_reference) by using the
`transformations` parameter:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinaryProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinaryProvider
      'path/to/uploaded/image.jpg'
      transformations=(hash co='rgb:20a020' e='colorize:50')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    transformations=(hash co='rgb:20a020' e='colorize:50')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinaryProvider('path/to/uploaded/image.jpg', {
        co: 'rgb:20a020',
        e: 'colorize:50',
      })}
    ></responsive-image>`;
  }
}
```

:::

:::

It accepts an object of transformations, or an array of objects for [chained transformations](https://cloudinary.com/documentation/image_transformations#chained_transformations).

### Quality

Use the `quality` parameter to pass a custom [quality](https://cloudinary.com/documentation/transformation_reference#q_quality) setting
instead of the default `auto`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinaryProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinaryProvider
      'path/to/uploaded/image.jpg'
      quality=50
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    quality=50
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinaryProvider('path/to/uploaded/image.jpg', {
        quality: 50,
      })}
    ></responsive-image>`;
  }
}
```

:::

### Image formats

By default, all supported image formats (PNG, JPEG, WEBP, AVIF) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinaryProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinaryProvider
      'path/to/uploaded/image.jpg'
      formats=(array 'webp' 'avif')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinaryProvider('path/to/uploaded/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    ></responsive-image>`;
  }
}
```

:::

### Remote source

The provider supports Cloudinary's [`fetch`](https://cloudinary.com/documentation/fetch_remote_images) mode to automatically fetch images from a remote source and deliver them (with optional custom transformations) through Cloudinary's CDN. Simply pass a fully qualified http(s) URL:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { cloudinaryProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{cloudinaryProvider
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${cloudinaryProvider(
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      )}
    ></responsive-image>`;
  }
}
```

:::
