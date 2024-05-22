# BlurHash

Add support for [BlurHash](https://blurha.sh/) encoded [Low Quality Image Placeholders](../../README.md#lqip) (LQIP) to responsive-image.

## Compatibility

- Webpack v5
- requires using `@responsive-image/webpack`

## Installation

### FastBoot

When your app is served in a SSR setup using FastBoot or prember, it is important to make the BlurHash encoded LQIPs get displayed before your app's JavaScript has loaded, because the latter can take time on a slow network link, and that is exactly the use case where you want your BlurHash based image placeholders used by your prerendered HTML to be already visible.

There is a dedicated scipt available for this to add to your `index.html`. It is important to add this _before_ your `vendor.js` script as shown here:

```html
<script type="module" async data-fastboot-ignore>
  import { applySSR } from '{{rootURL}}@responsive-image/ember/blurhash.js';
  applySSR();
</script>
<script src="{{rootURL}}assets/blurhash.js"></script>
<script src="{{rootURL}}assets/vendor.js"></script>
```

For optimal performance, preload that script by putting this link right after the CSS links in your `<head>` section:

```html
<link integrity="" rel="stylesheet" href="{{rootURL}}assets/vendor.css" />
<link integrity="" rel="stylesheet" href="{{rootURL}}assets/your-app.css" />

<link rel="prefetch" href="{{rootURL}}@responsive-image/ember/blurhash.js" />
```

## Usage

Please make sure you have read the [main documentation](../../README.md) first, especially the section on [BlurHash](../../README.md#blurhash).

## Configuration

You have to setup BlurHash encoded LQIP globally by passing the `lqip` option to `setupLoaders()`, or opt-in on a case by case basis per import using query params. See the [Webpack configuration options](../webpack/README.md#configuration) for details.

### Examples

Global setup:

```js
setupLoaders({
  lqip: 'blurhash',
});

// or

setupLoaders({
  lqip: {
    type: 'blurhash',
    targetPixels: 16,
  },
});
```

Per import:

```js
import image from './image.jpg?lqip=blurhash&responsive';
// or
import image from './image.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
```

## License

This project is licensed under the [MIT License](../../LICENSE.md).
