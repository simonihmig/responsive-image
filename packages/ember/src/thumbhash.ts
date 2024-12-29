// ThumbHash SSR support
// Expose this as a public asset separate from the compiled addon source, to allow to load this in a SSR (FastBoot) environment ahead of the main bundle.
// Note: this is only needed because of legacy output semantics in Ember's index.html. With input semantics in a Vite build, this shouldn't be needed, as
// you should be able to import this directly and let the bundler figoure out the rest.
export { applySSR } from '@responsive-image/core/thumbhash/ssr';
