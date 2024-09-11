# Low Quality Image Placeholders

_Low Quality Image Placeholder_ is a technique to give users a preview of the image while it is loading. This library supports different types, all with their own tradeoffs. Based on the cute dog you saw before, you can see here how these different techniques will look like.

> [!NOTE]
> This library only supports LQIP for [local images](./local-images.md). While you could also load a placeholder from a [remote](./remote-images.md) source like an image CDN, due to the additional network roundtrip the placeholder image will likely come too late to make a difference. The additional network connection might even delay loading the actual images.

## Color

This is the most basic technique, calculating the dominant color of the image, and setting it as the background color of the images while it loads.
The "cost" is basically just a few bytes, for the CSS and the hex code of the color.

![dominant color LQIP of a dog image](../assets/lqip-color.png)

### Usage

You can opt into this LQIP mode either on a case by case basis by adding query parameters to your import, or setting this up as a global default in your [Vite](../build/vite.md) or [Webpack](../build/webpack.md) configuration:

::: code-group

```js [Import query params]
import heroImage from './hero.jpg?responsive&lqip=color';
```

```js [Webpack global options]
setupLoaders({
  lqip: { type: 'color' },
});
```

```js [Vite global options]
setupPlugins({
  lqip: { type: 'color' },
});
```

:::

## Inline image

This creates a very small thumbnail of the original image, wraps it into a SVG and applies a blurry filter. This is then
set as a base64 encoded data-URL as the background of the image while it loads. The example below consumes 348 bytes (uncompressed).

![blurry LQIP of a dog image](../assets/lqip-inline.png)

### Usage

You can opt into this LQIP mode either on a case by case basis by adding query parameters to your import, or setting this up as a global default in your [Vite](../build/vite.md) or [Webpack](../build/webpack.md) configuration:

::: code-group

```js [Import query params]
import heroImage from './hero.jpg?responsive&lqip=inline';
```

```js [Webpack global options]
setupLoaders({
  lqip: { type: 'inline' },
});
```

```js [Vite global options]
setupPlugins({
  lqip: { type: 'inline' },
});
```

:::

The size of that placeholder image will be automatically calculated (taking into account its aspect ratio) for a total number of around 60 pixels. So let's say you have an image with an aspect ratio of 3:2 (e.g. 1200x800 pixels). In that case the LQIP will then have a size of 9x6 pixels (54 in total). If you don't feel happy with that site, you can tweak that using the `targetPixels` option, again per import or as a global setting:

::: code-group

```js [Import query params]
import heroImage from './hero.jpg?responsive&lqip={"type":"inline","targetPixels":120}';
```

```js [Webpack global options]
setupLoaders({
  lqip: { type: 'inline', targetPixels: 120 },
});
```

```js [Vite global options]
setupPlugins({
  lqip: { type: 'inline', targetPixels: 120 },
});
```

:::

## BlurHash

[BlurHash](https://blurha.sh/) is an encoding algorithm and library, dedicated for the very purpose of generating nice looking blurry placeholders, without the overhead of a real image format, which was never optimized for that kind of _tiny_ images. This example consumes just 40 bytes (uncompressed).

![blurry LQIP of a dog image](../assets/lqip-blurhash.png)

But the tradeoff here is that it needs a runtime library for decoding, which takes about 4.7KB (1.9KB compressed). Therefore it
is less suited if you have just a few images, but shines if you need placeholders for a lot!

### Usage

You can opt into this LQIP mode either on a case by case basis by adding query parameters to your import, or setting this up as a global default in your [Vite](../build/vite.md) or [Webpack](../build/webpack.md) configuration:

::: code-group

```js [Import query params]
import heroImage from './hero.jpg?responsive&lqip=blurhash';
```

```js [Webpack global options]
setupLoaders({
  lqip: { type: 'blurhash' },
});
```

```js [Vite global options]
setupPlugins({
  lqip: { type: 'blurhash' },
});
```

:::

### Runtime setup

As mentioned earlier, this LQIP mode needs an additional runtime script to support decoding of BlurHash in thee browser.

When your app is served in a SSR setup, it is important to make the BlurHash encoded LQIPs get displayed before your app's JavaScript has loaded, because the latter can take time on a slow network link, and that is exactly the use case where you want your BlurHash based image placeholders used by your prerendered HTML to be already visible.

There is a dedicated scipt available for this to add to your `index.html`. It is important to add this _before_ your actual app's scripts. For optimal performance, preload that script using a `<link rel="prefetch">` element after the CSS links in your `<head>` section.

The exact setup can vary slightly depending on the chosen [frontend framework](../frameworks/index.md):

::: code-group

```html [Ember]
<html>
  <head>
    <!-- other head elements... --->

    <link
      rel="prefetch"
      href="{{rootURL}}@responsive-image/ember/blurhash.js"
    />

    {{content-for "head-footer"}}
  </head>
  <body>
    {{content-for "body"}}

    <script type="module" async data-fastboot-ignore>
      import { applySSR } from '{{rootURL}}@responsive-image/ember/blurhash.js';
      applySSR();
    </script>
    <script src="{{rootURL}}assets/vendor.js"></script>
    <script src="{{rootURL}}assets/app.js"></script>

    {{content-for "body-footer"}}
  </body>
</html>
```

:::
