---
'@responsive-image/cdn': minor
'@responsive-image/ember': minor
---

Move CDN providers to a single dedicated cdn package.

Ember helpers are now exposed from the main `@responsive-image/ember` package again, wrapping the function from the new `@responsive-image/cdn` package.
The previous dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.
