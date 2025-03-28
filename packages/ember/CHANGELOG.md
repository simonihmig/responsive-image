# @responsive-image/ember

## 1.1.1

### Minor Changes

- Update ember-async-data to v2

## 1.1.0

### Minor Changes

- [#891](https://github.com/simonihmig/responsive-image/pull/891) [`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a) Thanks [@simonihmig](https://github.com/simonihmig)! - Add ThumbHash support

  Adds support for [ThumbHash](https://evanw.github.io/thumbhash/) as a LQIP option.

### Patch Changes

- [#1044](https://github.com/simonihmig/responsive-image/pull/1044) [`3f9b621`](https://github.com/simonihmig/responsive-image/commit/3f9b621ba54bf8125d225f2ce9f762c4d5be05e0) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix published files for ember package

  `addon-main.cjs` was not getting published correctly.

- Updated dependencies [[`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a)]:
  - @responsive-image/core@1.1.0
  - @responsive-image/cdn@1.1.1

## 1.0.1

### Patch Changes

- [#874](https://github.com/simonihmig/responsive-image/pull/874) [`5359bbe`](https://github.com/simonihmig/responsive-image/commit/5359bbe68daf6f16521f7297848675f77f97319f) Thanks [@simonihmig](https://github.com/simonihmig)! - Better workaround for lazy loading issue in Firefox

- [#883](https://github.com/simonihmig/responsive-image/pull/883) [`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1) Thanks [@simonihmig](https://github.com/simonihmig)! - Cleanup and update package.json meta data

- [#866](https://github.com/simonihmig/responsive-image/pull/866) [`2203965`](https://github.com/simonihmig/responsive-image/commit/220396501332b4235e665072f4d23b4a2102628e) Thanks [@simonihmig](https://github.com/simonihmig)! - Migrate component to gts format

- Updated dependencies [[`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1), [`fec0c61`](https://github.com/simonihmig/responsive-image/commit/fec0c61449a2b8568884612731dfb4c68acfbe20)]:
  - @responsive-image/core@1.0.1
  - @responsive-image/cdn@1.1.0

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
