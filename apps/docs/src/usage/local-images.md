# Local images

Local images are static images that are part of your app's code base and its git repository. At build-time of your app, these will be processed by a [build plugin](../build/index.md), which will generate all the combinations of image sizes and [image formats](./image-formats.md).

This happens whenever you import such an image in your code. The returned value of that import is a `ImageData` structure that you can pass directly into the `src` argument of your framework's [image component](./component.md).

## Setting up the build plugin

Which build plugin to use depends on the build tool (bundler) you use in your app. This project supports both [Vite](../build/vite.md) and [webpack](../build/webpack.md). Please refer to the respective guides for detailled setup instructions!

> [!TIP]
> While there can be different ways to set things up, we recommend setting up the build plugin in such a way that it only gets used for an image import that has an explicit `?responsive` query parameter. This is to preserve the ability to import images using the build tools' original asset support ([asset modules](https://webpack.js.org/guides/asset-modules/) for webpack or Vite's built-in [static assets](https://vitejs.dev/guide/assets)), if all you need is the image URL. So only the images that you want to pass to the responsive image component will need to get imported with that `?responsive` query parameter.

## Specifying image processing parameters

The build plugins support a number of parameters that influence how the imported responsive images get processed. The most essential ones are for setting the image sizes (widths) and [image formats](./image-formats.md), but there a lot more for e.g. image effects.

These can be specified globally as defaults to the build plugin. But all of them can be overriden for every instance of an image import by specifying them as query parameters added to the imported image path. This lets you use the same original image with different parameters, depending on where and how it is going to be rendered.

The following example is using a `200px` wide [fixed layout](./component.md#fixed-layout), therefore it only needs to generate the image with a width of 200 as well as 400 (for high density displays aka "retina"). On top of that it tweaks the image quality and adds an inlined small image as a [Low Quality Image Placeholder](./lqip.md):

::: code-group

```gjs [Ember]
import { ResponsiveImage } from '@responsive-image/ember';
import image from './image.jpg?responsive&w=200,400&quality=90&lqip=inline';

<template>
  <ResponsiveImage @width={{200}} @src={{image}} />
</template>
```

:::

## Image parameters reference

The following table lists all supported image parameters:

TODO
