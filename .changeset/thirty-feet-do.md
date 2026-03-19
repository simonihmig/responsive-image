---
'@responsive-image/build-utils': major
'@responsive-image/vite-plugin': major
'@responsive-image/webpack': major
---

Remove `allowUpscale` default config

This option of `imagetools` was true by default before, which allowed images to get upscaled beyond their original size. This has been changed, as this is not really useful.
