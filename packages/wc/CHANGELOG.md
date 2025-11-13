# @responsive-image/wc

## 2.0.4

### Patch Changes

- [#1890](https://github.com/simonihmig/responsive-image/pull/1890) [`276ce93`](https://github.com/simonihmig/responsive-image/commit/276ce9317786e8ab2ad69ae3be9ff729ca60e926) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix dependency on `tslib`

  `tslib` must be a dependency, not devDependency, as the compiled code imports it.

## 2.0.3

### Patch Changes

- [#1855](https://github.com/simonihmig/responsive-image/pull/1855) [`9e85dec`](https://github.com/simonihmig/responsive-image/commit/9e85dec070bcee9fa9dc8c3e52de402599a2ebdb) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix loading state when image is loaded already

  When the image was already loaded when the component would render initially, the load event would get missed and so some optional LQIP styles (background image) would not get removed properly. This situation can easily happen in a SSR setup.

  In most cases (opaque images) a user wouldn't see this, but with partially transparent images the LQIP would shine through.

## 2.0.2

### Patch Changes

- [#1712](https://github.com/simonihmig/responsive-image/pull/1712) [`c97ca84`](https://github.com/simonihmig/responsive-image/commit/c97ca8456167169cd0565f99cd72025b7902dc26) Thanks [@simonihmig](https://github.com/simonihmig)! - Force recreating the `<img>` element to show LQIP styles

  When changing the `src` argument dynamically and LQIP styles are being used, the `<img>` element will be recreated instead of reusing the existing DOM node. Otherwise LQIP styles for the new image would not be visisble, as the browser would continue showing the old (already loaded) image while the new one is loading, hiding the LQIP preview (implemented as `background-image` based styles). The `<img>` element is essentially a stateful element, which in this case is not playing in our favor.

  For dynamically changing `src` with image data that does not have LQIP styles, the problem does not apply and therefore nothing changes: re-rendering will continue to reuse the existing DOM element, as this is more efficient.

## 2.0.1

### Patch Changes

- [#1662](https://github.com/simonihmig/responsive-image/pull/1662) [`ca440a9`](https://github.com/simonihmig/responsive-image/commit/ca440a9069f373cafca2aa79428c34d02aab2dc4) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix LQIP reactivity when src changes

  When changing the `src` argument dynamically, the loading state was not correctly reset. This is fixing it, so that the new image's LQIP styles get applied while it is loading.

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

## 1.1.0

### Minor Changes

- [#891](https://github.com/simonihmig/responsive-image/pull/891) [`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a) Thanks [@simonihmig](https://github.com/simonihmig)! - Add ThumbHash support

  Adds support for [ThumbHash](https://evanw.github.io/thumbhash/) as a LQIP option.

### Patch Changes

- Updated dependencies [[`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a)]:
  - @responsive-image/core@1.1.0

## 1.0.2

### Patch Changes

- [#913](https://github.com/simonihmig/responsive-image/pull/913) [`2fb39c5`](https://github.com/simonihmig/responsive-image/commit/2fb39c5280b2de903cf0fe79f116399afe3f8ed0) Thanks [@simonihmig](https://github.com/simonihmig)! - Load blurhash script lazily in web component

## 1.0.1

### Patch Changes

- [#883](https://github.com/simonihmig/responsive-image/pull/883) [`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1) Thanks [@simonihmig](https://github.com/simonihmig)! - Cleanup and update package.json meta data

- Updated dependencies [[`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1)]:
  - @responsive-image/core@1.0.1

## 1.0.0

### Major Changes

- [#715](https://github.com/simonihmig/responsive-image/pull/715) [`fee0cb5`](https://github.com/simonihmig/responsive-image/commit/fee0cb5a6deb05556f556f1a5f25549fa9e05598) Thanks [@simonihmig](https://github.com/simonihmig)! - Introduce new `@responsive-image/wc` package for Lit-based web component support

  This package exposes a browser native [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#specifications). It is implemented using the [Lit](https://lit.dev/) library, but it can be used with any other [framework supporting web components](https://custom-elements-everywhere.com/), or none at all.

### Minor Changes

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`da0f40c`](https://github.com/simonihmig/responsive-image/commit/da0f40cfd1cfeca1b4005d6359a40b01c4f66b7d) Thanks [@simonihmig](https://github.com/simonihmig)! - Add BlurHash support to web component

- [#764](https://github.com/simonihmig/responsive-image/pull/764) [`8588cc6`](https://github.com/simonihmig/responsive-image/commit/8588cc6f8ed200c49353f7bd3652dd70e11aa9e2) Thanks [@simonihmig](https://github.com/simonihmig)! - Redispatch events, expose `complete` property

- [#762](https://github.com/simonihmig/responsive-image/pull/762) [`486695e`](https://github.com/simonihmig/responsive-image/commit/486695e083446f6a9c7deda5c086fbb641cee967) Thanks [@simonihmig](https://github.com/simonihmig)! - Support styling with :part(img)

- [#763](https://github.com/simonihmig/responsive-image/pull/763) [`05815c0`](https://github.com/simonihmig/responsive-image/commit/05815c0095c2d3f00d7dcc2028a7a224dad5e349) Thanks [@simonihmig](https://github.com/simonihmig)! - Support customizing HTML image attributes in `@responsive-image/wc`

### Patch Changes

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677), [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc), [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0

## 1.0.0-beta.2

### Patch Changes

- Updated dependencies [[`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0-beta.3

## 1.0.0-beta.1

### Major Changes

- [#715](https://github.com/simonihmig/responsive-image/pull/715) [`fee0cb5`](https://github.com/simonihmig/responsive-image/commit/fee0cb5a6deb05556f556f1a5f25549fa9e05598) Thanks [@simonihmig](https://github.com/simonihmig)! - Introduce new `@responsive-image/wc` package for Lit-based web component support

  This package exposes a browser native [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#specifications). It is implemented using the [Lit](https://lit.dev/) library, but it can be used with any other [framework supporting web components](https://custom-elements-everywhere.com/), or none at all.

### Minor Changes

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`da0f40c`](https://github.com/simonihmig/responsive-image/commit/da0f40cfd1cfeca1b4005d6359a40b01c4f66b7d) Thanks [@simonihmig](https://github.com/simonihmig)! - Add BlurHash support to web component

- [#764](https://github.com/simonihmig/responsive-image/pull/764) [`8588cc6`](https://github.com/simonihmig/responsive-image/commit/8588cc6f8ed200c49353f7bd3652dd70e11aa9e2) Thanks [@simonihmig](https://github.com/simonihmig)! - Redispatch events, expose `complete` property

- [#762](https://github.com/simonihmig/responsive-image/pull/762) [`486695e`](https://github.com/simonihmig/responsive-image/commit/486695e083446f6a9c7deda5c086fbb641cee967) Thanks [@simonihmig](https://github.com/simonihmig)! - Support styling with :part(img)

- [#763](https://github.com/simonihmig/responsive-image/pull/763) [`05815c0`](https://github.com/simonihmig/responsive-image/commit/05815c0095c2d3f00d7dcc2028a7a224dad5e349) Thanks [@simonihmig](https://github.com/simonihmig)! - Support customizing HTML image attributes in `@responsive-image/wc`

### Patch Changes

- Updated dependencies [[`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc)]:
  - @responsive-image/core@1.0.0-beta.2
