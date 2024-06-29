// Types for compiled templates
declare module 'ember-test-app/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const tmpl: TemplateFactory;
  export default tmpl;
}

// To make TS understand our image imports, we have to tag them using a `responsive` query parameter, that has to come *last*!
// We cannot use something like `*.jpg*` that works with queries, as TS only supports a single wildcard.
// See https://github.com/microsoft/TypeScript/issues/38638
declare module '*responsive' {
  import { ImageData } from '@responsive-image/ember';
  const value: ImageData;
  export default value;
}
