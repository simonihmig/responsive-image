# Remote images

Besides local images, provider functions allow to load remote images, i.e. images that are not static parts of your local project. The most common use case is to load responsive images from an [image CDN](https://web.dev/image-cdns/), that is then used to offload all image processing to the Cloud. This allows for _dynamic_ image processing, in cases where your images are not available at build-time. For example you could have an API endpoint refer to the raw (large, unprocessed) image, and use
an image CDN as a proxy to scale, optimize and deliver that image as needed, at _runtime_.

See the [image CDNs](../cdn/index.md) section for information on loading remote images from supported image CDNs.

> [!TIP]
> Besides the built-in support for selected image CDNs, you can also create your own custom integration by writing your own provider functions. The only requirement for the [image component](./component.md) is to receive an `ImageData` object as its `src` argument. See the [Concepts page](./concepts.md#image-source) for more information.
