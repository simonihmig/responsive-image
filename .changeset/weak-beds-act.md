---
'@responsive-image/ember': major
'@responsive-image/core': major
'@responsive-image/cdn': major
'@responsive-image/wc': major
---

Refactor the way to set config

The `ember` package does not read from `config/addons.js` anymore. Instead an explicit runtime call to `setConfig()` is needed, same as for the `wc` package. The `cdn` package reads its config from the `cdn` namespace.
