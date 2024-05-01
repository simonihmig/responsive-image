---
"@ember-responsive-image/cdn": patch
"@ember-responsive-image/core": patch
"ember-responsive-image": patch
---

Move CDN providers to a single dedicated cdn package. 

Ember helpers are now exposed from the main `ember-responsive-image` package again, wrapping the function from the new `@ember-responsive-image/cdn` package.
The dedicated addons `@ember-responsive-image/cloudinary` and `@ember-responsive-image/imgix` have been removed again.
