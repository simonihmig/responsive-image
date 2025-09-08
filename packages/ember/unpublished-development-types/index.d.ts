// Add any types here that you need for local development only.
// These will *not* be published as part of your addon, so be careful that your published code does not rely on them!

import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

// To make TS understand our image imports, we have to tag them using a `responsive` query parameter, that has to come *last*!
// We cannot use something like `*.jpg*` that works with queries, as TS only supports a single wildcard.
// See https://github.com/microsoft/TypeScript/issues/38638
declare module '*responsive' {
  import type { ImageData } from '@responsive-image/core';
  const value: ImageData;
  export default value;
}
