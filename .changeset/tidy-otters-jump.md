---
'@responsive-image/solid': patch
---

Switch between the `<picture>`/`<img>` markup reactively when `src` changes to or from an `imageTypes: 'auto'` image. Before, the layout was decided once at setup, so the stale structure was kept (and an auto-format image could be rendered with a bogus `<source>`).
