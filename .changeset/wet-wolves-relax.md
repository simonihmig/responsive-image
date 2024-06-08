---
'@responsive-image/webpack': major
---

Use imagetools for more image processing options

`@responsive-image/webpack` is now using the `imagetools-core` package for image processing via `sharp`. This now supports not only scaling to different sizes and generating different image formats as before, but also a lot of other [directives](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md) for image manipulation.

_Breaking Changes_: Some parameters passed to the loader as defaults directly or using as query parameters in imports had to change to align with that library:

- `widths` has been renamed to `w`
- `formats` to `format`
- the separator for array vlues has been changed to `;` instead of `,`

Example: `import image from './path/to/image.jpg?w=400;800&responsive';`
