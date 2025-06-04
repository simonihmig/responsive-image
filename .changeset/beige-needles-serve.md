---
'@responsive-image/core': major
---

ImageData.imageTypes can now be the string 'auto'

CDNs often have a feature to automatically choose the
optimal format based on the visiting browser. This type
change is made to support using such features in the
`cdn` package.

Where you assume `imageTypes` is an array of strings,
update to also support the `imageTypes: 'auto'` case.
