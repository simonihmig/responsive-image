import type { ImageData } from '@responsive-image/core';

/**
 * A 1x1 GIF inlined as a data URL. The hydration fixture has to reference an
 * image the browser can actually resolve (otherwise `img.complete` flips to
 * `true` on the network error and the "already loaded" path under test never
 * runs), and a data URL resolves the same way in the browser runner and in
 * the Node snapshot, so one constant serves both suites.
 */
export const FIXTURE_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const LQIP_IMAGE_DATA: ImageData = {
  imageTypes: ['jpeg'],
  imageUrlFor() {
    return FIXTURE_IMAGE;
  },
  availableWidths: [320, 640],
  aspectRatio: 1.5,
  lqip: { class: 'lqip-test-class' },
};

/**
 * What `renderToString(() => <ResponsiveImage src={LQIP_IMAGE_DATA} />)`
 * emits. The server suite asserts the live output equals this, and the client
 * suite hydrates it — so the two can never drift apart silently.
 *
 * The `_hk` keys and `<!--$-->`/`<!--/-->` markers are what let `hydrate()`
 * claim these exact nodes. They are only emitted when the Vite plugin runs
 * its hydratable SSR transform (`ssr: true`), so this fixture is only valid
 * as long as `vitest.config.ts` keeps that flag on.
 */
export const LQIP_SSR_MARKUP =
  `<picture _hk=60><!--$--><source _hk=610 srcset="${FIXTURE_IMAGE} 320w, ${FIXTURE_IMAGE} 640w" type="image/jpeg"><!--/-->` +
  `<!--$--><img _hk=30 width="3840" height="2560" loading="lazy" decoding="async" src="${FIXTURE_IMAGE}" class="ri-img ri-responsive lqip-test-class" /><!--/--></picture>`;

/**
 * The bootstrap `<script>` the server normally inlines. `hydrate()` expects
 * the `_$HY` runtime to exist; this is the part of `generateHydrationScript()`
 * that matters for a non-streamed render.
 */
export const HYDRATION_BOOTSTRAP = `window._$HY={events:[],completed:new WeakSet,r:{},fe(){}}`;
