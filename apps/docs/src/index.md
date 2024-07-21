---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Responsive Image'
  text: 'The multi-framework JavaScript library for responsive images.'
  tagline: Responsive images made easy.
  actions:
    - theme: brand
      text: Getting started
      link: /getting-started
    # - theme: alt
    #   text: API Examples
    #   link: /api-examples

features:
  - title: Next-gen image formats
    icon: 🌇
    details: Supports basic PNG and JPEG formats, as well as next-gen WebP and AVIF, for best image quality at low file sizes.
  - title: Fast image processing
    icon: 🏎
    details: Super fast image processing, thanks to the awesome sharp library.
  - title: Layout modes
    icon: 📱
    details: Layout modes for fixed sizes (with 1x and 2x image variants) as well as responsive layouts (srcset with optimized image sizes across all devices).
  - title: Image CDNs
    icon: 🌍
    details: Besides processing of local images, it also supports integrating remote images from <b>image CDNs</b> like Cloudinary or imgix using a versatile image provider abstraction
  - title: Web Performance
    icon: 💯
    details: Lazy rendering by default, with optimized content-visibility and decoding settings and optimized markup, to prevent CLS (Cumulative Layout Shift), a core Web Vital and Lighthouse metric.
  - title: Low Quality Image Placeholders
    icon: ⏳
    details: Supports advanced LQIP techniques to show a preview while loading, using different configurable strategies like a blurry low-res image, BlurHash or a simple dominant color.
  - title: Multi Framework
    icon: 🛠️
    details: 'Supports Vite and Webpack for local image processing, a framework-agnostic core and components for multiple frontend frameworks: Ember.js and more in the future.'
  - title: High Quality
    icon: ✨
    details: Engineered with quality in mind, all functionality is fully tested (unit and integration tests), packages ship with native TypeScript types.
---
