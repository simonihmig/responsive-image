---
'@ember-responsive-image/blurhash': major
'@ember-responsive-image/cloudinary': major
'ember-responsive-image': major
'@ember-responsive-image/imgix': major
'@ember-responsive-image/webpack': major
---

Major rewrite as a v2 addon

The main addon is now a fully static v2 addon. No more broccoli, all processing of local images has moved to Webpack-native loaders, invoked by ember-auto-import for classic builds or Embroider.

The main breaking change here is that when using the `<ResponsiveImage/>` component you don't refer to the image by a string-based reference anymore. In the pull-based world of v2 addons, you need to explicitly import the image file. This triggers the Webpack loaders, applying the image processing. This has t he benefit of only processing what is actually used, and being able to apply specific image processing options _per import_.

For organizational purposes, the different concerns (image processing, image CDN providers etc.) have been split into separate packages that you need to add as dependencies if you make use of them:

- `@ember-responsive-image/webpack` for local image processing
- `@ember-responsive-image/cloudinary` for supporting the Cloudinary image CDN
- `@ember-responsive-image/imgix` for supporting the Imgix image CDN
- `@ember-responsive-image/blurhash` for BlurHash LQIP support

The configuration of the addon has been moved from `ember-cli-build.js` to separate configurations for each of the above packages. Please refer to their respective documentation.
