---
'@responsive-image/ember': patch
---

Refactor BlurHash usage in Ember

Use dynamic import of local blurhash module instead of public asset, to let the bundler produce more robust output (e.g. custom publicPath)
