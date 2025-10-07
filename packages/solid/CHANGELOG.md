# @responsive-image/solid

## 2.0.3

### Patch Changes

- [#1712](https://github.com/simonihmig/responsive-image/pull/1712) [`c97ca84`](https://github.com/simonihmig/responsive-image/commit/c97ca8456167169cd0565f99cd72025b7902dc26) Thanks [@simonihmig](https://github.com/simonihmig)! - Force recreating the `<img>` element to show LQIP styles

  When changing the `src` argument dynamically and LQIP styles are being used, the `<img>` element will be recreated instead of reusing the existing DOM node. Otherwise LQIP styles for the new image would not be visisble, as the browser would continue showing the old (already loaded) image while the new one is loading, hiding the LQIP preview (implemented as `background-image` based styles). The `<img>` element is essentially a stateful element, which in this case is not playing in our favor.

  For dynamically changing `src` with image data that does not have LQIP styles, the problem does not apply and therefore nothing changes: re-rendering will continue to reuse the existing DOM element, as this is more efficient.

## 2.0.2

### Patch Changes

- [#1662](https://github.com/simonihmig/responsive-image/pull/1662) [`ca440a9`](https://github.com/simonihmig/responsive-image/commit/ca440a9069f373cafca2aa79428c34d02aab2dc4) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix LQIP reactivity when src changes

  When changing the `src` argument dynamically, the loading state was not correctly reset. This is fixing it, so that the new image's LQIP styles get applied while it is loading.

## 2.0.1

### Patch Changes

- [#1563](https://github.com/simonihmig/responsive-image/pull/1563) [`06d9e9b`](https://github.com/simonihmig/responsive-image/commit/06d9e9bea0afd7b7d9e06827664f7a2946de04a2) Thanks [@wkillerud](https://github.com/wkillerud)! - Merges given class name instead of replacing internal classes

  Now you can give the React, Svelte and Solid components a custom class name without breaking the built-in styles or having to add `ri-img`, `ri-responsive` or `ri-fixed` yourself.

- Updated dependencies [[`d22c0fa`](https://github.com/simonihmig/responsive-image/commit/d22c0fac3f7c1bf03057745d802a9b58aa7075d9)]:
  - @responsive-image/core@2.1.0

## 2.0.0

### Major Changes

- [#1239](https://github.com/simonihmig/responsive-image/pull/1239) [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor internal LQIP implementation

  The way the build plugins would expose the image meta data for any LQIP (Low Quality Image Placeholder) features has changed, especially related to Thumbhash/Blurhash. Previously, the image component would lazily load the runtime decoding function for Thumbhash/Blurhash (dynamic import), as to not load that code when the feature is not used at all. However, this introduced some (minor) delay due to the additional chunk loading, but also made the internal implementation of the image components more complex than it needed to be due to having to handle asynchrony. Now the conditional loading is off-loaded to the build plugins, which can make the decision to pull in the decoding code only when needed at build-time, significantly simplifying the runtime image components by removing any async loading and state syncing.

  This changed the internal contract (interface) for the LQIP feature between the build plugins (Vite or webpack) and the image components. This is a breaking chance, but the only impact for users is to make sure you only use v2.x of any of the project's dependencies (`@responsive-image/*`). No changes in code required.

- [#1351](https://github.com/simonihmig/responsive-image/pull/1351) [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored styles for LQIP options

  This changed the interface between build plugins and image components with regard to how CSS styling information for LQIP options is passed through. While technically a breaking change, this shouldn't affect you as long as you are on V2.x versions of any build blugins _and_ image component packages.

  It also introduces a new `styles: 'inline'` option for build plugins to ship LQIP tyles in the JavaScript bundle, which is needed for the web component, as external styles (external CSS file) was actually not working before due to Shadow DOM isolation.

### Minor Changes

- [#1346](https://github.com/simonihmig/responsive-image/pull/1346) [`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea) Thanks [@wkillerud](https://github.com/wkillerud)! - Add support for the 'auto' imageType

### Patch Changes

- Updated dependencies [[`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea), [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17), [`ba7a9da`](https://github.com/simonihmig/responsive-image/commit/ba7a9da44d73cfaecb2e57ea7862af519f90b494), [`ae74565`](https://github.com/simonihmig/responsive-image/commit/ae74565a5415a4d98187b6bc7b67b9db3d7c3aa0), [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179)]:
  - @responsive-image/core@2.0.0

## 1.1.1

### Patch Changes

- [#1079](https://github.com/simonihmig/responsive-image/pull/1079) [`aa42f2f`](https://github.com/simonihmig/responsive-image/commit/aa42f2fc06a9ca072927fa91e3d9fc99eecd37e1) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix ThumbHash/BlurHash loading in SolidStart SSR mode

## 1.1.0

### Minor Changes

- [#891](https://github.com/simonihmig/responsive-image/pull/891) [`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a) Thanks [@simonihmig](https://github.com/simonihmig)! - Add ThumbHash support

  Adds support for [ThumbHash](https://evanw.github.io/thumbhash/) as a LQIP option.

### Patch Changes

- Updated dependencies [[`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a)]:
  - @responsive-image/core@1.1.0

## 1.0.1

### Patch Changes

- [#903](https://github.com/simonihmig/responsive-image/pull/903) [`ee6ad76`](https://github.com/simonihmig/responsive-image/commit/ee6ad767ad6538eb1e47e8a8939acbd90f341f37) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix missing prepack script

## 1.0.0

### Major Changes

- [#861](https://github.com/simonihmig/responsive-image/pull/861) [`be0d0b8`](https://github.com/simonihmig/responsive-image/commit/be0d0b801d21a92159eabf6faee92b844cc9ed24) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Solid

  Adds a new `@responsive-image/solid` package providing the image component with a native [Solid](https://www.solidjs.com/) implementation.

### Patch Changes

- Updated dependencies [[`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1)]:
  - @responsive-image/core@1.0.1
