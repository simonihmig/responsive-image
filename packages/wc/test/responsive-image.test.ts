import { fixture, fixtureCleanup, waitUntil } from '@open-wc/testing-helpers';
import { env, type ImageData } from '@responsive-image/core';
import { html } from 'lit';
import { describe, expect, test, afterEach } from 'vitest';

import { trigger } from './image-helper.js';

import type { ResponsiveImage } from '../src/responsive-image.js';

import '../src/responsive-image.js';

const cacheBreaker = () => `${new Date().getTime()}-${Math.random()}`;

afterEach(() => fixtureCleanup());

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
    aspectRatio: 2,
  };

  describe('basics', () => {
    test('it renders a source for every format', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('picture')).toBeInTheDocument();
      expect(el.shadowRoot?.querySelectorAll('source')).to.have.length(3);
      expect(
        el.shadowRoot?.querySelector('source[type="image/jpeg"]'),
      ).toBeInTheDocument();
      expect(
        el.shadowRoot?.querySelector('source[type="image/webp"]'),
      ).toBeInTheDocument();
      expect(
        el.shadowRoot?.querySelector('source[type="image/avif"]'),
      ).toBeInTheDocument();
    });

    test('it loads lazily by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'loading',
        'lazy',
      );
    });

    test('it decodes async', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'decoding',
        'async',
      );
    });

    test('it exposes img with part', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'part',
        'img',
      );
    });

    describe('HTML attributes', () => {
      test('it can optionally load eager', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            loading="eager"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'loading',
          'eager',
        );
      });

      test('it can optionally decode sync', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            decoding="sync"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'decoding',
          'sync',
        );
      });

      test('it can customize alt attribute', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            alt="some"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'alt',
          'some',
        );
      });

      test('it can customize fetchPriority attribute', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            fetchPriority="high"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'fetchPriority',
          'high',
        );
      });

      test('it can customize crossOrigin attribute', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            crossOrigin="use-credentials"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'crossOrigin',
          'use-credentials',
        );
      });

      test('it can customize referrerPolicy attribute', async () => {
        const el = await fixture<ResponsiveImage>(
          html`<responsive-image
            .src=${defaultImageData}
            referrerPolicy="no-referrer"
          ></responsive-image>`,
        );

        expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
          'referrerPolicy',
          'no-referrer',
        );
      });
    });
  });

  describe('events', () => {
    test('it redispatches load event', async () => {
      const imageData: ImageData = {
        imageTypes: ['jpeg', 'webp'],
        // to replicate the loading timing, we need to load a real existing image
        imageUrlFor: () => `/test-assets/test-image.jpg?${cacheBreaker()}`,
      };

      let triggeredEvent: Event | undefined;
      await fixture<ResponsiveImage>(
        html`<responsive-image
          .src=${imageData}
          @load=${(e: Event) => {
            triggeredEvent = e;
          }}
        ></responsive-image>`,
      );

      await waitUntil(() => triggeredEvent);
      expect(triggeredEvent).toBeInstanceOf(Event);
      expect(triggeredEvent?.type).toBe('load');
    });

    test('it redispatches error event', async () => {
      let triggeredEvent: Event | undefined;
      await fixture<ResponsiveImage>(
        html`<responsive-image
          .src=${defaultImageData}
          @error=${(e: Event) => {
            triggeredEvent = e;
          }}
        ></responsive-image>`,
      );

      await waitUntil(() => triggeredEvent);
      expect(triggeredEvent).toBeInstanceOf(ErrorEvent);
      expect(triggeredEvent?.type).toBe('error');
    });

    test('it exposes complete property', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.complete).toBe(false);

      await trigger(el);
      expect(el.complete).toBe(true);
    });
  });

  describe('responsive layout', () => {
    test('it has responsive layout by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveClass('ri-responsive');
      expect(el.shadowRoot?.querySelector('img')).not.toHaveClass('ri-fixed');
    });

    test('it renders width and height attributes when aspect ratio is known', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${imageData}></responsive-image>`,
      );
      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toHaveAttribute('width');
      expect(imgEl).toHaveAttribute('height');
      expect(
        parseInt(imgEl?.getAttribute('width') ?? '', 10) /
          parseInt(imgEl?.getAttribute('height') ?? '', 10),
      ).to.equal(2);
    });

    test('it renders the correct sourceset with width descriptors when availableWidths is available', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100, 640],
      };

      let el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${imageData}></responsive-image>`,
      );
      // png
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 50w, /provider/w100/image.avif 100w, /provider/w640/image.avif 640w',
      );

      const smallImageData: ImageData = {
        ...defaultImageData,
        availableWidths: [10, 25],
      };

      el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${smallImageData}></responsive-image>`,
      );

      // png
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.jpeg 10w, /provider/w25/image.jpeg 25w',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.webp 10w, /provider/w25/image.webp 25w',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.avif 10w, /provider/w25/image.avif 25w',
      );
    });

    test('it renders the sourceset based on deviceWidths when availableWidths is not available', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );

      const { deviceWidths } = env;

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.webp ${w}w`).join(', '),
      );

      // jpeg
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.jpeg ${w}w`).join(', '),
      );
    });

    // TODO: figure out why this is not working
    test.skip('it renders the fallback src next to needed display size', async () => {
      env.physicalWidth = 100;
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData}></responsive-image>`,
      );
      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });

    test('it renders a given size as sizes', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          size="40"
          .src=${defaultImageData}
        ></responsive-image>`,
      );
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute('sizes', '40vw');
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute('sizes', '40vw');
    });

    test('it renders with given sizes', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          sizes="(max-width: 767px) 100vw, 50vw"
          .src=${defaultImageData}
        ></responsive-image>`,
      );
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
    });
  });

  describe('fixed layout', () => {
    test('it has fixed layout when width or height is provided', async () => {
      let el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="100"
          .src=${defaultImageData}
        ></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveClass('ri-fixed');
      expect(el.shadowRoot?.querySelector('img')).not.toHaveClass(
        'ri-responsive',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image
          height="100"
          .src=${defaultImageData}
        ></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveClass('ri-fixed');
      expect(el.shadowRoot?.querySelector('img')).not.toHaveClass(
        'ri-responsive',
      );
    });

    test('it renders width and height when given', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="150"
          height="50"
          .src=${defaultImageData}
        ></responsive-image>`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '150');
      expect(imgEl).toHaveAttribute('height', '50');
    });

    test('it renders height when width is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="150"
          .src=${imageData}
        ></responsive-image>`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '150');
      expect(imgEl).toHaveAttribute('height', '75');
    });

    test('it renders width when height is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          height="100"
          .src=${imageData}
        ></responsive-image>`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '200');
      expect(imgEl).toHaveAttribute('height', '100');
    });

    test('it renders the correct sourceset with pixel densities', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100],
      };

      let el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="50"
          .src=${imageData}
        ></responsive-image>`,
      );

      // jpeg
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 1x, /provider/w100/image.webp 2x',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 1x, /provider/w100/image.avif 2x',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="10"
          .src=${defaultImageData}
        ></responsive-image>`,
      );
      // jpeg
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.jpeg 1x, /provider/w20/image.jpeg 2x',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.webp 1x, /provider/w20/image.webp 2x',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.avif 1x, /provider/w20/image.avif 2x',
      );
    });

    test('it renders the fallback src', async () => {
      let el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="320"
          .src=${defaultImageData}
        ></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w320/image.jpeg',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="100"
          .src=${defaultImageData}
        ></responsive-image>`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });
  });

  describe('LQIP', () => {
    test('it sets LQIP class', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          type: 'inline',
          class: 'lqip-inline-test-class',
        },
      };

      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${imageData}></responsive-image>`,
      );
      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toHaveClass('lqip-inline-test-class');

      await trigger(imgEl!);

      expect(imgEl).not.toHaveClass('lqip-inline-test-class');
    });

    test('it sets LQIP from blurhash as background', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          type: 'blurhash',
          hash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
          width: 4,
          height: 3,
        },
      };

      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${imageData}></responsive-image>`,
      );
      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).toBeDefined();
      expect(imgEl!.complete).toBe(false);

      await waitUntil(
        () => imgEl!.style.backgroundImage.startsWith('url'),
        undefined,
        { interval: 1, timeout: 5000 },
      );

      expect(imgEl!.style.backgroundImage, 'it has a background PNG').to.match(
        /data:image\/png/,
      );
      expect(imgEl).toHaveStyle({ backgroundSize: 'cover' });
      expect(imgEl!.style.backgroundImage).toMatchInlineSnapshot(
        `"url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAAAXNSR0IArs4c6QAAAbBJREFUOE890k9rHDEMh+FXtsf2bvKBG8gh0NJct7QlkEOgTSn0UEo+XGbG/6Qys5scfsinB8mS3P96MQdED4f3GNEpwRmCogZdoQxhVccyPEUd1Rzy+fnFnEAUuwBbvQCiCIaa0UyoO+BZ9Ay0Dfj449/eQRIjO+XglCxKlEHYAUWBbkIxz2qBomF/Nzxy9/TXHEZEyQwynWydKI3AgDdAPJWJsifutW/A7eOfHZhskEfjoJWklWgFbw1EMRG6m6guUVymStrTJSA3D7/NmTKNTh6V1FdyX5jGgreKyECdY/hEDQeqP57jEkMm5MO3nxegkVohtYXUXoljxuuKbB14Rw+ZFq6o4fqCZIZE5ObL0zsQeyG3mdRfmfpMsA0YmPeMN8BfU/wV1eV9LLk9PZozI2gjjULqC2ksRJ0JVJwMcH4fofkjxR1Z5UiRRNtGuDs9nIHt57WSrZBsJVEI26JEYfsDmaiSKWQWMiuRagH5dPq+b2FbWaSTqGSpJGlM0s+AOAaeZpHVIrNGFp32W5D701cTIMggbXGd7Npet2PyzgBhmKdqYNXAPCbm/Zw9/wGowBAcO1H/agAAAABJRU5ErkJggg==")"`,
      );

      await trigger(imgEl!);

      expect(
        window.getComputedStyle(imgEl!).backgroundImage,
        'after image is loaded the background PNG is removed',
      ).to.equal('none');
    });
  });
});
