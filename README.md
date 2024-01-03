# ember-responsive-image

[![CI](https://github.com/simonihmig/ember-responsive-image/actions/workflows/ci.yml/badge.svg)](https://github.com/simonihmig/ember-responsive-image/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-responsive-image.svg)](https://badge.fury.io/js/ember-responsive-image)
[![Ember Observer Score](https://emberobserver.com/badges/ember-responsive-image.svg)](https://emberobserver.com/addons/ember-responsive-image)

An ember addon to automatically generate resized images at build-time, optimized for the responsive web, and using components to render
them easily as `<picture>` elements.

## Key Features

🌇 Supports basic PNG and JPEG formats, as well as next-gen [**WebP**](https://developer.mozilla.org/en-US/Web/Media/Formats/Image_types#webp) and [**AVIF**](https://developer.mozilla.org/en-US/Web/Media/Formats/Image_types#avif), for best image quality at low file sizes.

🏎 Super **fast image processing**, thanks to the awesome [sharp](https://github.com/lovell/sharp) library.

📱 Layout modes for **fixed sizes** (with `1x` and `2x` image variants) as well as **responsive layouts** (`srcset` with optimized image sizes across all devices).

🌍 Besides processing of local images, it also supports integrating remote images from **image CDNs** like [Cloudinary](https://cloudinary.com/) or [imgix](https://imgix.com/) using a versatile image provider abstraction

💯 **Lazy rendering** by default, with optimized `content-visibility` and `decoding` settings and optimized markup, to prevent [**CLS**](https://web.dev/cls/) (_Cumulative Layout Shift_), a core [Web Vital](https://web.dev/vitals/) and [Lighthouse](https://developers.google.com/web/tools/lighthouse) metric.

⏳ Supports advanced **LQIP** (_Low Quality Image Placeholder_) techniques to show a preview while loading, using different configurable strategies
like a blurry low-res image, [BlurHash](https://blurha.sh/) or a simple dominant color.

✨ Octane/Polaris-based, **v2** addon using custom **webpack**-based loader for local image processing, written in **TypeScript** including [Glint](https://github.com/typed-ember/glint) types, supporting [FastBoot](https://ember-fastboot.com/) and [Embroider](https://github.com/embroider-build/embroider), and fully tested.

️⚙ Flexible configuration options

Advanced optimization techniques inspired amongst others by the blog post [Maximally optimizing image loading for the web in 2021](https://www.industrialempathy.com/posts/image-optimizations/).

## Compatibility

- Ember.js v4.8 or above
- ember-auto-import >= 2.7.1 or Embroider using `@embroider/webpack`

## Preface

The `<ResponsiveImage/>` component provided with this addon expects to receive image data for the image it is supposed to display. Unlike a simple `<img>` tag, it will need more data than just the URL to a single image: it needs multiple images in different resolutions and image formats, but also some additional meta data like the aspect ratio or data related to more advanced use cases like [Low Quality Image PLaceholders](#lqip).

This data can come from different sources. The most common one is to let the build plugins provided by [`@ember-responsive-image/webpack`](./packages/webpack/README.md) process local images (i.e. static images that you have in your git repo) and provide the necessary data. But you can also have the processed image data come from other sources like Image CDNs, see [Image Providers](#image-providers).

For the remainder of this documentation we will assume you will be dealing with local images using `@ember-responsive-image/webpack`.

## Getting started

### Migration

If you were previously using an older version (<2.x) of this addon, there is a [Migration Guide](docs/MIGRATION.md) to help you go through the (many!) breaking changes.

### Installation

In your application's directory:

```bash
npm install ember-responsive-image @ember-responsive-image/webpack
// or
yarn add ember-responsive-image @ember-responsive-image/webpack
// or
pnpm add ember-responsive-image @ember-responsive-image/webpack
```

### Setting up Webpack

As explained above, `@ember-responsive-image/webpack` is provided for the Webpack-native build integration. Webpack is used in Ember apps, but in different ways depending on whether you are using Embroider already or a classic Ember CLI build with `ember-auto-import`.

In either case we need to tell Webpack which files it needs to process using the addon's custom webpack loaders. We do this by setting up a module rule such as this:

```js
{
  module: {
    rules: [
      {
        resourceQuery: /responsive/,
        use: require('@ember-responsive-image/webpack').loaders,
      },
    ],
  }
}
```

This is telling Webpack that any import that contains `responsive` in its query part such as `import image from './path/to/image.jpg?responsive'` will be processed by the addon's loaders. You could configure this rule also in different ways, but this way you can use ember-responsive-image without any conflicts with other imports of asset files using Webpack's built-in [asset modules](https://webpack.js.org/guides/asset-modules/).

#### Embroider

To apply this configuration to an Embroider-powered Ember app, edit your `ember-cli-config.js` file and pass the Webpack config using the [options argument of `compatBuild`](https://github.com/embroider-build/embroider?tab=readme-ov-file#options):

```js
const { Webpack } = require('@embroider/webpack');
return require('@embroider/compat').compatBuild(app, Webpack, {
  packagerOptions: {
    webpackConfig: {
      module: {
        rules: [
          {
            resourceQuery: /responsive/,
            use: require('@ember-responsive-image/webpack').loaders,
          },
        ],
      },
    },
  },
});
```

#### Classic build with ember-auto-import

In a classic build with ember-auto-import (make sure you are at least on version 2.7.1!), we pass the Webpack config to the `autoImport` options:

```js
let app = new EmberApp(defaults, {
  autoImport: {
    allowAppImports: ['images/**/*'],
    webpack: {
      module: {
        rules: [
          {
            resourceQuery: /responsive/,
            use: require('@ember-responsive-image/webpack').loaders,
          },
        ],
      },
    },
  },
});
```

Note the use of [`allowAppImports`](https://github.com/embroider-build/ember-auto-import#app-imports) here, which is a way to make the build use ember-auto-import and thus Webpack to handle the files configured by the glob pattern of this configuration option. You can place the images files in a central subfolder under `/app`, like `app/images` as in this example, or even colocate them next to other JavaScript files by targeting specific image extensions instead of certain folders (e.g. `**/*/*.jpg`). Either way make sure that image files you import for use by `ember-responsive-image` are correctly covered by at least one glob pattern passed to `allowAppImports`!

### TypeScript usage

#### Glint

All components and helpers have proper [Glint](https://github.com/typed-ember/glint) types, which allow you when using TypeScript to get strict type checking in your templates.

Unless you are using [strict mode](http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html) templates (via [`<template>` tag](http://emberjs.github.io/rfcs/0779-first-class-component-templates.html)),
you need to import the addon's Glint template registry and `extend` your app's registry declaration as described in the [Using Addons](https://typed-ember.gitbook.io/glint/using-glint/ember/using-addons#using-glint-enabled-addons) documentation:

```ts
import '@glint/environment-ember-loose';

import type ResponsiveImageRegistry from 'ember-responsive-image/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends ResponsiveImageRegistry /* other addon registries */ {
    // local entries
  }
}
```

Should you want to manage the registry by yourself, then omit this import, and instead add the entries in your app by explicitly importing the types of the components and helpers from this addon.

#### Image imports

TODO

## Basic Usage

### Importing images

When Webpack is set up correctly as explained above, we can start to import images that are then being processed by `@ember-responsive-image/webpack`:

```js
import heroImage from './hero.jpg?responsive';
```

Again, when following our conventional setup, we need the `responsive` query param to be passed so that our Webpack loaders are correctly invoked. But advanced Webpack users can also configure this in different ways.

In addition to that, we can also pass query params that affect the actual image processing:

```js
import heroImage from './hero.jpg?lqip=inline&widths=1920,1280,640&responsive';
```

In this case we are processing this image for only this specific import with different image options than the defaults, as we generate the image variants with specific widths and opt into a [Low Quality Image Placeholder](#lqip) technique of `inline`. This applies only to the image data you get back from this specific import, but does not affect any of the other images or even the same image but with different or just the default image options imported elsewhere!

### The `<ResponsiveImage/>` component

In a template you can use the `<ResponsiveImage/>` component. The `@src` argument is required and must contain the necessary image data:

```hbs
<ResponsiveImage @src={{this.heroImage}} />
```

Note that with components with separate `.js` and `.hbs` files, you would need to assign the image data to the backing component class, so you can access it in your template as in this case as `this.heroImage`:

```js
import heroImage from './hero.jpg?lqip=inline&widths=1920,1280,640&responsive';

export default class HeroImageComponent extends Component {
  heroImage = heroImage;
}
```

With [`<template>` tag](https://github.com/ember-template-imports/ember-template-imports) and `.gjs` (`.gts`) components, this becomes much easier:

```gjs
import heroImage from './hero.jpg?lqip=inline&widths=1920,1280,640&responsive';

<template>
  <ResponsiveImage @src={{heroImage}} />
</template>
```

Rendering this component will generate an `<img>` element wrapped in `<picture>` referencing all the resized images in the different formats, for the browser to decide which image it can support and fits best given the current context (device, screen size, user preferences like low bandwidth etc.):

```html
<picture>
  <source
    srcset="
      /assets/images/hero1920w.avif 1920w,
      /assets/images/hero1280w.avif 1280w,
      /assets/images/hero640w.avif   640w
    "
    type="image/avif"
  />
  <source
    srcset="
      /assets/images/hero1920w.webp 1920w,
      /assets/images/hero1280w.webp 1280w,
      /assets/images/hero640w.webp   640w
    "
    type="image/webp"
  />
  <source
    srcset="
      /assets/images/hero1920w.jpg 1920w,
      /assets/images/hero1280w.jpg 1280w,
      /assets/images/hero640w.jpg   640w
    "
    type="image/jpeg"
  />
  <img
    src="1920"
    height="1280"
    class="eri-responsive"
    loading="lazy"
    decoding="async"
  />
</picture>
```

The image in the `src` attribute is calculated by the component and will be used by browsers [without `<picture>` support](https://caniuse.com/picture) - which is basically IE11.

If your image width is not `100vw`, say `70vw` for example, you can specify the `@size` (only `vw` is supported as a unit for now):

```hbs
<ResponsiveImage @src={{heroImage}} @size={{70}} />
```

This will render the corresponding [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-sizes) on all `<source>` elements.
You can also set the attribute like this if your responsive image width is more complicated:

```hbs
<ResponsiveImage @src={{heroImage}} @sizes='(min-width: 800px) 800px, 100vw' />
```

### Fixed layout

The example above assumed you wanted a responsive image, i.e. one that automatically takes the whole available width of its parent element.
This is the default mode, and will automatically add the following CSS to you image:

```css
img {
  width: 100%;
  height: auto;
}
```

But this addon also supports a _fixed_ layout with fixed image dimensions. Just provide either `@width` or `@height` to opt into that mode. Also make sure that the generated image variants have the appropriate sizes:

```gjs
import logoImage from './hero.jpg?lqip=inline&widths=320,640&responsive';

<ResponsiveImage @src={{logoImage}} @width={{320}} />
```

It will still render a `<img>` wrapped in a `<picture>`, but this time it will provide the image with the optimal width (smallest width which is equal or above the target width),
and additionally a `2x` variant for devices with high pixel densities:

```html
<picture>
  <source
    srcset="/assets/images/hero320w.avif 1x, /assets/images/hero640w.avif 2x"
    type="image/avif"
  />
  <source
    srcset="/assets/images/hero320w.webp 1x, /assets/images/hero640w.webp 2x"
    type="image/webp"
  />
  <source
    srcset="/assets/images/hero320w.jpg 1x, /assets/images/hero640w.jpg 2x"
    type="image/jpeg"
  />
  <img
    src="/assets/images/hero320w.jpg"
    width="320"
    height="213"
    class="eri-fixed"
    loading="lazy"
    decoding="async"
  />
</picture>
```

> Note it is sufficient to supply either `@width` or `@height`, the component will still render the missing attribute according to the image's aspect ratio!

## Image formats

Besides the basic PNG and JPEG also the next-gen formats [WebP](https://developer.mozilla.org/en-US/Web/Media/Formats/Image_types#webp) and [AVIF](https://developer.mozilla.org/en-US/Web/Media/Formats/Image_types#avif) are supported.
Every modern browser [supports WebP](https://caniuse.com/webp). AVIF is also pretty well [supported](https://caniuse.com/avif), but takes longer to generate. Given the
way multiple formats are supported using this addon as described above, browsers that support one of those will load them, while other will fallback to basic PNG/JPEG.

To give you an idea of the improvements possible with these formats, here are some examples. _Note that the images might
not show correctly if you are not using a modern browser._

A more detailed analysis can be found on [Jake Archibald's blog](https://jakearchibald.com/2020/avif-has-landed/).

### JPEG

Dimensions: 640px &times; 427px
File size: **16KB**.

![a hero near the costline](docs/images/hero640w.jpg)

### WebP

Dimensions: 640px &times; 427px
File size: **10KB**.

![a hero near the costline](docs/images/hero640w.webp)

### AVIF

Dimensions: 640px &times; 427px
File size: **7KB**.

![a hero near the costline](docs/images/hero640w.avif)

> Note: Generating AVIF files can take a lot of time, as it is very CPU-intensive. Therefore and given the limited browser support,
> the format is currently not enabled by default. You would have to opt-in, by defining the `formats` [configuration option](#configuration) to include AVIF.

## LQIP

_Low Quality Image Placeholder_ is a technique to give users a preview of the image while it is loading. This addon supports different types,
all with their own tradeoffs. Based on the cute hero you saw above, you can see here how these different techniques will look like.

See the [Webpack Configuration](./packages/webpack/README.md#configuration) section for how to configure these.

### Color

This is the most basic technique, calculating the dominant color of the image, and setting it as the background color of the images while it loads.
The "cost" is basically 7bytes, for the hex code of the color.

![dominant color LQIP of a hero image](docs/images/lqip-color.png)

See the [Webpack Configuration](./packages/webpack/README.md#configuration) section for how to configure this.

### Inline

This creates a very small thumbnail of the original image, wraps it into a SVG and applies a blurry filter. This is then
set as a base64 encoded data-URL as the background of the image while it loads. The example below consumes 348 bytes (uncompressed).

![blurry LQIP of a hero image](docs/images/lqip-inline.png)

See the [Webpack Configuration](./packages/webpack/README.md#configuration) section for how to configure this.

### Blurhash

[BlurHash](https://blurha.sh/) is an encoding algorithm and library, dedicated for the very purpose of generating nice looking blurry placeholders, without the
overhead of a real image format, which was never optimized for that kind of _tiny_ images. This example consumes just 40 bytes (uncompressed).

![blurry LQIP of a hero image](docs/images/lqip-blurhash.png)

But the tradeoff here is that it needs a runtime library for decoding, which takes about 4.7KB (1.9KB compressed). Therefore it is less suited if you have just a few images, but shines if you need placeholders for a lot!

BlurHash support is provided by a dedicated additional `@ember-responsive-image/blurhash` package. Please refer to its [documentation](./packages/blurhash/README.md) for additional details!

## Image Providers

So far we have only dealt with local images - static images that are commonly part of your app's git repo and get processed by this addon during the build process.
But this addon provides even a more versatile abstraction to use any kind of (remote) images: image providers.

All the `<ResponsiveImage @src={{imageData}}/>` component needs is an [`ImageData`](./packages/ember-responsive-image/src/types.ts) structure, which contains some meta data for a given image, and a function to compute the actual URL for each referenced image, based on its width and type. This is what importing an image using Webpack loaders returns as explained above, but it is not restricted to that. You could pass that data structure as a static POJO, or generate it more dynamically using a simple function (helper).

Simply pass the result of the helper as the `@src` of the component:

```hbs
<ResponsiveImage @src={{some-image-provider 'some/image.jpg'}} />
```

Besides local images, providers allow using also remote images. The most common use case is to load images from an [image CDN](https://web.dev/image-cdns/), that
is then used to offload all image processing to the Cloud. Moreover, this allows for _dynamic_ image processing, in cases where your images are not
available at build-time. For example you could have an `ember-data` model refer to the raw (large, unprocessed) image, and use
an image CDN as a proxy to scale, optimize and deliver that image as needed, at _runtime_.

This addon comes with additional packages for these image providers, please refer to their documentation for additional details:

- [Cloudinary](./packages/cloudinary/README.md)
- [imgix](./packages/imgix/README.md)

## Configuration

TODO

<!-- ### Image Options

When using images stored locally, the main configuration happens with the `images` array. There you must define at least one configuration item, with at least `include` defined.
But you can provide more, to create separate configurations for different images.

For example if you have a gallery of logos, of which all will be displayed with a width of max. 300px or less,it makes no sense to create very
large images for these, so a setting of `widths: [300, 600],` would make sense here (600px for the `2x` version aka "retina").

> Make sure you don't have multiple `include` definitions accidentally overlapping! You can use `exclude` in this case to prevent this.

- **include:** Glob pattern for which images should be processed based on this configuration.
- **exclude:** Optional pattern which images to exclude, takes precedence over `include`.
- **widths:** These are the widths of the resized images.
- **formats:** which image formats to produce. Supported are: `avif`, `webp`, `png` and `jpeg`. `original` is a special keyword here, representing the image format of the original source image. By default: `['original', 'webp']`
- **quality:** Image quality (JPEG, WebP, AVIF)
- **lqip:** Let's you opt into generating LQIPs, by setting at the `type`to one of the supported values. Disabled by default!
- **lqip.type:** `'inline'`, `'color'` or `'blurhash'`. See the [LQIP section](#lqip) for more details.
- **lqip.targetPixels:** Desired approximate amount of pixels to use for the placeholder (does not apply for `color`).
- **removeSource:** If true, the (large) source images will be removed from the build.
- **justCopy:** If true, the images will just be copied without resizing. This can be useful for development builds to speed things up, but should be false for production.

**Note:** If the width of your origin image is less than the generated should be, the image will be generated unresized. -->

## Advanced Usage

The addon provides a service and a helper for more advances usages if required. This is described in detail in the [Advanced Usage documentation](docs/ADVANCED.md).

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
