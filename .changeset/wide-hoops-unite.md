---
'@responsive-image/build-utils': major
'@responsive-image/vite-plugin': major
'@responsive-image/webpack': major
'@responsive-image/svelte': major
'@responsive-image/ember': major
'@responsive-image/react': major
'@responsive-image/solid': major
'@responsive-image/core': major
'@responsive-image/wc': major
---

Refactored styles for LQIP options

This changed the interface between build plugins and image components with regard to how CSS styling information for LQIP options is passed through. While technically a breaking change, this shouldn't affect you as long as you are on V2.x versions of any build blugins _and_ image component packages.

It also introduces a new `styles: 'inline'` option for build plugins to ship LQIP tyles in the JavaScript bundle, which is needed for the web component, as external styles (external CSS file) was actually not working before due to Shadow DOM isolation.
