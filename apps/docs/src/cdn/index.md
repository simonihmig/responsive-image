# Image CDNs

This library supports multiple image CDNs to render [remote images]() with the image component.

With image CDNs the image processing is offloaded to the Cloud. This allows for _dynamic_ image processing, in cases where your images are not available at build-time. For example you could have an API endpoint (that hydrates a client-side model) refer to a raw (large, unprocessed) image, and use an image CDN as a proxy to scale, optimize and deliver that image as needed, at _runtime_.

The following image CDNs are supported by the `@responsive-image/cdn` package out of the box:

- [Cloudinary](./cloudinary.md)
- [Imgix](./imgix.md)
- [Netlify](./netlify.md)
