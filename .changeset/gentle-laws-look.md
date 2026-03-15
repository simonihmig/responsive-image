---
'@responsive-image/vite-plugin': patch
---

Use a default `include` value

No need to supply the `include` option anymore, as the plugin will use a reasonable default. All imports of image files that include a `responsive` query parameter will be processed by the plugin by default.
