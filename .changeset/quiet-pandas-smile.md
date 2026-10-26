---
'@responsive-image/solid': patch
---

Merge custom `style` values with the LQIP styles instead of replacing them. Previously a custom `style` was discarded while the image was loading (and on Solid v2 it was lost entirely, as `style={undefined}` clears the attribute).
