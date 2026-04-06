# @responsive-image/vue

## 1.0.1

### Patch Changes

- [#2266](https://github.com/simonihmig/responsive-image/pull/2266) [`0da8ed7`](https://github.com/simonihmig/responsive-image/commit/0da8ed78fff44db62970e42d4ab6f12fb8437f26) Thanks [@simonihmig](https://github.com/simonihmig)! - Use deterministic width for fallback `src`

  The `src` fallback (used for legacy browser not supporting `srcset`) will refer to a deterministically computed image size (based on the largest device width), so there is no delta between SSR and client-side rendering.

## 1.0.0

### Major Changes

- [#2109](https://github.com/simonihmig/responsive-image/pull/2109) [`9eba984`](https://github.com/simonihmig/responsive-image/commit/9eba9843dd536865a25dcd1825ad459d1c665e98) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for Vue

  Adds a new `@responsive-image/vue` package providing the image component with a native [Vue.js](https://vuejs.org/) implementation.
