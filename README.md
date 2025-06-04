# ResponsiveImage

[![CI](https://github.com/simonihmig/responsive-image/actions/workflows/ci.yml/badge.svg)](https://github.com/simonihmig/responsive-image/actions/workflows/ci.yml)

The multi-framework JavaScript library for responsive images.

## Key Features

📦 **Multi Framework**:
Supports Vite and Webpack for local image processing, a framework-agnostic core and components for multiple frontend frameworks: Ember.js, Lit, Solid and more in the future.

🌇 **Next-gen image formats**:
Supports basic PNG and JPEG formats, as well as next-gen WebP and AVIF, for increased performance with optimal image quality at small file sizes.

🛠️ **Local image processing**:
Fast image processing of local images with a selection of optionally applyable filters and effects, using the popular sharp library.

🌍 **Image CDNs**:
Besides processing of local images, it also supports integrating remote images from image CDNs like Cloudinary or imgix using a versatile image provider abstraction.

⏳ **Image Placeholders**:
Supports Low Quality Image Placeholders (LQIP) techniques to show a preview while loading, using different strategies like a blurry low-res image, BlurHash or a simple dominant color.

📱 **Layout modes**:
Layout modes for fixed sizes (with 1x and 2x image variants) as well as responsive layouts (srcset with optimized image sizes across all devices).

🏎 **Web Performance**:
Lazy rendering by default, with optimized content-visibility and decoding settings and optimized markup, to prevent CLS (Cumulative Layout Shift), a core Web Vital and Lighthouse metric.

✨ **High Quality**:
Engineered with quality in mind, all functionality is fully tested (unit and integration tests), packages ship with native TypeScript types.

## Documentation

Visit [responsive-image.dev](https://responsive-image.dev) for our complete documentation site.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
