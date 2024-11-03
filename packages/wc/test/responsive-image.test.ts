import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { env, type ImageData } from '@responsive-image/core';

import type { ResponsiveImage } from '../src/responsive-image.js';
import '../src/responsive-image.js';
import { imageLoaded } from './image-loaded.helper.js';

const cacheBreaker = () => `${new Date().getTime()}#${Math.random()}`;

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
  };

  describe('basics', () => {
    it('it renders a source for every format', async () => {
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

    it('it loads lazily by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'loading',
        'lazy',
      );
    });

    it('it can optionally load eager', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} loading="eager" />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'loading',
        'eager',
      );
    });

    it('it decodes async', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'decoding',
        'async',
      );
    });

    it('it can customize alt attribute', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} alt="some" />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'alt',
        'some',
      );
    });
  });

  describe('responsive layout', () => {
    it('it has responsive layout by default', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.class(
        'ri-responsive',
      );
      expect(el.shadowRoot?.querySelector('img')).to.not.have.class('ri-fixed');
    });

    it('it renders width and height attributes when aspect ratio is known', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${imageData} />`,
      );
      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).to.have.attribute('width');
      expect(imgEl).to.have.attribute('height');
      expect(
        parseInt(imgEl?.getAttribute('width') ?? '', 10) /
          parseInt(imgEl?.getAttribute('height') ?? '', 10),
      ).to.equal(2);
    });

    it('it renders the correct sourceset with width descriptors when availableWidths is available', async () => {
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
      ).to.have.attribute(
        'srcset',
        '/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).to.have.attribute(
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
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.jpeg 10w, /provider/w25/image.jpeg 25w',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.webp 10w, /provider/w25/image.webp 25w',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.avif 10w, /provider/w25/image.avif 25w',
      );
    });

    it('it renders the sourceset based on deviceWidths when availableWidths is not available', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );

      const { deviceWidths } = env;

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.webp ${w}w`).join(', '),
      );

      // jpeg
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).to.have.attribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.jpeg ${w}w`).join(', '),
      );
    });

    // TODO: figure out why this is not working
    it.skip('it renders the fallback src next to needed display size', async () => {
      env.physicalWidth = 100;
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image .src=${defaultImageData} />`,
      );
      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });

    it('it renders a given size as sizes', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image size="40" .src=${defaultImageData} />`,
      );
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).to.have.attribute('sizes', '40vw');
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute('sizes', '40vw');
    });

    it('it renders with given sizes', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          sizes="(max-width: 767px) 100vw, 50vw"
          .src=${defaultImageData}
        />`,
      );
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).to.have.attribute('sizes', '(max-width: 767px) 100vw, 50vw');
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute('sizes', '(max-width: 767px) 100vw, 50vw');
    });
  });

  describe('fixed layout', () => {
    it('it has fixed layout when width or height is provided', async () => {
      let el = await fixture<ResponsiveImage>(
        html`<responsive-image width="100" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.class('ri-fixed');
      expect(el.shadowRoot?.querySelector('img')).to.not.have.class(
        'ri-responsive',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image height="100" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.class('ri-fixed');
      expect(el.shadowRoot?.querySelector('img')).to.not.have.class(
        'ri-responsive',
      );
    });

    it('it renders width and height when given', async () => {
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image
          width="150"
          height="50"
          .src=${defaultImageData}
        />`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).to.have.attribute('width', '150');
      expect(imgEl).to.have.attribute('height', '50');
    });

    it('it renders height when width is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image width="150" .src=${imageData} />`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).to.have.attribute('width', '150');
      expect(imgEl).to.have.attribute('height', '75');
    });

    it('it renders width when height is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const el = await fixture<ResponsiveImage>(
        html`<responsive-image height="100" .src=${imageData} />`,
      );

      const imgEl = el.shadowRoot?.querySelector('img');

      expect(imgEl).to.have.attribute('width', '200');
      expect(imgEl).to.have.attribute('height', '100');
    });

    it('it renders the correct sourceset with pixel densities', async () => {
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
      ).to.have.attribute(
        'srcset',
        '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w50/image.webp 1x, /provider/w100/image.webp 2x',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w50/image.avif 1x, /provider/w100/image.avif 2x',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image width="10" .src=${defaultImageData} />`,
      );
      // jpeg
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/jpeg"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.jpeg 1x, /provider/w20/image.jpeg 2x',
      );

      // webp
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/webp"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.webp 1x, /provider/w20/image.webp 2x',
      );

      // avif
      expect(
        el.shadowRoot?.querySelector('picture source[type="image/avif"]'),
      ).to.have.attribute(
        'srcset',
        '/provider/w10/image.avif 1x, /provider/w20/image.avif 2x',
      );
    });

    it('it renders the fallback src', async () => {
      let el = await fixture<ResponsiveImage>(
        html`<responsive-image width="320" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'src',
        '/provider/w320/image.jpeg',
      );

      el = await fixture<ResponsiveImage>(
        html`<responsive-image width="100" .src=${defaultImageData} />`,
      );

      expect(el.shadowRoot?.querySelector('img')).to.have.attribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });
  });

  describe('LQIP', () => {
    describe('inline', () => {
      it('it sets LQIP SVG as background', async () => {
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
          expect(imgEl).to.have.class('lqip-inline-test-class');
        }

        await loaded;

        expect(imgEl).to.not.have.class('lqip-inline-test-class');
      });
    });

    describe('color', () => {
      it('it sets background-color', async () => {
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
          expect(imgEl).to.have.class('lqip-color-test-class');
        }

        await loaded;

        expect(imgEl).to.not.have.class('lqip-color-test-class');
      });
    });

    describe.skip('blurhash', () => {
      it('it sets LQIP from blurhash as background', async () => {
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
          expect(imgEl).to.have.style('background-size', 'cover');
          expect(
            window.getComputedStyle(imgEl!).backgroundImage,
            'the background SVG has a reasonable length',
          ).to.have.length.greaterThan(100);
        }

        await loaded;

        expect(
          window.getComputedStyle(imgEl!).backgroundImage,
          'after image is loaded the background PNG is removed',
        ).to.be('none');
      });
    });
  });
});
