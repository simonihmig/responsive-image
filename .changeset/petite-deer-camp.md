---
'@responsive-image/cdn': major
---

The default imageTypes changed to 'auto'

The default imageTypes changed from an array of image formats to the string 'auto' in order to have the CDN backend decide the format.
Image components that assume imageTypes is an array need to be updated to accept the string 'auto'. In such cases the component should render only an `<img>` tag with a srcset attribute.
