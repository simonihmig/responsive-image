# What is ResponsiveImage?

ResponsiveImage is a library, or better a family of libraries, that will make rendering responsive images in a JavaScript application easy.

Let's start first with explaining what responsive images are. As [MDN defines them](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images), they are "images that work well on devices with widely differing screen sizes, resolutions, and other such features". This goal can be supported in different ways:

- the browser is given a choice of images in different sizes, so it can pick whatever is the most appropriate for the given device. An image spanning the full browser width should match that size, such that a mobile device will load a smaller version to not waste network bandwidth, while your desktop machine connected to a 5K monitor will get the super high resolution one.
- for images with a fixed width, devices with a high density screen (aka ["retina"](https://en.wikipedia.org/wiki/Retina_display)) should have an image with twice the size (2x) available for that extra crispiness.
- modern [image formats](../usage/image-formats.md) like WebP or AVIF can provide high quality images with a high compression ratio, while legacy browsers might need a fallback to classic JPEG.

All of this can be supported by a mix of modern HTML markup beyond just a simple `<img>`: `<picture>`, `<source>` and `srcset`.

> [!TIP]
> This is well explained in more detail in Jake Archibald's ["Anatomy of responsive images"](https://jakearchibald.com/2015/anatomy-of-responsive-images/).

## So how does ResponsiveImage help with this?

There are two main ingredients in the mix here: one is to render that markup (the _output_), and the other is to provide the actual images in those different sizes and formats (the _input_).

### Image component

Rendering responsive images is the concern of the [image component](../usage/component.md), that has different implementations based on your choice of [framework](../frameworks/index.md) or technology. On top of the basic markup, it will also apply best practices for optimal performance, like reducing [Cumulative Layout Shift (CLS)](https://web.dev/cls/), lazy loading or support for [Low Quality Image Placeholders (LQIP)](../usage/lqip.md).

> [!TIP]
> Malte Ubl's ["Maximally optimizing image loading for the web"](https://www.industrialempathy.com/posts/image-optimizations/) is a great read for those optimization techniques!

### Processing local images

A [build plugin](../build/index.md) can provide the input to the image component by processing [local images](../usage/local-images.md). It integrates with your project's build system to generate all the required permutations of image sizes and formats for you.

### Loading remote images from image CDNs

An alternative to processing local images is to delegate that work to an [image CDN](https://web.dev/articles/image-cdns), that will process and serve [remote images](../usage/remote-images.md) dynamically at runtime in the Cloud. Support for different [CDN providers](../cdn/index.md) is included out of the box.

---

Now ready to get your hands dirty? Then let's [get started](./getting-started.md)!
