---
'@responsive-image/svelte': patch
'@responsive-image/ember': patch
'@responsive-image/react': patch
'@responsive-image/solid': patch
'@responsive-image/wc': patch
---

Fix loading state when image is loaded already

When the image was already loaded when the component would render initially, the load event would get missed and so some optional LQIP styles (background image) would not get removed properly. This situation can easily happen in a SSR setup. 

In most cases (opaque images) a user wouldn't see this, but with partially transparent images the LQIP would shine through.
