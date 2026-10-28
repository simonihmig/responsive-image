---
'@responsive-image/solid': patch
---

Run the Solid test suite against both v1 and v2

The separate `tests-v2` workspace package is gone: a single test suite now runs against both Solid v1 and v2, with the version selected by the `solid-v2` `.try.mjs` scenario. `pnpm test:solid-v2` runs the v2 suite locally. No runtime changes.
