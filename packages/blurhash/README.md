# @responsive-image/blurhash

Add support for [BlurHash](https://blurha.sh/) encoded [Low Quality Image Placeholders](../../README.md#lqip) (LQIP) to ember-responsive-images.

## Compatibility

- Webpack v5
- requires using `@responsive-image/webpack`

## Installation

```
npm install @responsive-image/blurhash @responsive-image/webpack
// or
yarn add @responsive-image/blurhash @responsive-image/webpack
// or
pnpm add @responsive-image/blurhash @responsive-image/webpack
```

The setup of this package requires to add an additional script to your `index.html`. It is important to add this _before_ your `vendor.js` script, especially when your app is served in a SSR setup using FastBoot or prember, so that the BlurHash encoded LQIPs are displayed before your app's JavaScript has loaded:

```html
<script src="{{rootURL}}assets/blurhash.js"></script>
<script src="{{rootURL}}assets/vendor.js"></script>
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
