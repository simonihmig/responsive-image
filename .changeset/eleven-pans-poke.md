---
'@responsive-image/build-utils': minor
'@responsive-image/vite-plugin': minor
'@responsive-image/webpack': minor
---

Do not apply default value for quality

Instead we rely on `sharp`'s own defaults. For .avif images this will use a lower quality setting (50 instead of 80), which produces smaller sizes with almost the same visual quality as e.g. 80 for jpegs.
