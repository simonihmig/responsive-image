---
'@responsive-image/vite-plugin': patch
'@responsive-image/webpack': patch
---

Support `aspect` ratio parameter correctly

When `aspect` is given (via import query params), the height of the image is adjusted to match when resizing, and the image component will correctly render with the new aspect ratio, rather than that of the original image.
