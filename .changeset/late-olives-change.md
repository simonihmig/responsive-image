---
'@responsive-image/ember': major
'@responsive-image/cdn': patch
---

Remove FastBoot related workarounds in `imgix` image CDN provider

Instead of working around a [known issue](https://github.com/ember-fastboot/ember-cli-fastboot/issues/816) in the actual runtime code, users need to add a FastBoot config to expose needed globals like `URL` or `URLSearchParams`, as documented in the [Ember guide](https://responsive-image.dev/frameworks/ember#fastboot).
