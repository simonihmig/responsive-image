# @responsive-image/vite-plugin

## 2.0.0

### Major Changes

- [#1239](https://github.com/simonihmig/responsive-image/pull/1239) [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor internal LQIP implementation

  The way the build plugins would expose the image meta data for any LQIP (Low Quality Image Placeholder) features has changed, especially related to Thumbhash/Blurhash. Previously, the image component would lazily load the runtime decoding function for Thumbhash/Blurhash (dynamic import), as to not load that code when the feature is not used at all. However, this introduced some (minor) delay due to the additional chunk loading, but also made the internal implementation of the image components more complex than it needed to be due to having to handle asynchrony. Now the conditional loading is off-loaded to the build plugins, which can make the decision to pull in the decoding code only when needed at build-time, significantly simplifying the runtime image components by removing any async loading and state syncing.

  This changed the internal contract (interface) for the LQIP feature between the build plugins (Vite or webpack) and the image components. This is a breaking chance, but the only impact for users is to make sure you only use v2.x of any of the project's dependencies (`@responsive-image/*`). No changes in code required.

- [#1351](https://github.com/simonihmig/responsive-image/pull/1351) [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored styles for LQIP options

  This changed the interface between build plugins and image components with regard to how CSS styling information for LQIP options is passed through. While technically a breaking change, this shouldn't affect you as long as you are on V2.x versions of any build blugins _and_ image component packages.

  It also introduces a new `styles: 'inline'` option for build plugins to ship LQIP tyles in the JavaScript bundle, which is needed for the web component, as external styles (external CSS file) was actually not working before due to Shadow DOM isolation.

### Patch Changes

- Updated dependencies [[`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea), [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17), [`ba7a9da`](https://github.com/simonihmig/responsive-image/commit/ba7a9da44d73cfaecb2e57ea7862af519f90b494), [`ae74565`](https://github.com/simonihmig/responsive-image/commit/ae74565a5415a4d98187b6bc7b67b9db3d7c3aa0), [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179)]:
  - @responsive-image/core@2.0.0
  - @responsive-image/build-utils@2.0.0

## 1.1.0

### Minor Changes

- [#891](https://github.com/simonihmig/responsive-image/pull/891) [`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a) Thanks [@simonihmig](https://github.com/simonihmig)! - Add ThumbHash support

  Adds support for [ThumbHash](https://evanw.github.io/thumbhash/) as a LQIP option.

### Patch Changes

- Updated dependencies [[`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a)]:
  - @responsive-image/build-utils@1.1.0
  - @responsive-image/core@1.1.0

## 1.0.2

### Patch Changes

- [#929](https://github.com/simonihmig/responsive-image/pull/929) [`3344a65`](https://github.com/simonihmig/responsive-image/commit/3344a65efb2895f465dd57f885f3b81d630bf0d5) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix resolving in CSS-generating plugins

## 1.0.1

### Patch Changes

- [#883](https://github.com/simonihmig/responsive-image/pull/883) [`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1) Thanks [@simonihmig](https://github.com/simonihmig)! - Cleanup and update package.json meta data

- Updated dependencies [[`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1)]:
  - @responsive-image/build-utils@1.0.1
  - @responsive-image/core@1.0.1

## 1.0.0

### Minor Changes

- [#640](https://github.com/simonihmig/responsive-image/pull/640) [`49b242d`](https://github.com/simonihmig/responsive-image/commit/49b242d5aba9d3b665512a81dc4cce84ce7c2832) Thanks [@simonihmig](https://github.com/simonihmig)! - Support serve mode in vite-plugin

- [#663](https://github.com/simonihmig/responsive-image/pull/663) [`3ab97bd`](https://github.com/simonihmig/responsive-image/commit/3ab97bdd03fbf566dbbbd5a07973cba7ed665956) Thanks [@simonihmig](https://github.com/simonihmig)! - Do not apply default value for quality

  Instead we rely on `sharp`'s own defaults. For .avif images this will use a lower quality setting (50 instead of 80), which produces smaller sizes with almost the same visual quality as e.g. 80 for jpegs.

- [#669](https://github.com/simonihmig/responsive-image/pull/669) [`e2d6111`](https://github.com/simonihmig/responsive-image/commit/e2d61116cb1bb565bc6dbd20e8d9372a5acfd4f4) Thanks [@simonihmig](https://github.com/simonihmig)! - Add caching support

  Generated images will be cached, based on the source and image processing config. This is especially useul for the vite-plugin in dev mode (serve), since images are processed on-demand within the Vite dev server middleware.

- [#664](https://github.com/simonihmig/responsive-image/pull/664) [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all `eri-*` attributes and classes to `ri-*` for consistency

- [#619](https://github.com/simonihmig/responsive-image/pull/619) [`cb2e67f`](https://github.com/simonihmig/responsive-image/commit/cb2e67fbd75dd5691f3f903813bf474d54000b73) Thanks [@simonihmig](https://github.com/simonihmig)! - Introduce new `@responsive/vite-plugin` with basic Vite loader

- [#642](https://github.com/simonihmig/responsive-image/pull/642) [`7ca5b5c`](https://github.com/simonihmig/responsive-image/commit/7ca5b5c9a9d98c201098ae349c0057dd63753ede) Thanks [@simonihmig](https://github.com/simonihmig)! - Add LQIP support to vite-plugin

### Patch Changes

- [#681](https://github.com/simonihmig/responsive-image/pull/681) [`4b08662`](https://github.com/simonihmig/responsive-image/commit/4b086620f9d1347fc26d21c6ca076775046bd547) Thanks [@simonihmig](https://github.com/simonihmig)! - Support `aspect` ratio parameter correctly

  When `aspect` is given (via import query params), the height of the image is adjusted to match when resizing, and the image component will correctly render with the new aspect ratio, rather than that of the original image.

- [#660](https://github.com/simonihmig/responsive-image/pull/660) [`1c903cd`](https://github.com/simonihmig/responsive-image/commit/1c903cd6bc30a66b483052539371034fd11f519b) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor build plugins, extract shared functionality into `@response-image/build-utils`

- [#633](https://github.com/simonihmig/responsive-image/pull/633) [`353cfab`](https://github.com/simonihmig/responsive-image/commit/353cfab5b10933f213fc4d895231b6d44fcb2d7c) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix LQIP color bug causing invalid hex values

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677), [`3ab97bd`](https://github.com/simonihmig/responsive-image/commit/3ab97bdd03fbf566dbbbd5a07973cba7ed665956), [`1c903cd`](https://github.com/simonihmig/responsive-image/commit/1c903cd6bc30a66b483052539371034fd11f519b), [`e2d6111`](https://github.com/simonihmig/responsive-image/commit/e2d61116cb1bb565bc6dbd20e8d9372a5acfd4f4), [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc), [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492), [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0
  - @responsive-image/build-utils@1.0.0

## 1.0.0-beta.4

### Patch Changes

- Updated dependencies [[`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0-beta.3
  - @responsive-image/build-utils@1.0.0-beta.3

## 1.0.0-beta.3

### Patch Changes

- [#681](https://github.com/simonihmig/responsive-image/pull/681) [`4b08662`](https://github.com/simonihmig/responsive-image/commit/4b086620f9d1347fc26d21c6ca076775046bd547) Thanks [@simonihmig](https://github.com/simonihmig)! - Support `aspect` ratio parameter correctly

  When `aspect` is given (via import query params), the height of the image is adjusted to match when resizing, and the image component will correctly render with the new aspect ratio, rather than that of the original image.

- Updated dependencies [[`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc)]:
  - @responsive-image/core@1.0.0-beta.2
  - @responsive-image/build-utils@1.0.0-beta.2

## 1.0.0-beta.2

### Minor Changes

- [#663](https://github.com/simonihmig/responsive-image/pull/663) [`3ab97bd`](https://github.com/simonihmig/responsive-image/commit/3ab97bdd03fbf566dbbbd5a07973cba7ed665956) Thanks [@simonihmig](https://github.com/simonihmig)! - Do not apply default value for quality

  Instead we rely on `sharp`'s own defaults. For .avif images this will use a lower quality setting (50 instead of 80), which produces smaller sizes with almost the same visual quality as e.g. 80 for jpegs.

- [#669](https://github.com/simonihmig/responsive-image/pull/669) [`e2d6111`](https://github.com/simonihmig/responsive-image/commit/e2d61116cb1bb565bc6dbd20e8d9372a5acfd4f4) Thanks [@simonihmig](https://github.com/simonihmig)! - Add caching support

  Generated images will be cached, based on the source and image processing config. This is especially useul for the vite-plugin in dev mode (serve), since images are processed on-demand within the Vite dev server middleware.

- [#664](https://github.com/simonihmig/responsive-image/pull/664) [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all `eri-*` attributes and classes to `ri-*` for consistency

### Patch Changes

- [#660](https://github.com/simonihmig/responsive-image/pull/660) [`1c903cd`](https://github.com/simonihmig/responsive-image/commit/1c903cd6bc30a66b483052539371034fd11f519b) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor build plugins, extract shared functionality into `@response-image/build-utils`

- [#633](https://github.com/simonihmig/responsive-image/pull/633) [`353cfab`](https://github.com/simonihmig/responsive-image/commit/353cfab5b10933f213fc4d895231b6d44fcb2d7c) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix LQIP color bug causing invalid hex values

- Updated dependencies [[`3ab97bd`](https://github.com/simonihmig/responsive-image/commit/3ab97bdd03fbf566dbbbd5a07973cba7ed665956), [`1c903cd`](https://github.com/simonihmig/responsive-image/commit/1c903cd6bc30a66b483052539371034fd11f519b), [`e2d6111`](https://github.com/simonihmig/responsive-image/commit/e2d61116cb1bb565bc6dbd20e8d9372a5acfd4f4), [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492)]:
  - @responsive-image/build-utils@1.0.0-beta.1

## 1.0.0-beta.1

### Minor Changes

- [#640](https://github.com/simonihmig/responsive-image/pull/640) [`49b242d`](https://github.com/simonihmig/responsive-image/commit/49b242d5aba9d3b665512a81dc4cce84ce7c2832) Thanks [@simonihmig](https://github.com/simonihmig)! - Support serve mode in vite-plugin

- [#619](https://github.com/simonihmig/responsive-image/pull/619) [`cb2e67f`](https://github.com/simonihmig/responsive-image/commit/cb2e67fbd75dd5691f3f903813bf474d54000b73) Thanks [@simonihmig](https://github.com/simonihmig)! - Introduce new `@responsive/vite-plugin` with basic Vite loader

- [#642](https://github.com/simonihmig/responsive-image/pull/642) [`7ca5b5c`](https://github.com/simonihmig/responsive-image/commit/7ca5b5c9a9d98c201098ae349c0057dd63753ede) Thanks [@simonihmig](https://github.com/simonihmig)! - Add LQIP support to vite-plugin
