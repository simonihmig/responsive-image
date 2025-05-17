# @responsive-image/solid

## 2.0.0

### Major Changes

- [#1239](https://github.com/simonihmig/responsive-image/pull/1239) [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor internal LQIP implementation

  The way the build plugins would expose the image meta data for any LQIP (Low Quality Image Placeholder) features has changed, especially related to Thumbhash/Blurhash. Previously, the image component would lazily load the runtime decoding function for Thumbhash/Blurhash (dynamic import), as to not load that code when the feature is not used at all. However, this introduced some (minor) delay due to the additional chunk loading, but also made the internal implementation of the image components more complex than it needed to be due to having to handle asynchrony. Now the conditional loading is off-loaded to the build plugins, which can make the decision to pull in the decoding code only when needed at build-time, significantly simplifying the runtime image components by removing any async loading and state syncing.

  This changed the internal contract (interface) for the LQIP feature between the build plugins (Vite or webpack) and the image components. This is a breaking chance, but the only impact for users is to make sure you only use v2.x of any of the project's dependencies (`@responsive-image/*`). No changes in code required.

### Patch Changes

- Updated dependencies [[`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17)]:
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
