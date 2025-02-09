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

    test('it sets LQIP from thumbhash as background', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          type: 'thumbhash',
          hash: 'jJcFFYI1fIWHe4dweXlYeUaAmWj3',
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
        `"url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAXCAYAAABqBU3hAAAMEElEQVR4AQCBAH7/AAAkN/8AJDf/ACU3/wAlNv8AJjX/ACYz/wAmMf8AJS//ACUs/wAlKv8AJSj/ACUn/wAnJ/8AKij/AS4r/wYzL/8LODT/Dz05/xJAPf8UQj//FEFA/xE/P/8NOzz/CTY5/wQyNv8ALTT/ACsy/wApM/8AKTT/ACo1/wArN/8ALDj/AIEAfv8AACY4/wAmOP8AJjj/ACc3/wAnNv8AJzT/ACcy/wAnMP8AJi3/ACYq/wAlKP8AJif/ACcn/wAqKP8ALiv/BTMv/wo4NP8PPTn/EkA8/xRCP/8UQkD/EUA//w48Pf8JNzr/BDM3/wAvNP8ALDP/ACoz/wAqNP8AKzb/ACw3/wAtOP8AgQB+/wAAKDr/ACk6/wApOv8AKjn/ACo4/wAqNv8AKjT/ACkx/wAoLv8AJyv/ACcp/wAnJ/8AKCf/ACso/wAvK/8ENC//CTk0/w4+OP8SQT3/FEM//xRDQP8SQUD/Dj4+/wo5O/8FNTj/ATE2/wAuNP8ALTT/ACw1/wAtN/8ALjn/AC45/wCBAH7/AAAsPf8ALT3/AC09/wAuPP8ALjv/AC45/wAuN/8ALTT/ACwx/wArLf8AKir/ACko/wAqJ/8ALSj/ADAr/wQ1L/8JOjT/Dj85/xJDPf8URkD/FUZC/xNFQv8QQUD/Cz09/wc4Ov8DNDj/ADI3/wAwN/8AMDf/ADA5/wAxOv8AMTv/AIEAfv8AATFB/wEyQf8BMkD/AjNA/wIzP/8CND3/AjM7/wAyOP8AMTT/AC8w/wAuLf8ALSr/AC4p/wAwKv8AMyz/BDgw/wk9Nf8PQjr/E0c//xZKQ/8WSkT/FUlF/xJGQ/8OQkD/Cj4+/wY6O/8DNzr/ATU6/wA0Ov8BNDv/ATU9/wI1Pf8AgQB+/wAEN0T/BDdE/wU4RP8FOUT/BjpD/wY6Qv8FOT//BDg8/wI3OP8ANTT/ADMw/wAyLv8AMiz/ADQs/wE3Lv8GPDL/C0I4/xFHPf8WTEL/GU9G/xpQSP8ZT0n/Fk1I/xJJRf8OREL/CkBA/wY9Pv8EOz3/BDo+/wQ6P/8EOkD/BDtA/wCBAH7/AAc9SP8HPUj/CD5I/wk/SP8KQEj/CkFH/wpBRP8JQEH/Bz49/wU8Of8COjX/ATky/wE4MP8COjD/BT0y/wpCNv8PSDz/FU5B/xpTR/8dVkv/H1hO/x5XTv8cVU3/GFFL/xNMSP8PSEX/C0RD/wlCQv8HQEL/B0BC/wdAQ/8HQET/AIEAfv8ACkJL/wtDS/8MREz/DUVM/w5HTP8PR0v/D0hJ/w5HRv8MRUP/CkM+/wdBOv8GQDf/BUA1/wdBNf8KRTf/D0o7/xRPQf8aVkf/IFtN/yNfUf8lYVT/JWBV/yJdU/8eWVH/GVRN/xRPSv8QS0j/DUhG/wtHRv8KRkb/CkZG/wpGR/8AgQB+/wAMRk3/DUdN/w5ITv8QSk//EkxP/xNOT/8TTk3/E05L/xFMR/8PS0P/DUk//wxIPP8LRzr/DUk6/xBNPf8VUkH/G1hH/yFeTf8mZFP/KmhY/yxqWv8raVv/KGZZ/yRhVv8eXFP/GVdP/xRSTP8RTkn/D0xI/w1LSP8NSkj/DUpI/wCBAH7/AA1JTf8OSk7/EEtP/xJOUP8UUFH/FlJR/xdTUP8XU07/FlNL/xRRR/8SUEP/EU9A/xFPP/8TUT//FlRC/xtaRv8iYEz/KGdT/y1sWf8xcF3/M3Jg/zJxYP8ubl7/KWhb/yNiVv8dXFL/GFdO/xRTS/8RUEn/D05J/w9OSf8OTUn/AIEAfv8ADUlL/w5KTP8QTU3/E09P/xZSUP8YVVH/GVZR/xpXT/8ZV03/GFZJ/xdVRv8WVET/FlVC/xhXQ/8cW0b/IWFL/yhnUf8ublf/NHNd/zd3Yf85eGT/N3dj/zNzYf8tbV3/JmZX/yBgUv8aWk7/FVVK/xJSSP8QT0f/Dk5G/w5ORv8AgQB+/wAMSEf/DUlI/w9LSv8ST0z/FVJO/xhVT/8aV0//G1hO/xtZTP8bWEn/GlhH/xlYRf8aWUT/HVtF/yFgSP8mZk3/LWxT/zNzWv85eF//PHxj/z19Zf86emT/NnZh/y9vXP8oaFb/IGBQ/xlaS/8UVEf/EFBE/w5OQ/8NTUL/DExC/wCBAH7/AAlEQv8KRkP/DUhE/xBMR/8UUEn/F1NK/xpWS/8bV0v/HFhJ/xtYR/8bWEX/G1lD/x1aQ/8fXkT/JGJI/ypoTf8wb1P/NnVa/zt7X/8+fmP/Pn5k/zx7Yv82dl7/L25Y/ydmUf8eXkv/F1dF/xJRQf8NTT7/C0o8/wpJO/8JSDv/AIEAfv8ABkA7/wdBPP8KRD7/DUhA/xFLQv8VT0T/F1JF/xlURf8aVUT/GlZC/xtWQP8bVz//HVlA/yBdQf8lYkX/K2hL/zJvUf84dVf/PHpc/z99X/8+fGD/O3ld/zVzWP8ta1L/JGJL/xtZRP8UUj7/Dkw5/wpINv8HRTT/BkQz/wVDM/8AgQB+/wADOzP/BDw0/wc/Nv8KQjn/DkY7/xFKPf8UTT7/Fk8+/xdRPf8YUjz/GVI6/xpUOv8cVjr/H1o8/yVgQf8rZkb/MW1M/zdzUv88d1f/Pnpa/zx5Wf84dVb/Mm5R/yllSv8gXEL/F1M7/w9MNf8KRjD/BUIt/wM/LP8CPiv/AT4r/wCBAH7/AAA1LP8CNy3/BDkv/wc9Mf8LQDP/DkQ1/xFHNv8TSTb/FEs1/xVMNP8WTTP/F08y/xpRM/8dVjb/I1s6/yliQP8waUb/Nm9M/zpzUP87dVP/OnNS/zVvTv8uaEn/JV9B/xxWOv8TTTL/DEUs/wZAKP8CPCX/ADok/wA5JP8AOST/AIEAfv8AADEm/wAyJ/8CNSn/BTgr/wg7LP8LPi7/DkEu/w9DLv8RRC3/EUUs/xJHK/8USSv/F0ws/xtQL/8gVjP/J105/y5kP/8zakX/N25J/zhvS/82bUr/MmlG/yphQP8hWTn/GE8x/xBHKv8JQCX/BDsh/wA4H/8ANh7/ADUe/wA1Hv8AgQB+/wAALiL/AC8i/wIxJP8ENCX/BzYm/wk5J/8LOyf/DT0n/w0+Jf8OPyT/D0Aj/xFDI/8URiT/GEsn/x5RLP8lWDL/K144/zFkPv81aEL/NmpE/zRoQ/8vYz//J1s5/x9TMv8WSir/DkIk/wc8H/8DNxz/ATUa/wA0Gv8ANBv/ADQb/wCBAH7/AAAsHv8ALR//Ai4g/wQxIf8GMyL/CDUi/wo3If8KOCD/Czkf/ws6Hf8MOxz/Dj0c/xFAHf8WRSH/HEwm/yJTLP8pWjL/L2A4/zNjPP80ZT3/MmM8/y1eOP8mVzP/HU8s/xVGJf8OPx//CDkb/wQ2Gf8DNBj/AzQZ/wM0Gv8DNRv/AIEAfv8AASsd/wIsHf8DLR7/BS8e/wcxHv8IMh7/CTMd/wk0G/8JNRn/CTUX/wo2Fv8MOBb/DzwY/xRBG/8aRyD/IU4m/yhWLf8uXDP/MWA3/zJhOP8wXzf/LFo0/yVTLv8dTCj/FUQh/w49HP8KORn/BzYY/wY1GP8HNhn/CDcb/wg3HP8AgQB+/wAEKxz/BCwc/wUtHP8GLhz/By8c/wgwG/8JMRr/CTEY/wgxFf8IMhP/CTMS/ws1Ev8OOBP/Ez0X/xlEHP8gSyL/J1Ip/y1ZL/8xXTP/Ml41/zBcNP8rWDD/JVEr/x1KJf8WQx//ED0b/ww5GP8KNxj/CjcZ/ws4G/8NOR3/Djoe/wCBAH7/AAUrHP8GLBz/By0c/wguHP8ILxv/CS8a/wkwGP8IMBb/CC8T/wgwEf8IMA//CjIP/w02Ef8SOxT/GEIZ/x9JIP8mUSb/LFcs/zBbMf8xXDL/MFsy/ytWLv8lUCn/Hkkk/xdDHv8SPRv/DjoZ/w04Gf8OORr/Dzod/xE8H/8SPSD/AYEAfv8ABywc/wcsHP8ILRz/CC4b/wkvG/8JLxn/CS8X/wgvFP8ILxL/By4P/wgvDv8JMQ7/DTUP/xI6E/8YQRj/H0ge/yZQJf8sViv/MFov/zFbMf8wWjH/LFYt/yVQKf8fSSP/GEMe/xM9Gv8QOhn/DzkZ/xA6G/8RPB7/Ez4g/xQ/Iv92bn1aabfuwgAAAABJRU5ErkJggg==")"`,
      );

      await trigger(imgEl!);

      expect(
        window.getComputedStyle(imgEl!).backgroundImage,
        'after image is loaded the background PNG is removed',
      ).to.equal('none');
    });
  });
});
