# @ember-responsive-image/webpack

## 1.0.0-beta.5

### Patch Changes

- [#681](https://github.com/simonihmig/responsive-image/pull/681) [`4b08662`](https://github.com/simonihmig/responsive-image/commit/4b086620f9d1347fc26d21c6ca076775046bd547) Thanks [@simonihmig](https://github.com/simonihmig)! - Support `aspect` ratio parameter correctly

  When `aspect` is given (via import query params), the height of the image is adjusted to match when resizing, and the image component will correctly render with the new aspect ratio, rather than that of the original image.

- Updated dependencies [[`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc)]:
  - @responsive-image/core@1.0.0-beta.2
  - @responsive-image/build-utils@1.0.0-beta.2

## 1.0.0-beta.4

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

## 1.0.0-beta.3

### Major Changes

- [#608](https://github.com/simonihmig/responsive-image/pull/608) [`a3f94f2`](https://github.com/simonihmig/responsive-image/commit/a3f94f284b530a9d08f424ffbe5e735a8ddc388a) Thanks [@simonihmig](https://github.com/simonihmig)! - Use imagetools for more image processing options

  `@responsive-image/webpack` is now using the `imagetools-core` package for image processing via `sharp`. This now supports not only scaling to different sizes and generating different image formats as before, but also a lot of other [directives](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md) for image manipulation.

  _Breaking Changes_: Some parameters passed to the loader as defaults directly or using as query parameters in imports had to change to align with that library:

  - `widths` has been renamed to `w`
  - `formats` to `format`
  - the separator for array vlues has been changed to `;` instead of `,`

  Example: `import image from './path/to/image.jpg?w=400;800&responsive';`

## 1.0.0-beta.2

### Patch Changes

- [#604](https://github.com/simonihmig/responsive-image/pull/604) [`63e0336`](https://github.com/simonihmig/responsive-image/commit/63e0336a30b44c58df80b0f873417108cc11b101) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix broken published webpack package

## 1.0.0-beta.1

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

### Minor Changes

- [#598](https://github.com/simonihmig/responsive-image/pull/598) [`025ccef`](https://github.com/simonihmig/responsive-image/commit/025ccef1c8a0580a1426126fade5cb7b25aa1859) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored BlurHash implementation to be ESM based

### Patch Changes

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677)]:
  - @responsive-image/core@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- [#547](https://github.com/simonihmig/ember-responsive-image/pull/547) [`fe2b113`](https://github.com/simonihmig/ember-responsive-image/commit/fe2b11311c3bd5d8d8d0e28f2040f1118acc937b) Thanks [@simonihmig](https://github.com/simonihmig)! - Major rewrite as a v2 addon

  The main addon is now a fully static v2 addon. No more broccoli, all processing of local images has moved to Webpack-native loaders, invoked by ember-auto-import for classic builds or Embroider.

  The main breaking change here is that when using the `<ResponsiveImage/>` component you don't refer to the image by a string-based reference anymore. In the pull-based world of v2 addons, you need to explicitly import the image file. This triggers the Webpack loaders, applying the image processing. This has t he benefit of only processing what is actually used, and being able to apply specific image processing options _per import_.

  For organizational purposes, the different concerns (image processing, image CDN providers etc.) have been split into separate packages that you need to add as dependencies if you make use of them:

  - `@ember-responsive-image/webpack` for local image processing
  - `@ember-responsive-image/cloudinary` for supporting the Cloudinary image CDN
  - `@ember-responsive-image/imgix` for supporting the Imgix image CDN
  - `@ember-responsive-image/blurhash` for BlurHash LQIP support

  The configuration of the addon has been moved from `ember-cli-build.js` to separate configurations for each of the above packages. Please refer to their respective documentation.

### Patch Changes

- Updated dependencies [[`fe2b113`](https://github.com/simonihmig/ember-responsive-image/commit/fe2b11311c3bd5d8d8d0e28f2040f1118acc937b)]:
  - @ember-responsive-image/blurhash@1.0.0-beta.0
