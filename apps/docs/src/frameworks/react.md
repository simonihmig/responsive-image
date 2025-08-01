# React image component

The `@responsive-image/react` package provides a native [React](https://react.dev/) image component to render responsive images.

## Installation

In your application's directory:

::: code-group

```bash [npm]
npm install @responsive-image/react
```

```bash [yarn]
yarn add @responsive-image/react
```

```bash [pnpm]
pnpm add @responsive-image/react
```

:::

## Image component

The addon provides a `<ResponsiveImage>` component for rendering the set of images, taking [local images](#local-images) or [remote images](#remote-images) as the `src` prop. Please refer to the main [image component](../usage/component.md) guide for all details and supported arguments!

## Local images

To process [local images](../usage/local-images.md) you will need to setup one of the [build plugins](../build/index.md) depending on your app's setup.

## Remote images

The `@responsibe-image/cdn` package provides multiple helper functions to support [remote images](../usage/remote-images.md) served from different image CDNs for use with the `<responsive-image/>` component.

Please refer to the [image CDN](../cdn/index.md) guide for details on all supported options and examples of the respective image CDN.

## Separate stylesheet and JavaScript imports

The default export includes an import of the component's CSS. If this causes problems with your build setup you can import the JavaScript and CSS separately.

```diff
- import { ResponsiveImage } from "@responsive-image/react";
+ import { ResponsiveImage } from "@responsive-image/react/responsive-image.js";
+ import "@responsive-image/react/responsive-image.css";
```

> [!TIP]
> If you use Vite to build for server-side rendering you can add `@responsive-image/react` to the [ssr.noExternals](https://vite.dev/guide/ssr.html#ssr-externals) option in your Vite config.
