---
'@responsive-image/solid': patch
---

Apply the LQIP placeholder when `src` changes on an already-loaded image. The
cache-hit check consulted the previous `<img>`, which `keyed` recreation leaves
in place until the ref of the new element runs — so once that element's request
settled, a swapped-in image silently lost its LQIP class, inline styles and
attribute. Whether it lost them depended on network timing. The check is now
scoped to the image the element is actually rendering.
