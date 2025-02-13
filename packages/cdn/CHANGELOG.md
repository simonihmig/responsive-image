# @responsive-image/cdn

## 1.1.1

### Patch Changes

- Updated dependencies [[`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a)]:
  - @responsive-image/core@1.1.0

## 1.1.0

### Minor Changes

- [#881](https://github.com/simonihmig/responsive-image/pull/881) [`fec0c61`](https://github.com/simonihmig/responsive-image/commit/fec0c61449a2b8568884612731dfb4c68acfbe20) Thanks [@simonihmig](https://github.com/simonihmig)! - Add aspectRatio option

  Provider functions for image CDNs support an `aspectRatio` parameter to set the aspect ratio of the remote image, allowing the image component to render proper `width` and `height` attributes to prevent layout shift.

### Patch Changes

- [#883](https://github.com/simonihmig/responsive-image/pull/883) [`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1) Thanks [@simonihmig](https://github.com/simonihmig)! - Cleanup and update package.json meta data

- Updated dependencies [[`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1)]:
  - @responsive-image/core@1.0.1

## 1.0.0

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

- [#782](https://github.com/simonihmig/responsive-image/pull/782) [`1f3b3d9`](https://github.com/simonihmig/responsive-image/commit/1f3b3d9f952047b5bd3e8a9b67598b50a8ea1a64) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop jpg, png as default image cdn formats

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

- [#737](https://github.com/simonihmig/responsive-image/pull/737) [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor the way to set config

  The `ember` package does not read from `config/addons.js` anymore. Instead an explicit runtime call to `setConfig()` is needed, same as for the `wc` package. The `cdn` package reads its config from the `cdn` namespace.

### Minor Changes

- [#585](https://github.com/simonihmig/responsive-image/pull/585) [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf) Thanks [@simonihmig](https://github.com/simonihmig)! - Move CDN providers to a single dedicated cdn package.

  Ember helpers are now exposed from the main `@responsive-image/ember` package again, wrapping the function from the new `@responsive-image/cdn` package.
  The previous dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.

- [#773](https://github.com/simonihmig/responsive-image/pull/773) [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Netlify image CDN

### Patch Changes

- [#771](https://github.com/simonihmig/responsive-image/pull/771) [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove FastBoot related workarounds in `imgix` image CDN provider

  Instead of working around a [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816) in the actual runtime code, users need to add a FastBoot config to expose needed globals like `URL` or `URLSearchParams`, as documented in the [Ember guide](https://responsive-image.dev/frameworks/ember#fastboot).

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677), [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc), [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0

## 1.0.0-beta.4

### Major Changes

- [#782](https://github.com/simonihmig/responsive-image/pull/782) [`1f3b3d9`](https://github.com/simonihmig/responsive-image/commit/1f3b3d9f952047b5bd3e8a9b67598b50a8ea1a64) Thanks [@simonihmig](https://github.com/simonihmig)! - Drop jpg, png as default image cdn formats

- [#783](https://github.com/simonihmig/responsive-image/pull/783) [`fe2fe11`](https://github.com/simonihmig/responsive-image/commit/fe2fe11727685a6726034b00dc0cd108d1d54e3f) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename image CDN functions, dropping -provider suffix

### Minor Changes

- [#773](https://github.com/simonihmig/responsive-image/pull/773) [`b09549c`](https://github.com/simonihmig/responsive-image/commit/b09549cac9796bac0033ad5ff8e5f05e616989f3) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Netlify image CDN

### Patch Changes

- [#771](https://github.com/simonihmig/responsive-image/pull/771) [`b5dacfe`](https://github.com/simonihmig/responsive-image/commit/b5dacfebb10224f60bc763105c0a212c313f67b9) Thanks [@simonihmig](https://github.com/simonihmig)! - Remove FastBoot related workarounds in `imgix` image CDN provider

  Instead of working around a [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816) in the actual runtime code, users need to add a FastBoot config to expose needed globals like `URL` or `URLSearchParams`, as documented in the [Ember guide](https://responsive-image.dev/frameworks/ember#fastboot).

- Updated dependencies [[`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c)]:
  - @responsive-image/core@1.0.0-beta.3

## 1.0.0-beta.3

### Major Changes

- [#737](https://github.com/simonihmig/responsive-image/pull/737) [`55c502c`](https://github.com/simonihmig/responsive-image/commit/55c502c7da6e0fe86e0ffb2c5ec2f3d39e82679d) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor the way to set config

  The `ember` package does not read from `config/addons.js` anymore. Instead an explicit runtime call to `setConfig()` is needed, same as for the `wc` package. The `cdn` package reads its config from the `cdn` namespace.

### Patch Changes

- Updated dependencies [[`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc)]:
  - @responsive-image/core@1.0.0-beta.2

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

## 1.0.0-beta.1

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

### Minor Changes

- [#585](https://github.com/simonihmig/responsive-image/pull/585) [`ab0e08b`](https://github.com/simonihmig/responsive-image/commit/ab0e08ba9731a5c58fe37d160cd01ad6138096cf) Thanks [@simonihmig](https://github.com/simonihmig)! - Move CDN providers to a single dedicated cdn package.

  Ember helpers are now exposed from the main `@responsive-image/ember` package again, wrapping the function from the new `@responsive-image/cdn` package.
  The previous dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.

### Patch Changes

- Updated dependencies [[`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677)]:
  - @responsive-image/core@1.0.0-beta.1
