---
'@responsive-image/build-utils': minor
'@responsive-image/vite-plugin': minor
'@responsive-image/webpack': minor
---

Add caching support

Generated images will be cached, based on the source and image processing config. This is especially useul for the vite-plugin in dev mode (serve), since images are processed on-demand within the Vite dev server middleware.
