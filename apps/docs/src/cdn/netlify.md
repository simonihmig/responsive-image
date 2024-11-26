# Netlify

The image processing capabilities of the [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/) are supported by a helper function provided to you by this library.

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

By default, requests to the Netlify CDN will use URLs relative to your deployed app, which will work when the app itself is also deployed to Netlify. For other cases, you can specify the `domain` of your Netlify site in your configuration, which you can set up in your application (e.g. `app.js`):

```js
import { setConfig } from '@responsive-image/core';

setConfig('cdn', {
  netlify: {
    domain: 'my-org.netlify.app',
  },
});
```

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the Netlify provider function passing the path to your image, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { netlify } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{netlify '/path/to/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage @src={{responsive-image-netlify '/path/to/image.jpg'}} />
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { netlify } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${netlify('/path/to/image.jpg')}
    ></responsive-image>`;
  }
}
```

:::

This assumes that your application itself is also served from Netlify, so that `/path/to/image.jpg` is an image in your repo that is also deployed to Netlify. If your application containing that image is not on Netlify, you can still make Netlify process and serve it, you just need to point to it with an absolue URL to make use of Netlify's [remote source](#remote-source) support.

### Quality

Use the `quality` parameter to pass a custom [quality](https://cloudinary.com/documentation/transformation_reference#q_quality) setting instead of the default `auto`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { netlify } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{netlify
      '/path/to/image.jpg'
      quality=50
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-netlify '/path/to/image.jpg' quality=50}}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { netlify } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${netlify('/path/to/image.jpg', {
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
import { netlify } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{netlify
      '/path/to/image.jpg'
      formats=(array 'webp' 'avif')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-netlify
    '/path/to/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { netlify } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${netlify('/path/to/image.jpg', {
        formats: ['webp', 'avif'],
      })}
    ></responsive-image>`;
  }
}
```

:::

### Remote source

The provider supports Netlify's [`remote path`](https://docs.netlify.com/image-cdn/overview/#remote-path) mode to automatically fetch images from a remote source and deliver them through Netlify's CDN. Simply pass a fully qualified http(s) URL:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { netlify } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{netlify
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-netlify
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
  }}
/>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { netlify } from '@responsive-image/cdn';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image
      .src=${netlify(
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      )}
    ></responsive-image>`;
  }
}
```

:::