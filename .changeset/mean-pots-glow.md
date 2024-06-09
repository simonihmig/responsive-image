---
'@responsive-image/cdn': major
'@responsive-image/ember': major
---

Use Record-based API for cloudinary transformations

Instead of passing cloudinary transformations as a string according to the Cloudinary Transformation URL API, you need to pass them as an object. If you want to use chained transformations, pass an array of objects.

```js
const simpleTransformation = cloudinaryProvider('foo/bar.jpg', {
  transformations: { co: 'rgb:20a020', e: 'colorize:50' },
});

const chainedTransformation = cloudinaryProvider('foo/bar.jpg', {
  transformations: [
    { co: 'rgb:20a020', e: 'colorize:50' },
    { ar: '1.0', c: 'fill', w: '150' },
    { r: 'max' },
  ],
});
```
