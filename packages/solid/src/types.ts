/**
 * Passthrough attributes for the rendered `<img>` element that are version-neutral.
 *
 * Solid 1.x exposes image attributes through the `JSX` namespace on `solid-js`,
 * Solid 2.x through the `JSX` namespace on `@solidjs/web`. Referencing either
 * would make the published types work for only one major version of Solid, so
 * the shared subset used by this component is declared here. Unknown
 * `data-*`, `aria-*` and `on*` attributes stay supported through index
 * signatures.
 */
export interface ImgAttributes {
  [key: `data-${string}`]: unknown;
  [key: `aria-${string}`]: boolean | string | undefined;
  [key: `on${string}`]: unknown;

  alt?: string | undefined;
  class?: string | undefined;
  crossorigin?: string | undefined;
  decoding?: 'async' | 'auto' | 'sync' | undefined;
  draggable?: boolean | string | undefined;
  elementtiming?: string | undefined;
  fetchpriority?: 'auto' | 'high' | 'low' | undefined;
  hidden?: boolean | undefined;
  id?: string | undefined;
  inert?: boolean | undefined;
  ismap?: boolean | undefined;
  loading?: 'eager' | 'lazy' | undefined;
  nonce?: string | undefined;
  referrerpolicy?: string | undefined;
  role?: string | undefined;
  style?: string | Record<string, unknown> | undefined;
  tabindex?: number | string | undefined;
  title?: string | undefined;
  translate?: 'no' | 'yes' | undefined;
  usemap?: string | undefined;
}
