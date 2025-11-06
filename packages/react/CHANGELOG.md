# @responsive-image/react

## 1.1.5

### Patch Changes

- [#1855](https://github.com/simonihmig/responsive-image/pull/1855) [`9e85dec`](https://github.com/simonihmig/responsive-image/commit/9e85dec070bcee9fa9dc8c3e52de402599a2ebdb) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix loading state when image is loaded already

  When the image was already loaded when the component would render initially, the load event would get missed and so some optional LQIP styles (background image) would not get removed properly. This situation can easily happen in a SSR setup.

  In most cases (opaque images) a user wouldn't see this, but with partially transparent images the LQIP would shine through.

## 1.1.4

### Patch Changes

- [#1712](https://github.com/simonihmig/responsive-image/pull/1712) [`c97ca84`](https://github.com/simonihmig/responsive-image/commit/c97ca8456167169cd0565f99cd72025b7902dc26) Thanks [@simonihmig](https://github.com/simonihmig)! - Force recreating the `<img>` element to show LQIP styles

  When changing the `src` argument dynamically and LQIP styles are being used, the `<img>` element will be recreated instead of reusing the existing DOM node. Otherwise LQIP styles for the new image would not be visisble, as the browser would continue showing the old (already loaded) image while the new one is loading, hiding the LQIP preview (implemented as `background-image` based styles). The `<img>` element is essentially a stateful element, which in this case is not playing in our favor.

  For dynamically changing `src` with image data that does not have LQIP styles, the problem does not apply and therefore nothing changes: re-rendering will continue to reuse the existing DOM element, as this is more efficient.

## 1.1.3

### Patch Changes

- [#1662](https://github.com/simonihmig/responsive-image/pull/1662) [`ca440a9`](https://github.com/simonihmig/responsive-image/commit/ca440a9069f373cafca2aa79428c34d02aab2dc4) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix LQIP reactivity when src changes

  When changing the `src` argument dynamically, the loading state was not correctly reset. This is fixing it, so that the new image's LQIP styles get applied while it is loading.

## 1.1.2

### Patch Changes

- [#1584](https://github.com/simonihmig/responsive-image/pull/1584) [`6746123`](https://github.com/simonihmig/responsive-image/commit/6746123bd971fcc033f8350cefe16ed4b5c1f54e) Thanks [@wkillerud](https://github.com/wkillerud)! - Map LQIP styles to React format

  Fixes a warning about unsupported style properties when using CSS attribute names with dashes. The React component now maps CSS attributes to the camelCase React expects.

## 1.1.1

### Patch Changes

- [#1563](https://github.com/simonihmig/responsive-image/pull/1563) [`06d9e9b`](https://github.com/simonihmig/responsive-image/commit/06d9e9bea0afd7b7d9e06827664f7a2946de04a2) Thanks [@wkillerud](https://github.com/wkillerud)! - Merges given class name instead of replacing internal classes

  Now you can give the React, Svelte and Solid components a custom class name without breaking the built-in styles or having to add `ri-img`, `ri-responsive` or `ri-fixed` yourself.

- Updated dependencies [[`d22c0fa`](https://github.com/simonihmig/responsive-image/commit/d22c0fac3f7c1bf03057745d802a9b58aa7075d9)]:
  - @responsive-image/core@2.1.0

## 1.1.0

### Minor Changes

- [#1408](https://github.com/simonihmig/responsive-image/pull/1408) [`04979f8`](https://github.com/simonihmig/responsive-image/commit/04979f823085a1894219e7070f79138fca0e7558) Thanks [@wkillerud](https://github.com/wkillerud)! - Export the CSS as well as a JS only variant

  Most of the time the default export should "just work", but this change adds some flexibility for users of the package.

  In particular it makes it easier to include the CSS in a client-side bundle in an application that is otherwise server-side only.

### Patch Changes

- [#1390](https://github.com/simonihmig/responsive-image/pull/1390) [`323fa8a`](https://github.com/simonihmig/responsive-image/commit/323fa8adf9aec78d41c105f56c51fae008ef6ae6) Thanks [@wkillerud](https://github.com/wkillerud)! - Add missing README

## 1.0.0

### Major Changes

- [#1364](https://github.com/simonihmig/responsive-image/pull/1364) [`18dbfea`](https://github.com/simonihmig/responsive-image/commit/18dbfeacb051929631d42a7424e3638a4d0d2339) Thanks [@simonihmig](https://github.com/simonihmig)! - Add support for React

  Adds a new `@responsive-image/react` package providing the image component with a native [React](https://react.dev/) implementation.

### Minor Changes

- [#1346](https://github.com/simonihmig/responsive-image/pull/1346) [`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea) Thanks [@wkillerud](https://github.com/wkillerud)! - Add support for the 'auto' imageType

### Patch Changes

- Updated dependencies [[`b0ec36f`](https://github.com/simonihmig/responsive-image/commit/b0ec36f1c69fe7a92c86b7acb3ea2198b7b2b9ea), [`2a12953`](https://github.com/simonihmig/responsive-image/commit/2a12953af08d22d5d9ba255c8a53025afd616a17), [`ba7a9da`](https://github.com/simonihmig/responsive-image/commit/ba7a9da44d73cfaecb2e57ea7862af519f90b494), [`ae74565`](https://github.com/simonihmig/responsive-image/commit/ae74565a5415a4d98187b6bc7b67b9db3d7c3aa0), [`cfaabb7`](https://github.com/simonihmig/responsive-image/commit/cfaabb7f56e312fdefcd50aacde4810eb1667179)]:
  - @responsive-image/core@2.0.0
