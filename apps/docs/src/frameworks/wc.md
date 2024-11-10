# Web Component

The `@responsive-image/wc` package provides a standard browser-native [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), that you can use with any [framework supporting web component](https://custom-elements-everywhere.com/), or none at all.

> [!Note]
> This package is implemented using [Lit](https://lit.dev/), and while you can use Lit as well to build your app with web components, this is not a requirement at all!

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/wc
```

```bash [yarn]
yarn add @responsive-image/wc
```

```bash [pnpm]
pnpm add @responsive-image/wc
```

:::

## Image component

The addon provides a `<responsive-image>` web component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `src` _property_. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

To make the image component available to the browser by registering as a custom element, you need to add a side-effect import:

```js
import '@responsive-image/wc';
```

> [!Important]
> As the `src` input is an `ImageData` object, you cannot pass this as an HTML _attribute_. Web components only support string based attributes. So make sure to set it as a _property_ using JavaScript. In case of [Lit](https://lit.dev/), you would use the dot prefix notation for [property expressions](https://lit.dev/docs/templates/expressions/#property-expressions): ``html`<responsive-image .src=${image} ></responsive-image>\` ``.

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

## Remote images

The `@responsibe-image/cdn` package provides multiple helper functions to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<responsive-image/>` component.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.
