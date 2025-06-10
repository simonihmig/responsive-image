---
'@responsive-image/react': minor
---

Export the CSS as well as a JS only variant

Most of the time the default export should "just work", but
this change adds some flexibility for users of the package.

In particular it makes it easier to include the CSS in a client-side
bundle in an application that is otherwise server-side only.
