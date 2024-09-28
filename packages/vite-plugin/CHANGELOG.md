# @responsive-image/vite-plugin

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
