---
'@responsive-image/cdn': patch
---

Fix cloudinary chained `transformations` array being mutated, which accumulated resize steps across `srcset` URLs
