---
'@responsive-image/core': patch
---

Fix a too small `screenSize` default in node/SSR environment

Image components use the user's screen size as the width to use for the fallback image used in the `src` attribute. 
When running in node/SSR it cannot know the browser screen size, so it has to pick a reasonable default. It used to be 320, which is way too small in most cases. Now this defaults to the largest `deviceWidth` (3840 by default).

In practice this only affected apps doing SSR and only relevant when `srcset` is not supported and the `src` fallback is used, so only very old legacy browsers (IE).
