---
'@responsive-image/solid': patch
---

Add Solid v2 support and fix `style` and layout handling

- The component is now type-checked and tested against both Solid v1 and v2
  from the same package (the v2 test suite runs alongside the v1 suite).
- Custom `style` values are now merged with the LQIP styles instead of replacing
  them. Previously a custom `style` was discarded while the image was loading
  (and on Solid v2 it was lost entirely, as `style={undefined}` clears the
  attribute).
- The component now switches between the `<picture>`/`<img>` markup reactively
  when `src` changes to or from an `imageTypes: 'auto'` image. Before, the
  layout was decided once at setup, so the stale structure was kept (and an
  auto-format image could be rendered with a bogus `<source>`).
