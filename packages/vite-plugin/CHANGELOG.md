# @responsive-image/vite-plugin

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
