---
'@responsive-image/svelte': patch
'@responsive-image/ember': patch
'@responsive-image/react': patch
'@responsive-image/solid': patch
'@responsive-image/vue': patch
'@responsive-image/wc': patch
---

Use deterministic width for fallback `src`

The `src` fallback (used for legacy browser not supporting `srcset`) will refer to a deterministically computed image size (based on the largest device width), so there is no delta between SSR and client-side rendering.
