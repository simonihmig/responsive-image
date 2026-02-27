// To make TS understand our image imports, we have to tag them using a `responsive` query parameter, that has to come *last*!
// We cannot use something like `*.jpg*` that works with queries, as TS only supports a single wildcard.
// See https://github.com/microsoft/TypeScript/issues/38638
declare module '*responsive' {
  import { ImageData } from '@responsive-image/core';
  const value: ImageData;
  export default value;
}
