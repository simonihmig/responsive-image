import { env, type ImageData } from '@responsive-image/core';
import { hydrate, isServer, render, type JSX } from '@solidjs/web';
import { createSignal, isHydrating } from 'solid-js';
import { afterEach, describe, expect, test } from 'vitest';

import { ResponsiveImage } from '@responsive-image/solid';

import {
  FIXTURE_IMAGE,
  HYDRATION_BOOTSTRAP,
  LQIP_IMAGE_DATA,
  LQIP_SSR_MARKUP,
} from './ssr-fixture';

// Solid 2 updates the DOM asynchronously after a signal write, so tests must
// yield a tick for the reactive flush to be applied before asserting.
//
// It is deliberately NOT used before the first assertions of the LQIP tests:
// the fixture URLs do not resolve, and a tick is long enough for the browser
// to fail the request, flip `img.complete` to `true` and let the component's
// cache-hit path drop LQIP — which would make those tests assert the opposite
// of what they are about.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * The Solid 2 counterpart of `@solidjs/testing-library`'s `render`, which the
 * Solid 1.x suite uses: same `{ container }` shape, so the mirrored cases read
 * the same, but backed by `@solidjs/web` (the Solid 1.x testing library does
 * not work against the Solid 2 runtime).
 */
const mounted: Array<() => void> = [];

function renderInto(ui: () => JSX.Element): { container: HTMLElement } {
  const container = document.createElement('div');
  document.body.appendChild(container);
  mounted.push(render(ui, container));
  return { container };
}

afterEach(() => {
  for (const dispose of mounted.splice(0)) dispose();
  for (const node of document.body.children) node.remove();
});

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
      const { container } = renderInto(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      expect(container.querySelector('picture')).toBeInTheDocument();
      expect(container.querySelectorAll('source')).toHaveLength(3);
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

    test('can add a custom class without losing internal classes', async () => {
      const { container } = renderInto(() => (
        <ResponsiveImage class="custom-class" src={defaultImageData} />
      ));
      const imgEl = container.querySelector('img');
      expect(imgEl).toHaveClass('ri-img');
      expect(imgEl).toHaveClass('custom-class');
    });

    describe('HTML attributes', () => {
      test('it loads lazily by default', async () => {
        const { container } = renderInto(() => (
          <ResponsiveImage src={defaultImageData} />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'loading',
          'lazy',
        );
      });

      test('it decodes async', async () => {
        const { container } = renderInto(() => (
          <ResponsiveImage src={defaultImageData} />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'decoding',
          'async',
        );
      });

      test('it can optionally load eager', async () => {
        const { container } = renderInto(() => (
          <ResponsiveImage src={defaultImageData} loading="eager" />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'loading',
          'eager',
        );
      });

      test('it can optionally decode sync', async () => {
        const { container } = renderInto(() => (
          <ResponsiveImage src={defaultImageData} decoding="sync" />
        ));

        expect(container.querySelector('img')).toHaveAttribute(
          'decoding',
          'sync',
        );
      });

      test('it renders arbitrary HTML attributes', async function () {
        const { container } = renderInto(() => (
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
      const { container } = renderInto(() => (
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
      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img');

      expect(imgEl).toHaveAttribute('width');
      expect(imgEl).toHaveAttribute('height');
      expect(
        parseInt(imgEl?.getAttribute('width') ?? '', 10) /
          parseInt(imgEl?.getAttribute('height') ?? '', 10),
      ).toBe(2);
    });

    test('it renders the correct sourceset with width descriptors when availableWidths is available', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100, 640],
      };

      let { container } = renderInto(() => <ResponsiveImage src={imageData} />);
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

      container = renderInto(() => (
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
      const { container } = renderInto(() => (
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

    test('it renders the fallback src', async () => {
      const { container } = renderInto(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w3840/image.jpeg',
      );
    });

    test('it renders a given size as sizes', async () => {
      const { container } = renderInto(() => (
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
      const { container } = renderInto(() => (
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

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData()} />
      ));
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
      ).toBe(2);

      setImageData({
        imageTypes: ['webp', 'avif'],
        imageUrlFor(width, type = 'webp') {
          return `/other/w${width}/image.${type}`;
        },
        aspectRatio: 1,
        availableWidths: [200, 400],
      });
      await flush();

      const imgEl2 = container.querySelector('img')!;

      expect(
        imgEl2,
        'when changing src (without LQIP), the img element stays the same',
      ).toBe(imgEl);

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
      ).toBe(1);
    });
  });

  describe('fixed layout', () => {
    test('it has fixed layout when width is provided', async () => {
      const { container } = renderInto(() => (
        <ResponsiveImage src={defaultImageData} width={100} />
      ));

      expect(container.querySelector('img')).toHaveClass('ri-fixed');
      expect(container.querySelector('img')).not.toHaveClass('ri-responsive');
    });

    test('it has fixed layout when height is provided', async () => {
      const { container } = renderInto(() => (
        <ResponsiveImage src={defaultImageData} height={100} />
      ));

      expect(container.querySelector('img')).toHaveClass('ri-fixed');
      expect(container.querySelector('img')).not.toHaveClass('ri-responsive');
    });

    test('it renders width and height when given', async () => {
      const { container } = renderInto(() => (
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
      const { container } = renderInto(() => (
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
      const { container } = renderInto(() => (
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

      let { container } = renderInto(() => (
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

      container = renderInto(() => (
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
      let { container } = renderInto(() => (
        <ResponsiveImage src={defaultImageData} width={320} />
      ));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/provider/w320/image.jpeg',
      );

      container = renderInto(() => (
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

      const { container } = renderInto(() => (
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
      await flush();

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

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      trigger(imgEl);
      await flush();

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    test('it sets LQIP class from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: () => 'lqip-color-test-class',
        },
      };

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      trigger(imgEl);
      await flush();

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    test('it sets inline styles from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          inlineStyles: {
            'border-left': 'solid 5px red',
          },
        },
      };

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);

      // Asserted on the inline style, not via `toHaveStyle`: that matcher
      // normalises the expected declaration through CSSOM and compares it to
      // `getComputedStyle`, so the shorthand never matches
      // (`5px solid red` vs computed `5px solid rgb(255, 0, 0)`).
      expect(imgEl.style.borderLeft).toBe('5px solid red');
      trigger(imgEl);
      await flush();

      expect(imgEl.style.borderLeft).toBe('');
    });

    test('it sets inline styles from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          inlineStyles: () => ({ 'border-left': 'solid 5px red' }),
        },
      };

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl.style.borderLeft).toBe('5px solid red');

      trigger(imgEl);
      await flush();

      expect(imgEl.style.borderLeft).toBe('');
    });

    test('it sets LQIP attribute from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          attribute: 'test-attr',
        },
      };

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toHaveAttribute('data-ri-lqip', 'test-attr');

      trigger(imgEl);
      await flush();

      expect(imgEl).toHaveAttribute('data-ri-lqip', 'test-attr');
    });

    test('it reapplies LQIP after src changes', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: 'lqip-test-class',
          inlineStyles: {
            'border-left': 'solid 5px red',
          },
          attribute: 'test-attr',
        },
      };

      const [image, setImage] = createSignal(imageData);

      const { container } = renderInto(() => <ResponsiveImage src={image()} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toHaveClass('lqip-test-class');
      expect(imgEl.style.borderLeft).toBe('5px solid red');
      expect(imgEl).toHaveAttribute('data-ri-lqip', 'test-attr');

      trigger(imgEl);
      await flush();

      expect(imgEl).not.toHaveClass('lqip-test-class');

      const otherImage = {
        ...defaultImageData,
        lqip: {
          class: 'other-lqip-test-class',
          inlineStyles: {
            'border-left': 'solid 5px blue',
          },
          attribute: 'other-attr',
        },
      };

      setImage(otherImage);
      await flush();

      const imgEl2 = container.querySelector('img')!;

      expect(
        imgEl2,
        'when changing src, the img element must be recreated to show LQIP styles',
      ).not.toBe(imgEl);

      expect(imgEl2).toHaveClass('other-lqip-test-class');
      expect(imgEl2.style.borderLeft).toBe('5px solid blue');
      expect(imgEl2).toHaveAttribute('data-ri-lqip', 'other-attr');

      trigger(imgEl2);
      await flush();

      expect(imgEl2).not.toHaveClass('other-lqip-test-class');
      expect(imgEl2.style.borderLeft).toBe('');
    });

    test('it does not apply LQIP when image is already loaded', async () => {
      const imageData: ImageData = {
        imageTypes: ['jpeg', 'webp', 'avif'],
        imageUrlFor() {
          return FIXTURE_IMAGE;
        },
        lqip: {
          class: 'lqip-test-class',
        },
      };

      // Resolve the image once so the browser has it decoded and cached.
      await loadImage(FIXTURE_IMAGE);

      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      await flush();
      expect(imgEl.complete).toBe(true);
      expect(imgEl).not.toHaveClass('lqip-test-class');
    });
  });

  describe('auto format', () => {
    const imageData: ImageData = {
      imageTypes: 'auto',
      imageUrlFor(width, type = 'jpeg') {
        return `/provider/w${width}/image.webp?format=${type}`;
      },
      availableWidths: [50, 100, 640],
      aspectRatio: 2,
    };

    test('it renders a srcset on the img tag', () => {
      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toHaveAttribute(
        'srcset',
        '/provider/w50/image.webp?format=auto 50w, /provider/w100/image.webp?format=auto 100w, /provider/w640/image.webp?format=auto 640w',
      );
    });

    test('it omits the picture and source tags', () => {
      const { container } = renderInto(() => (
        <ResponsiveImage src={imageData} />
      ));

      expect(container.querySelector('picture')).not.toBeInTheDocument();
      expect(container.querySelector('source')).not.toBeInTheDocument();
    });
  });

  // Neither the Solid 1.x suite nor the rest of this file ever calls
  // `hydrate()`, so this block is the only coverage of the SSR -> client path:
  // that the claim adopts the server's nodes instead of rebuilding them, that
  // `isHydrating()` reports the claim window, and that LQIP behaves across it.
  describe('hydration', () => {
    /**
     * Recreates what a real page looks like when `ResponsiveImage` hydrates:
     * the server's `_$HY` bootstrap, then the server markup, then a claim.
     * The markup is shared with the server suite (see `./ssr-fixture`), so a
     * change to the SSR output cannot silently desync this fixture.
     */
    function claimServerMarkup(): {
      container: HTMLElement;
      hydrate: (ui: () => JSX.Element) => void;
    } {
      // The bootstrap `<script>` a real page inlines before the markup.
      new Function(HYDRATION_BOOTSTRAP).call(globalThis);

      const container = document.createElement('div');
      container.innerHTML = LQIP_SSR_MARKUP;
      document.body.appendChild(container);

      return {
        container,
        hydrate(ui) {
          mounted.push(hydrate(ui, container));
        },
      };
    }

    test('reports hydrating during the claim pass only', async () => {
      let duringHydration: boolean | undefined;
      let duringRender: boolean | undefined;

      claimServerMarkup().hydrate(() => {
        duringHydration = isHydrating();
        return <ResponsiveImage src={LQIP_IMAGE_DATA} />;
      });

      expect(
        duringHydration,
        'the component must be able to tell that it is claiming server markup',
      ).toBe(true);

      renderInto(() => {
        duringRender = isHydrating();
        return <ResponsiveImage src={LQIP_IMAGE_DATA} />;
      });

      expect(duringRender, 'a client-only render is not a claim').toBe(false);
    });

    test('claims the server DOM instead of rebuilding it', async () => {
      const { container, hydrate: claim } = claimServerMarkup();
      const serverImg = container.querySelector('img')!;
      const serverSource = container.querySelector('source')!;

      const warnings: string[] = [];
      const originalWarn = console.warn;
      console.warn = (...args: unknown[]) => warnings.push(args.join(' '));
      try {
        claim(() => <ResponsiveImage src={LQIP_IMAGE_DATA} />);
      } finally {
        console.warn = originalWarn;
      }

      // Node identity is the real assertion: a client render (or a hydration
      // key miss) replaces these elements, which would also mean the server
      // markup was never adopted.
      expect(container.querySelector('img')).toBe(serverImg);
      expect(container.querySelector('source')).toBe(serverSource);
      expect(container.querySelectorAll('img')).toHaveLength(1);
      expect(warnings, 'no server node may go unclaimed').toEqual([]);
    });

    test('keeps the server LQIP class while claiming, even for a cached image', async () => {
      // Resolve the fixture first, so `img.complete` is already `true` when
      // the component runs — the case where a naive "is it loaded?" check
      // would strip the server's LQIP class mid-claim.
      await loadImage(FIXTURE_IMAGE);

      const { container, hydrate: claim } = claimServerMarkup();
      const serverImg = container.querySelector('img')!;
      expect(serverImg.complete, 'precondition: the image is cached').toBe(
        true,
      );
      expect(serverImg).toHaveClass('lqip-test-class');

      claim(() => <ResponsiveImage src={LQIP_IMAGE_DATA} />);

      expect(container.querySelector('img')).toHaveClass('lqip-test-class');
    });

    test('drops LQIP after the claim resolves, matching a client render', async () => {
      await loadImage(FIXTURE_IMAGE);

      const { container, hydrate: claim } = claimServerMarkup();
      claim(() => <ResponsiveImage src={LQIP_IMAGE_DATA} />);

      await flush();

      expect(container.querySelector('img')).not.toHaveClass('lqip-test-class');
    });

    test('reacts to props after hydration', async () => {
      const { container, hydrate: claim } = claimServerMarkup();
      const [imageData, setImageData] = createSignal(LQIP_IMAGE_DATA);

      claim(() => <ResponsiveImage src={imageData()} />);

      // The claimed node stays in the document and stays reactive: a client
      // write after the claim has to reach the very element the server
      // rendered. A non-hydratable build would have thrown while claiming.
      setImageData({ ...LQIP_IMAGE_DATA, aspectRatio: 3 });
      await flush();

      const img = container.querySelector('img')!;
      expect(img).toHaveAttribute('width', '3840');
      expect(img).toHaveAttribute('height', '1280');
    });
  });
});

function trigger(el: HTMLElement) {
  el.dispatchEvent(new Event('load'));
}

function loadImage(imageUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve();
    img.src = imageUrl;
  });
}
