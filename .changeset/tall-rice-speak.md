---
'@responsive-image/wc': patch
---

Fix dependency on `tslib`

`tslib` must be a dependency, not devDependency, as the compiled code imports it.
