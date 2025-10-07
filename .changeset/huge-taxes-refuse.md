---
'@responsive-image/svelte': patch
'@responsive-image/ember': patch
'@responsive-image/react': patch
'@responsive-image/solid': patch
'@responsive-image/wc': patch
---

Force recreating the `<img>` element to show LQIP styles

When changing the `src` argument dynamically and LQIP styles are being used, the `<img>` element will be recreated instead of reusing the existing DOM node. Otherwise LQIP styles for the new image would not be visisble, as the browser would continue showing the old (already loaded) image while the new one is loading, hiding the LQIP preview (implemented as `background-image` based styles). The `<img>` element is essentially a stateful element, which in this case is not playing in our favor. 

For dynamically changing `src` with image data that does not have LQIP styles, the problem does not apply and therefore nothing changes: re-rendering will continue to reuse the existing DOM element, as this is more efficient.
