---
'@responsive-image/core': minor
---

Add configuration option to set width for img fallback

Using `setConfig` you can now set a custom width for the `src` attribute in the `<img>` tag for older browsers that may not support `<picture>`. The default behavior is to use the largest entry in `deviceWidths`, which is 3840.

See a [usage example in the documentation](https://responsive-image.dev/usage/configure).
