---
'@responsive-image/solid': patch
---

Fix tree-shaking of `solid-js` in `ResponsiveImage`

The component imported `solid-js` as a namespace (`import * as Solid from 'solid-js'`) to pick `onMount` (Solid 1) or `onSettled` (Solid 2) at runtime. That forced bundlers to keep the entire `solid-js` export surface, so every page of a consumer app paid for it in the shared vendor chunk, not only pages rendering `ResponsiveImage`. In a Solid 2 + Vite 8 SSR app the shared vendor chunk shrinks from 168,104 to 80,476 bytes minified (60,547 to 29,482 bytes gzipped, -51%) with this fix.

`ResponsiveImage` now uses named imports only, and detects images that already loaded before hydration (or from cache) from its `ref`, which works the same in Solid 1 and 2.
