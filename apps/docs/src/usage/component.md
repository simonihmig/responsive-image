# Image component

The `ResponsiveImage` component is provided by one of the packages for the supported [frontend frameworks](../frameworks/index.md). It is used to render the required markup, following best practices for responsive images.

The only required argument is `src`, which expects an `ImageData` structure coming from an import or an [Image CDN](../cdn/index.md) (see [Core concepts](./concepts.md#image-source)):

::: code-group

```gjs [Ember]
import { ResponsiveImage } from '@responsive-image/ember';
import heroImage from './hero.jpg?responsive';

<template>
  <ResponsiveImage @src={{heroImage}} />
</template>
```

```ts [Lit]
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import heroImage from './hero.jpg?responsive';
import '@responsive-image/wc';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`<responsive-image .src=${heroImage}></responsive-image>`;
  }
}
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import heroImage from './hero.jpg?responsive';

export default function MyApp() {
  return <ResponsiveImage src={heroImage} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import heroImage from './hero.jpg?responsive';

export default function MyApp() {
  return <ResponsiveImage src={heroImage} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import heroImage from './hero.jpg?responsive';
</script>

<ResponsiveImage src={heroImage} />
```

:::

This will render an `<img>` element wrapped in `<picture>` referencing all the resized images in the different formats, for the browser to decide which image it can support and fits best given the current context (device, screen size, user preferences like low bandwidth etc.):

```html
<picture>
  <source
    srcset="
      /assets/images/hero1920w.avif 1920w,
      /assets/images/hero1280w.avif 1280w,
      /assets/images/hero640w.avif   640w
    "
    type="image/avif"
  />
  <source
    srcset="
      /assets/images/hero1920w.webp 1920w,
      /assets/images/hero1280w.webp 1280w,
      /assets/images/hero640w.webp   640w
    "
    type="image/webp"
  />
  <source
    srcset="
      /assets/images/hero1920w.jpg 1920w,
      /assets/images/hero1280w.jpg 1280w,
      /assets/images/hero640w.jpg   640w
    "
    type="image/jpeg"
  />
  <img
    src="1920"
    height="1280"
    class="ri-responsive"
    loading="lazy"
    decoding="async"
  />
</picture>
```

> [!NOTE]
> Actually it will likely have more image sizes, but this has been reduced here for readability.

## Layout modes

### Responsive layout

By default, the component will render the image in a responsive layout i.e. one that automatically takes the whole available width of its parent element.
For this it will automatically apply the following CSS to your image:

```css
img {
  width: 100%;
  height: auto;
}
```

If your image width is not `100vw`, say `70vw` for example, you can specify this using the `size` property (only `vw` is supported as a unit for now):

::: code-group

```hbs [Ember]
<ResponsiveImage @src={{heroImage}} @size={{70}} />
```

```ts [Lit]
html`<responsive-image .src=${heroImage} size="70"></responsive-image>`;
```

```tsx [React]
<ResponsiveImage src={heroImage} size={70} />
```

```tsx [Solid]
<ResponsiveImage src={heroImage} size={70} />
```

```svelte [Svelte]
<ResponsiveImage src={heroImage} size={70} />
```

:::

This will render the corresponding [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-sizes) on all `<source>` elements.

You can also set the attribute like this if your responsive image width is more complicated:

::: code-group

```hbs [Ember]
<ResponsiveImage @src={{heroImage}} @sizes='(min-width: 800px) 800px, 100vw' />
```

```ts [Lit]
html`<responsive-image
  .src=${heroImage}
  sizes="(min-width: 800px) 800px, 100vw"
></responsive-image>`;
```

```tsx [React]
<ResponsiveImage src={heroImage} sizes="(min-width: 800px) 800px, 100vw" />
```

```tsx [Solid]
<ResponsiveImage src={heroImage} sizes="(min-width: 800px) 800px, 100vw" />
```

```svelte [Svelte]
<ResponsiveImage src={heroImage} sizes="(min-width: 800px) 800px, 100vw" />
```

:::

### Fixed layout

A fixed layout will render the image with the specific dimensions as specified. Just provide either `width` or `height` to opt into that mode. Also make sure that the generated image variants have the appropriate sizes:

::: code-group

```gjs [Ember]
import { ResponsiveImage } from '@responsive-image/ember';
import logoImage from './hero.jpg?w=320;640&responsive';

<template>
  <ResponsiveImage @src={{logoImage}} @width={{320}} />
</template>
```

```ts [Lit]
import logoImage from './hero.jpg?w=320;640&responsive';

html`<responsive-image .src=${logoImage} with="320"></responsive-image>`;
```

```tsx [React]
import { ResponsiveImage } from '@responsive-image/react';
import logoImage from './hero.jpg?w=320;640&responsive';

export default function () {
  return <ResponsiveImage src={logoImage} width={320} />;
}
```

```tsx [Solid]
import { ResponsiveImage } from '@responsive-image/solid';
import logoImage from './hero.jpg?w=320;640&responsive';

export default function () {
  return <ResponsiveImage src={logoImage} width={320} />;
}
```

```svelte [Svelte]
<script>
  import { ResponsiveImage } from '@responsive-image/svelte';
  import logoImage from './hero.jpg?w=320;640&responsive';
</script>

<ResponsiveImage src={logoImage} width={320} />
```

:::

It will still render an `<img>` wrapped in a `<picture>`, but this time it will provide the image with the optimal width (smallest width which is equal or above the target width),
and additionally a `2x` variant for devices with high pixel densities:

```html
<picture>
  <source
    srcset="/assets/images/hero320w.avif 1x, /assets/images/hero640w.avif 2x"
    type="image/avif"
  />
  <source
    srcset="/assets/images/hero320w.webp 1x, /assets/images/hero640w.webp 2x"
    type="image/webp"
  />
  <source
    srcset="/assets/images/hero320w.jpg 1x, /assets/images/hero640w.jpg 2x"
    type="image/jpeg"
  />
  <img
    src="/assets/images/hero320w.jpg"
    width="320"
    height="213"
    class="ri-fixed"
    loading="lazy"
    decoding="async"
  />
</picture>
```

> [!NOTE]
> It is sufficient to supply either `width` or `height`, the component will still render the missing attribute according to the image's aspect ratio!

## HTML attributes

Attributes used for image loading and rendering like `src`, `width` and `height` will be automatically set by the component. Some attributes like `loading` and `decoding` have defaults applied which can be customized. All other common [`HTMLImageElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) attributes can be set on the component and will be proxied to the underlying `<img />` element.
