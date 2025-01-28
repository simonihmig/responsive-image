---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'ResponsiveImage'
  text: 'The multi-framework JavaScript library for responsive images.'
  tagline: Responsive images made easy.
  image:
    src: /aurora-home.webp
    alt: Aurora Borealis
  actions:
    - theme: brand
      text: What is it?
      link: /intro/what
    - theme: brand
      text: Getting started
      link: /intro/getting-started

features:
  - title: Multi Framework
    details: 'Supports Vite and Webpack for local image processing, a framework-agnostic core and components for multiple frontend frameworks: Ember, Solid, Svelte and a universal web component.'
  - title: Next-gen image formats
    details: Supports basic PNG and JPEG formats, as well as next-gen WebP and AVIF, for increased performance with optimal image quality at small file sizes.
  - title: Local image processing
    details: Fast image processing of local images with a selection of optionally applyable filters and effects, using the popular sharp library.
  - title: Image CDNs
    details: Besides processing of local images, it also supports integrating remote images from <b>image CDNs</b> like Cloudinary or imgix using a versatile image provider abstraction
  - title: Image Placeholders
    details: Supports Low Quality Image Placeholders (LQIP) techniques to show a preview while loading, using different strategies like a blurry low-res image, BlurHash or a simple dominant color.
  - title: Layout modes
    details: Layout modes for fixed sizes (with 1x and 2x image variants) as well as responsive layouts (srcset with optimized image sizes across all devices).
  - title: Web Performance
    details: Lazy rendering by default, with optimized content-visibility and decoding settings and optimized markup, to prevent CLS (Cumulative Layout Shift), a core Web Vital and Lighthouse metric.
  - title: High Quality
    details: Engineered with quality in mind, all functionality is fully tested (unit and integration tests), packages ship with native TypeScript types.
---
