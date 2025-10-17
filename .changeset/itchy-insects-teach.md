---
"@responsive-image/vite-plugin": patch
---

Configure `noExternal` for server env

Framework package use Vite features, specifically CSS imports, that cannot directly run in node.js in server environments (SSR), so let Vite bundle them.
