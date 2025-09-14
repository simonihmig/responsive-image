---
'@responsive-image/svelte': patch
'@responsive-image/ember': patch
'@responsive-image/react': patch
'@responsive-image/solid': patch
'@responsive-image/wc': patch
---

Fix LQIP reactivity when src changes

When changing the `src` argument dynamically, the loading state was not correctly reset. This is fixing it, so that the new image's LQIP styles get applied while it is loading.
