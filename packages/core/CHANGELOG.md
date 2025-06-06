# @responsive-image/core

## 2.0.0

### Major Changes

- [#1346](https://github.com/simonihmig/responsive-image/pull/1346) [`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea) Thanks [@wkillerud](https://github.com/wkillerud)! - ImageData.imageTypes can now be the string 'auto'

  CDNs often have a feature to automatically choose the
  optimal format based on the visiting browser. This type
  change is made to support using such features in the
  `cdn` package.

  Where you assume `imageTypes` is an array of strings,
  update to also support the `imageTypes: 'auto'` case.

- [#1239](https://github.com/simonihmig/responsive-image/pull/1239) [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactor internal LQIP implementation

  The way the build plugins would expose the image meta data for any LQIP (Low Quality Image Placeholder) features has changed, especially related to Thumbhash/Blurhash. Previously, the image component would lazily load the runtime decoding function for Thumbhash/Blurhash (dynamic import), as to not load that code when the feature is not used at all. However, this introduced some (minor) delay due to the additional chunk loading, but also made the internal implementation of the image components more complex than it needed to be due to having to handle asynchrony. Now the conditional loading is off-loaded to the build plugins, which can make the decision to pull in the decoding code only when needed at build-time, significantly simplifying the runtime image components by removing any async loading and state syncing.

  This changed the internal contract (interface) for the LQIP feature between the build plugins (Vite or webpack) and the image components. This is a breaking chance, but the only impact for users is to make sure you only use v2.x of any of the project's dependencies (`@responsive-image/*`). No changes in code required.

- [#1351](https://github.com/simonihmig/responsive-image/pull/1351) [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179) Thanks [@simonihmig](https://github.com/simonihmig)! - Refactored styles for LQIP options

  This changed the interface between build plugins and image components with regard to how CSS styling information for LQIP options is passed through. While technically a breaking change, this shouldn't affect you as long as you are on V2.x versions of any build blugins _and_ image component packages.

  It also introduces a new `styles: 'inline'` option for build plugins to ship LQIP tyles in the JavaScript bundle, which is needed for the web component, as external styles (external CSS file) was actually not working before due to Shadow DOM isolation.

### Patch Changes

- [#1311](https://github.com/simonihmig/responsive-image/pull/1311) [`ba7a9da`](https://github.com/simonihmig/responsive-image/commit/ba7a9da44d73cfaecb2e57ea7862af519f90b494) Thanks [@wkillerud](https://github.com/wkillerud)! - Add support for Fastly IO as a CDN

- [#1383](https://github.com/simonihmig/responsive-image/pull/1383) [`ae74565`](https://github.com/simonihmig/responsive-image/commit/ae74565a5415a4d98187b6bc7b67b9db3d7c3aa0) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix a too small `screenSize` default in node/SSR environment

  Image components use the user's screen size as the width to use for the fallback image used in the `src` attribute.
  When running in node/SSR it cannot know the browser screen size, so it has to pick a reasonable default. It used to be 320, which is way too small in most cases. Now this defaults to the largest `deviceWidth` (3840 by default).

  In practice this only affected apps doing SSR and only relevant when `srcset` is not supported and the `src` fallback is used, so only very old legacy browsers (IE).

## 1.1.0

### Minor Changes

- [#891](https://github.com/simonihmig/responsive-image/pull/891) [`6cd7e98`](https://github.com/simonihmig/responsive-image/commit/6cd7e980403b2c11595e6eaacd0bbe6d64d7100a) Thanks [@simonihmig](https://github.com/simonihmig)! - Add ThumbHash support

  Adds support for [ThumbHash](https://evanw.github.io/thumbhash/) as a LQIP option.

## 1.0.1

### Patch Changes

- [#883](https://github.com/simonihmig/responsive-image/pull/883) [`4c13f20`](https://github.com/simonihmig/responsive-image/commit/4c13f20f912a5308a347695798a8bc0c7c4187a1) Thanks [@simonihmig](https://github.com/simonihmig)! - Cleanup and update package.json meta data

## 1.0.0

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope

### Patch Changes

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc) Thanks [@simonihmig](https://github.com/simonihmig)! - Extract BlurHash utils onto core

- [#794](https://github.com/simonihmig/responsive-image/pull/794) [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c) Thanks [@simonihmig](https://github.com/simonihmig)! - Add resolveImage utility

## 1.0.0-beta.3

### Patch Changes

- [#794](https://github.com/simonihmig/responsive-image/pull/794) [`7cef8c6`](https://github.com/simonihmig/responsive-image/commit/7cef8c6a743c9ce6fa3879378705437cff11a22c) Thanks [@simonihmig](https://github.com/simonihmig)! - Add resolveImage utility

## 1.0.0-beta.2

### Patch Changes

- [#726](https://github.com/simonihmig/responsive-image/pull/726) [`92f957f`](https://github.com/simonihmig/responsive-image/commit/92f957fcc18fa9485a3f9591b77ca61ff3dd48dc) Thanks [@simonihmig](https://github.com/simonihmig)! - Extract BlurHash utils onto core

## 1.0.0-beta.1

### Major Changes

- [#586](https://github.com/simonihmig/responsive-image/pull/586) [`84abd80`](https://github.com/simonihmig/responsive-image/commit/84abd808faa6a869207396dd1a64caa695155677) Thanks [@simonihmig](https://github.com/simonihmig)! - Rename all packages to be under a new @responsive-image scope
