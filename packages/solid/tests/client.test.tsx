import { env, type ImageData } from '@responsive-image/core';
import { cleanup, render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { isServer } from 'solid-js/web';
import { afterEach, describe, expect, test } from 'vitest';

import { ResponsiveImage } from '../src';
import { trigger } from './image.helper';

afterEach(cleanup);

describe('environment', () => {
  test('runs on client', () => {
    expect(typeof window).toBe('object');
    expect(isServer).toBe(false);
  });
});

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
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      expect(container.querySelector('picture')).toBeInTheDocument();
      expect(container.querySelectorAll('source')).to.have.length(3);
      expect(
        container.querySelector('source[type="image/jpeg"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('source[type="image/webp"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('source[type="image/avif"]'),
      ).toBeInTheDocument();
    });

    describe('HTML attributes', () => {
      test('it loads lazily by default', async () => {
        const { container } = render(() => (
          <ResponsiveImage src={defaultImageData} />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'loading',
          'lazy',
        );
      });

      test('it decodes async', async () => {
        const { container } = render(() => (
          <ResponsiveImage src={defaultImageData} />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'decoding',
          'async',
        );
      });

      test('it can optionally load eager', async () => {
        const { container } = render(() => (
          <ResponsiveImage src={defaultImageData} loading="eager" />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'loading',
          'eager',
        );
      });

      test('it can optionally decode sync', async () => {
        const { container } = render(() => (
          <ResponsiveImage src={defaultImageData} decoding="sync" />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'decoding',
          'sync',
        );
      });

      test('it renders arbitrary HTML attributes', async function () {
        const { container } = render(() => (
          <ResponsiveImage
            src={defaultImageData}
            alt="some"
            class="foo"
            role="button"
            data-test-image
          />
        ));

        expect(container.querySelector('img')).toHaveAttribute('alt', 'some');
        expect(container.querySelector('img')).toHaveClass('foo');
        expect(container.querySelector('img')).toHaveAttribute(
          'role',
          'button',
        );
        expect(container.querySelector('img')).toHaveAttribute(
          'data-test-image',
        );
      });
    });
  });

  describe('responsive layout', () => {
    test('it has responsive layout by default', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      const imgEl = container.querySelector('img');
      expect(imgEl).toHaveClass('ri-responsive');
      expect(imgEl).not.toHaveClass('ri-fixed');
    });

    test('it renders width and height attributes when aspect ratio is known', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img');

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

      let { container } = render(() => <ResponsiveImage src={imageData} />);
      // png
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 50w, /provider/w100/image.avif 100w, /provider/w640/image.avif 640w',
      );

      const smallImageData: ImageData = {
        ...defaultImageData,
        availableWidths: [10, 25],
      };

      container = render(() => (
        <ResponsiveImage src={smallImageData} />
      )).container;

      // png
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.jpeg 10w, /provider/w25/image.jpeg 25w',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.webp 10w, /provider/w25/image.webp 25w',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.avif 10w, /provider/w25/image.avif 25w',
      );
    });

    test('it renders the sourceset based on deviceWidths when availableWidths is not available', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      const { deviceWidths } = env;

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.webp ${w}w`).join(', '),
      );

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        deviceWidths.map((w) => `/provider/w${w}/image.jpeg ${w}w`).join(', '),
      );
    });

    // TODO: figure out why this is not working
    test.skip('it renders the fallback src next to needed display size', async () => {
      env.physicalWidth = 100;
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });

    test('it renders a given size as sizes', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} size={40} />
      ));

      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute('sizes', '40vw');
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute('sizes', '40vw');
    });

    test('it renders with given sizes', async () => {
      const { container } = render(() => (
        <ResponsiveImage
          src={defaultImageData}
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      ));

      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
    });

    test('it rerenders when src changes', async () => {
      const [imageData, setImageData] = createSignal<ImageData>({
        ...defaultImageData,
        availableWidths: [50, 100, 640],
      });

      const { container } = render(() => <ResponsiveImage src={imageData()} />);
      const imgEl = container.querySelector('img');

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 50w, /provider/w100/image.avif 100w, /provider/w640/image.avif 640w',
      );

      expect(imgEl).toHaveAttribute(
        'src',
        expect.stringMatching(/\/provider\/w\d+\/image\.jpeg/),
      );

      expect(
        parseInt(imgEl?.getAttribute('width') ?? '', 10) /
          parseInt(imgEl?.getAttribute('height') ?? '', 10),
      ).to.equal(2);

      setImageData({
        imageTypes: ['webp', 'avif'],
        imageUrlFor(width, type = 'webp') {
          return `/other/w${width}/image.${type}`;
        },
        aspectRatio: 1,
        availableWidths: [200, 400],
      });

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toBeNull();

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/other/w200/image.webp 200w, /other/w400/image.webp 400w',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/other/w200/image.avif 200w, /other/w400/image.avif 400w',
      );

      expect(imgEl).toHaveAttribute(
        'src',
        expect.stringMatching(/\/other\/w\d+\/image\.webp/),
      );

      expect(
        parseInt(imgEl?.getAttribute('width') ?? '', 10) /
          parseInt(imgEl?.getAttribute('height') ?? '', 10),
      ).to.equal(1);
    });
  });

  describe('fixed layout', () => {
    test('it has fixed layout when width is provided', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} width={100} />
      ));

      expect(container.querySelector('img')).toHaveClass('ri-fixed');
      expect(container.querySelector('img')).not.toHaveClass('ri-responsive');
    });

    test('it has fixed layout when height is provided', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} height={100} />
      ));

      expect(container.querySelector('img')).toHaveClass('ri-fixed');
      expect(container.querySelector('img')).not.toHaveClass('ri-responsive');
    });

    test('it renders width and height when given', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} width={150} height={50} />
      ));

      const imgEl = container.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '150');
      expect(imgEl).toHaveAttribute('height', '50');
    });

    test('it renders height when width is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const { container } = render(() => (
        <ResponsiveImage src={imageData} width={150} />
      ));

      const imgEl = container.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '150');
      expect(imgEl).toHaveAttribute('height', '75');
    });

    test('it renders width when height is given according to aspect ratio', async () => {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      const { container } = render(() => (
        <ResponsiveImage src={imageData} height={100} />
      ));

      const imgEl = container.querySelector('img');

      expect(imgEl).toHaveAttribute('width', '200');
      expect(imgEl).toHaveAttribute('height', '100');
    });

    test('it renders the correct sourceset with pixel densities', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100],
      };

      let { container } = render(() => (
        <ResponsiveImage src={imageData} width={50} />
      ));

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 1x, /provider/w100/image.webp 2x',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 1x, /provider/w100/image.avif 2x',
      );

      container = render(() => (
        <ResponsiveImage src={defaultImageData} width={10} />
      )).container;

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.jpeg 1x, /provider/w20/image.jpeg 2x',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.webp 1x, /provider/w20/image.webp 2x',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w10/image.avif 1x, /provider/w20/image.avif 2x',
      );
    });

    test('it renders the fallback src', async () => {
      let { container } = render(() => (
        <ResponsiveImage src={defaultImageData} width={320} />
      ));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w320/image.jpeg',
      );

      container = render(() => (
        <ResponsiveImage src={defaultImageData} width={100} />
      )).container;

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w100/image.jpeg',
      );
    });

    test('it rerenders when props change', async () => {
      const [imageData, setImageData] = createSignal<ImageData>({
        ...defaultImageData,
        availableWidths: [50, 100],
      });
      const [width, setWidth] = createSignal(50);

      const { container } = render(() => (
        <ResponsiveImage src={imageData()} width={width()} />
      ));
      const imgEl = container.querySelector('img');

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x',
      );

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp 1x, /provider/w100/image.webp 2x',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/provider/w50/image.avif 1x, /provider/w100/image.avif 2x',
      );

      expect(imgEl).toHaveAttribute(
        'src',
        expect.stringMatching(/\/provider\/w\d+\/image\.jpeg/),
      );

      expect(imgEl).toHaveAttribute('width', '50');
      expect(imgEl).toHaveAttribute('height', '25');

      setImageData({
        imageTypes: ['webp', 'avif'],
        imageUrlFor(width, type = 'webp') {
          return `/other/w${width}/image.${type}`;
        },
        aspectRatio: 1,
        availableWidths: [200, 400],
      });
      setWidth(200);

      // jpeg
      expect(
        container.querySelector('picture source[type="image/jpeg"]'),
      ).toBeNull();

      // webp
      expect(
        container.querySelector('picture source[type="image/webp"]'),
      ).toHaveAttribute(
        'srcset',
        '/other/w200/image.webp 1x, /other/w400/image.webp 2x',
      );

      // avif
      expect(
        container.querySelector('picture source[type="image/avif"]'),
      ).toHaveAttribute(
        'srcset',
        '/other/w200/image.avif 1x, /other/w400/image.avif 2x',
      );

      expect(imgEl).toHaveAttribute(
        'src',
        expect.stringMatching(/\/other\/w\d+\/image\.webp/),
      );

      expect(imgEl).toHaveAttribute('width', '200');
      expect(imgEl).toHaveAttribute('height', '200');
    });
  });

  describe('LQIP', () => {
    test('it sets LQIP class from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: 'lqip-color-test-class',
        },
      };

      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      await trigger(imgEl);

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    test('it sets LQIP class from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: () => 'lqip-color-test-class',
        },
      };

      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      await trigger(imgEl);

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    test('it sets LQIP background image from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          bgImage: 'test.png',
        },
      };

      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'url("test.png")',
      });

      await trigger(imgEl);

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'none',
      });
    });

    test('it sets LQIP background image from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          bgImage: () => 'test.png',
        },
      };

      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'url("test.png")',
      });

      await trigger(imgEl);

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'none',
      });
    });

    test('it sets LQIP attribute from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          attribute: 'test-attr',
        },
      };

      const { container } = render(() => <ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toHaveAttribute('data-ri-lqip', 'test-attr');
    });
  });
});
