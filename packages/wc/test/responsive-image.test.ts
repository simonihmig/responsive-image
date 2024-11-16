import { describe, expect, test, afterEach } from 'vitest';
import { html } from 'lit';
import { fixture, fixtureCleanup } from '@open-wc/testing-helpers';
import { env, type ImageData } from '@responsive-image/core';

import type { ResponsiveImage } from '../src/responsive-image.js';
import '../src/responsive-image.js';
import { imageLoaded } from './image-loaded.helper.js';

const cacheBreaker = () => `${new Date().getTime()}#${Math.random()}`;

afterEach(() => fixtureCleanup());

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
  };

  describe('basics', () => {
    test('it renders a source for every format', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('picture')).to.exist;
      expect(el.shadowRoot?.querySelectorAll('source')).to.have.length(3);
      expect(el.shadowRoot?.querySelector('source[type="image/jpeg"]')).to
        .exist;
      expect(el.shadowRoot?.querySelector('source[type="image/webp"]')).to
        .exist;
      expect(el.shadowRoot?.querySelector('source[type="image/avif"]')).to
        .exist;
    });

    test('it loads lazily by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'loading',
        'lazy',
      );
    });

    test('it can optionally load eager', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} loading="eager" />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'loading',
        'eager',
      );
    });

    test('it decodes async', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'decoding',
        'async',
      );
    });

    test('it can customize alt attribute', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} alt="some" />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'alt',
        'some',
      );
    });

    test('it exposes img with part', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'part',
        'img',
      );
    });
  });

  describe('responsive layout', () => {
    test('it has responsive layout by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
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
        html`<responsive-image .src=${imageData} />`,
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
        html`<responsive-image .src=${imageData} />`,
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
        html`<responsive-image .src=${smallImageData} />`,
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
        html`<responsive-image .src=${defaultImageData} />`,
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
        html`<responsive-image .src=${defaultImageData} />`,
      );
      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });

    test('it renders a given size as sizes', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image size="40" .src=${defaultImageData} />`,
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
        />`,
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
        html`<responsive-image width="100" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveClass('ri-fixed');
      expect(el.shadowRoot?.querySelector('img')).not.toHaveClass(
        'ri-responsive',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image height="100" .src=${defaultImageData} />`,
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
        />`,
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
        html`<responsive-image width="150" .src=${imageData} />`,
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
        html`<responsive-image height="100" .src=${imageData} />`,
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
        html`<responsive-image width="50" .src=${imageData} />`,
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
        html`<responsive-image width="10" .src=${defaultImageData} />`,
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
        html`<responsive-image width="320" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w320/image.jpeg',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image width="100" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });
  });

  describe('LQIP', () => {
    describe('inline', () => {
      test('it sets LQIP SVG as background', async () => {
        const { onload, loaded } = imageLoaded();
        const imageData: ImageData = {
          imageTypes: ['jpeg', 'webp'],
          // to replicate the loading timing, we need to load a real existing image
          imageUrlFor: () => `/test-assets/test-image.jpg?${cacheBreaker()}`,
          lqip: {
            type: 'inline',
            class: 'lqip-inline-test-class',
          },
        };

        const el = await fixture<ResponsiveImage>(
          html`<responsive-image .src=${imageData} />`,
        );
        onload(el);

        const imgEl = el.shadowRoot?.querySelector('img');

        if (!imgEl?.complete) {
          expect(imgEl).toHaveClass('lqip-inline-test-class');
        }

        await loaded;

        expect(imgEl).not.toHaveClass('lqip-inline-test-class');
      });
    });

    describe('color', () => {
      test('it sets background-color', async () => {
        const { onload, loaded } = imageLoaded();
        const imageData: ImageData = {
          imageTypes: ['jpeg', 'webp'],
          // to replicate the loading timing, we need to load a real existing image
          imageUrlFor: () => `/test-assets/test-image.jpg?${cacheBreaker()}`,
          lqip: {
            type: 'color',
            class: 'lqip-color-test-class',
          },
        };

        const el = await fixture<ResponsiveImage>(
          html`<responsive-image .src=${imageData} />`,
        );
        onload(el);

        const imgEl = el.shadowRoot?.querySelector('img');

        if (!imgEl?.complete) {
          expect(imgEl).toHaveClass('lqip-color-test-class');
        }

        await loaded;

        expect(imgEl).not.toHaveClass('lqip-color-test-class');
      });
    });

    describe('blurhash', () => {
      test('it sets LQIP from blurhash as background', async () => {
        const { onload, loaded } = imageLoaded();
        const imageData: ImageData = {
          imageTypes: ['jpeg', 'webp'],
          // to replicate the loading timing, we need to load a real existing image
          imageUrlFor: () => `/test-assets/test-image.jpg?${cacheBreaker()}`,
          lqip: {
            type: 'blurhash',
            hash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
            width: 4,
            height: 3,
          },
        };

        const el = await fixture<ResponsiveImage>(
          html`<responsive-image .src=${imageData} />`,
        );
        onload(el);

        const imgEl = el.shadowRoot?.querySelector('img');

        if (!imgEl?.complete) {
          expect(
            imgEl?.style.backgroundImage,
            'it has a background PNG',
          ).to.match(/data:image\/png/);
          expect(imgEl).toHaveStyle({ backgroundSize: 'cover' });
          expect(
            window.getComputedStyle(imgEl!).backgroundImage,
            'the background SVG has a reasonable length',
          ).to.have.length.greaterThan(100);
        }

        await loaded;

        expect(
          window.getComputedStyle(imgEl!).backgroundImage,
          'after image is loaded the background PNG is removed',
        ).to.equal('none');
      });
    });
  });
});
