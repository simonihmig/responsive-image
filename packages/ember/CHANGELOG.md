# ember-responsive-image

## 1.0.0

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

- [#598](https://github.com/simonihmig/responsive-image/pull/598) [`025ccef`](https://github.com/simonihmig/responsive-image/commit/025ccef1c8a0580a1426126fade5cb7b25aa1859) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored BlurHash implementation to be ESM based

- [#771](https://github.com/simonihmig/responsive-image/pull/771) [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove FastBoot related workarounds in `imgix` image CDN provider

  Instead of working around a [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816) in the actual runtime code, users need to add a FastBoot config to expose needed globals like `URL` or `URLSearchParams`, as documented in the [Ember guide](https://responsive-image.dev/frameworks/ember#fastboot).

- [#614](https://github.com/simonihmig/responsive-image/pull/614) [`2d10626`](https://github.com/simonihmig/responsive-image/commit/2d10626daca68fa97c6566bb5203e9861f1dadff) Thanks [@simonihmig](https://github.com/simonihmig)! - Use Record-based API for cloudinary transformations

  Instead of passing cloudinary transformations as a string according to the Cloudinary Transformation URL API, you need to pass them as an object. If you want to use chained transformations, pass an array of objects.

  ```js
  // using @resposive-image/cdn
  const simpleTransformation = cloudinaryProvider('foo/bar.jpg', {
    transformations: { co: 'rgb:20a020', e: 'colorize:50' },
  });

  const chainedTransformation = cloudinaryProvider('foo/bar.jpg', {
    transformations: [
      { co: 'rgb:20a020', e: 'colorize:50' },
      { ar: '1.0', c: 'fill', w: '150' },
      { r: 'max' },
    ],
  });
  ```

  ```hbs
  {{!-- using @responsive-image/ember }}
  <ResponsiveImage
    @src={{responsiveImageCloudinaryProvider
      "foo/bar.jpg"
      transformations=(hash co="rgb:20a020" e="colorize:50")
    }}
  >
  ```

- [#783](https://github.com/simonihmig/responsive-image/pull/783) [`fe2fe11`](https://github.com/simonihmig/responsive-image/commit/fe2fe11727685a6726034b00dc0cd108d1d54e3f) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename image CDN functions, dropping -provider suffix

- [#752](https://github.com/simonihmig/responsive-image/pull/752) [`9f6c96e`](https://github.com/simonihmig/responsive-image/commit/9f6c96eb4b63b6ce97fdb218befa3e9e064c564a) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop support for Ember < 4.12

- [#579](https://github.com/simonihmig/responsive-image/pull/579) [`5a69e21`](https://github.com/simonihmig/responsive-image/commit/5a69e21cca4716332ec41aa7cf9ae143eddd9d1c) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop service class

  The `responsive-image` service has been dropped and replaced with a simple static module from the new `core` package.

- [#737](https://github.com/simonihmig/responsive-image/pull/737) [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor the way to set config

  The `ember` package does not read from `config/addons.js` anymore. Instead an explicit runtime call to `setConfig()` is needed, same as for the `wc` package. The `cdn` package reads its config from the `cdn` namespace.

### Minor Changes

- [#585](https://github.com/simonihmig/responsive-image/pull/585) [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf) Thanks [@simonihmig](https://github.com/simonihmig)! - Move CDN providers to a single dedicated cdn package.

  Ember helpers are now exposed from the main `@responsive-image/ember` package again, wrapping the function from the new `@responsive-image/cdn` package.
  The previous dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.

- [#664](https://github.com/simonihmig/responsive-image/pull/664) [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all `eri-*` attributes and classes to `ri-*` for consistency

- [#773](https://github.com/simonihmig/responsive-image/pull/773) [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Netlify image CDN

### Patch Changes

- [#744](https://github.com/simonihmig/responsive-image/pull/744) [`b370ed6`](https://github.com/simonihmig/responsive-image/commit/b370ed63f81d4d37a63f0b1f8117992d49aada6f) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor BlurHash usage in Ember

  Use dynamic import of local blurhash module instead of public asset, to let the bundler produce more robust output (e.g. custom publicPath)

- [#646](https://github.com/simonihmig/responsive-image/pull/646) [`9661f86`](https://github.com/simonihmig/responsive-image/commit/9661f86f9a1f2f51adb33427ac9098c656ba3d02) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove use of @ember/render-modifiers

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc) Thanks [@simonihmig](https://github.com/simonihmig)! - Extract BlurHash utils onto core

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677), [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf), [`1f3b3d9`](https://github.com/simonihmig/responsive-image/commit/1f3b3d9f952047b5bd3e8a9b67598b50a8ea1a64), [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9), [`2d10626`](https://github.com/simonihmig/responsive-image/commit/2d10626daca68fa97c6566bb5203e9861f1dadff), [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc), [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3), [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c), [`fe2fe11`](https://github.com/simonihmig/responsive-image/commit/fe2fe11727685a6726034b00dc0cd108d1d54e3f), [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d)]:
  - @responsive-image/core@1.0.0
  - @responsive-image/cdn@1.0.0

## 1.0.0-beta.5

### Major Changes

- [#771](https://github.com/simonihmig/responsive-image/pull/771) [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove FastBoot related workarounds in `imgix` image CDN provider

  Instead of working around a [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816) in the actual runtime code, users need to add a FastBoot config to expose needed globals like `URL` or `URLSearchParams`, as documented in the [Ember guide](https://responsive-image.dev/frameworks/ember#fastboot).

- [#783](https://github.com/simonihmig/responsive-image/pull/783) [`fe2fe11`](https://github.com/simonihmig/responsive-image/commit/fe2fe11727685a6726034b00dc0cd108d1d54e3f) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename image CDN functions, dropping -provider suffix

### Minor Changes

- [#773](https://github.com/simonihmig/responsive-image/pull/773) [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Netlify image CDN

### Patch Changes

- Updated dependencies [[`1f3b3d9`](https://github.com/simonihmig/responsive-image/commit/1f3b3d9f952047b5bd3e8a9b67598b50a8ea1a64), [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9), [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3), [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c), [`fe2fe11`](https://github.com/simonihmig/responsive-image/commit/fe2fe11727685a6726034b00dc0cd108d1d54e3f)]:
  - @responsive-image/cdn@1.0.0-beta.4
  - @responsive-image/core@1.0.0-beta.3

## 1.0.0-beta.4

### Major Changes

- [#752](https://github.com/simonihmig/responsive-image/pull/752) [`9f6c96e`](https://github.com/simonihmig/responsive-image/commit/9f6c96eb4b63b6ce97fdb218befa3e9e064c564a) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop support for Ember < 4.12

- [#737](https://github.com/simonihmig/responsive-image/pull/737) [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor the way to set config

  The `ember` package does not read from `config/addons.js` anymore. Instead an explicit runtime call to `setConfig()` is needed, same as for the `wc` package. The `cdn` package reads its config from the `cdn` namespace.

### Patch Changes

- [#744](https://github.com/simonihmig/responsive-image/pull/744) [`b370ed6`](https://github.com/simonihmig/responsive-image/commit/b370ed63f81d4d37a63f0b1f8117992d49aada6f) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor BlurHash usage in Ember

  Use dynamic import of local blurhash module instead of public asset, to let the bundler produce more robust output (e.g. custom publicPath)

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc) Thanks [@simonihmig](https://github.com/simonihmig)! - Extract BlurHash utils onto core

- Updated dependencies [[`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc), [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d)]:
  - @responsive-image/core@1.0.0-beta.2
  - @responsive-image/cdn@1.0.0-beta.3

## 1.0.0-beta.3

### Minor Changes

- [#664](https://github.com/simonihmig/responsive-image/pull/664) [`bab7cae`](https://github.com/simonihmig/responsive-image/commit/bab7cae77fa4d5d2bd6f46ccec91f4ba327be492) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all `eri-*` attributes and classes to `ri-*` for consistency

## 1.0.0-beta.2

### Major Changes

- [#614](https://github.com/simonihmig/responsive-image/pull/614) [`2d10626`](https://github.com/simonihmig/responsive-image/commit/2d10626daca68fa97c6566bb5203e9861f1dadff) Thanks [@simonihmig](https://github.com/simonihmig)! - Use Record-based API for cloudinary transformations

  Instead of passing cloudinary transformations as a string according to the Cloudinary Transformation URL API, you need to pass them as an object. If you want to use chained transformations, pass an array of objects.

  ```js
  // using @resposive-image/cdn
  const simpleTransformation = cloudinaryProvider('foo/bar.jpg', {
    transformations: { co: 'rgb:20a020', e: 'colorize:50' },
  });

  const chainedTransformation = cloudinaryProvider('foo/bar.jpg', {
    transformations: [
      { co: 'rgb:20a020', e: 'colorize:50' },
      { ar: '1.0', c: 'fill', w: '150' },
      { r: 'max' },
    ],
  });
  ```

  ```hbs
  {{!-- using @responsive-image/ember }}
  <ResponsiveImage
    @src={{responsiveImageCloudinaryProvider
      "foo/bar.jpg"
      transformations=(hash co="rgb:20a020" e="colorize:50")
    }}
  >
  ```

### Patch Changes

- [#646](https://github.com/simonihmig/responsive-image/pull/646) [`9661f86`](https://github.com/simonihmig/responsive-image/commit/9661f86f9a1f2f51adb33427ac9098c656ba3d02) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove use of @ember/render-modifiers

- Updated dependencies [[`2d10626`](https://github.com/simonihmig/responsive-image/commit/2d10626daca68fa97c6566bb5203e9861f1dadff)]:
  - @responsive-image/cdn@1.0.0-beta.2

## 1.0.0-beta.1

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

- [#598](https://github.com/simonihmig/responsive-image/pull/598) [`025ccef`](https://github.com/simonihmig/responsive-image/commit/025ccef1c8a0580a1426126fade5cb7b25aa1859) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored BlurHash implementation to be ESM based

- [#579](https://github.com/simonihmig/responsive-image/pull/579) [`5a69e21`](https://github.com/simonihmig/responsive-image/commit/5a69e21cca4716332ec41aa7cf9ae143eddd9d1c) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop service class

  The `responsive-image` service has been dropped and replaced with a simple static module from the new `core` package.

### Minor Changes

- [#585](https://github.com/simonihmig/responsive-image/pull/585) [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf) Thanks [@simonihmig](https://github.com/simonihmig)! - Move CDN providers to a single dedicated cdn package.

  Ember helpers are now exposed from the main `@responsive-image/ember` package again, wrapping the function from the new `@responsive-image/cdn` package.
  The previous dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.

### Patch Changes

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677), [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf)]:
  - @responsive-image/core@1.0.0-beta.1
  - @responsive-image/cdn@1.0.0-beta.1

## 5.0.0-beta.1

### Patch Changes

- [#573](https://github.com/simonihmig/ember-responsive-image/pull/573) [`fed835d`](https://github.com/simonihmig/ember-responsive-image/commit/fed835de43ac86b28d9a5cc80d751adff76df219) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix broken build when no addon config is found

- Updated dependencies [[`f8d3ebb`](https://github.com/simonihmig/ember-responsive-image/commit/f8d3ebb5147878a6c4bbea655756e60600667ce3)]:
  - @ember-responsive-image/blurhash@1.0.0-beta.1

## 5.0.0-beta.0

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
