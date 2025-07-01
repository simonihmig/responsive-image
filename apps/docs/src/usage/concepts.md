# Core concepts

This project consists of a number of different packages. On the one hand they cover the frontend part responsible for rendering the responsive image markup, supporting different JavaScript [frameworks](../frameworks/index.md). On the other hand, there are packages to provide the image data, either [build plugins](../build/index.md) for processing [local images](./local-images.md) or providers for [Image CDNs](../cdn/index.md) to refer to [remote image](./remote-images.md).

## Image component

The image component will take some image data as its source, and render that using optimal HTML markup for responsive images, using a combination of `<picture>`, `<source>` and `<img>` elements. That will make the browser be able to pick the optimal image size and [format](./image-formats.md). If the image data has that available, the component will also be able to display an immediately visible [Low Quality Image Placeholder](./lqip.md) while the high resolution image is loading.

[More about the image component](component.md)

## Image data

The image data used as the source for the image component can come from different sources. Essentially, it is a data structure that conforms to the `ImageData` interface as defined [here](https://github.com/simonihmig/responsive-image/blob/docs-vitepress/packages/core/src/types.ts). While you _could_ provide that data structure manually, usually you will not need to get in touch with that yourself. Instead, it will be provided to you by either

- an `import` of a [local image](./local-images.md), processed by a [build plugin](../build/index.md) for one of the supported build tools, that will take the original high resolution image and generate all required combinations of image sizes and [image formats](./image-formats.md) (as configured) as part of your app's build
- the return value of a function for one of the supported [Image CDNs](../cdn/index.md), that will take a reference to a [remote image](./remote-images.md) hosted or proxied by such a CDN
