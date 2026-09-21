import { beforeEach, describe, expect, test } from 'vitest';

import {
  type ImageData,
  type ResponsiveImageArgs,
  createLqipKey,
  env,
  getClassNames,
  getHeight,
  getImageTypes,
  getLayout,
  getMimeType,
  getSources,
  getSourcesSorted,
  getSrc,
  getStyles,
  getWidth,
  IMAGE_TYPE_SCORE,
  PIXEL_DENSITIES,
} from '../src';

function createImageData(overrides: Partial<ImageData> = {}): ImageData {
  return {
    imageTypes: ['jpeg', 'webp', 'avif'],
    aspectRatio: 2,
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
    ...overrides,
  };
}

function createArgs(
  overrides: Partial<ResponsiveImageArgs> = {},
): ResponsiveImageArgs {
  return {
    src: createImageData(),
    ...overrides,
  };
}

describe('constants', () => {
  test('PIXEL_DENSITIES', () => {
    expect(PIXEL_DENSITIES).toStrictEqual([1, 2]);
  });

  test('IMAGE_TYPE_SCORE prefers next-gen formats', () => {
    expect(IMAGE_TYPE_SCORE.get('png')).toBe(1);
    expect(IMAGE_TYPE_SCORE.get('jpeg')).toBe(1);
    expect(IMAGE_TYPE_SCORE.get('webp')).toBe(2);
    expect(IMAGE_TYPE_SCORE.get('avif')).toBe(3);
  });
});

describe('getMimeType', () => {
  test('returns image mime type for concrete formats', () => {
    expect(getMimeType('png')).toBe('image/png');
    expect(getMimeType('jpeg')).toBe('image/jpeg');
    expect(getMimeType('webp')).toBe('image/webp');
    expect(getMimeType('avif')).toBe('image/avif');
  });

  test('returns undefined for auto format', () => {
    expect(getMimeType('auto')).toBeUndefined();
  });
});

describe('getImageTypes', () => {
  test('passes through array', () => {
    const types = ['jpeg', 'webp'] as const;
    expect(getImageTypes([...types])).toStrictEqual(['jpeg', 'webp']);
  });

  test('normalizes single type string to array', () => {
    expect(getImageTypes('auto')).toStrictEqual(['auto']);
    expect(getImageTypes('webp')).toStrictEqual(['webp']);
  });
});

describe('getLayout', () => {
  test('is responsive when neither width nor height is given', () => {
    expect(getLayout(createArgs())).toBe('responsive');
  });

  test('is fixed when width is given', () => {
    expect(getLayout(createArgs({ width: 100 }))).toBe('fixed');
  });

  test('is fixed when height is given', () => {
    expect(getLayout(createArgs({ height: 100 }))).toBe('fixed');
  });
});

describe('getWidth', () => {
  test('is the largest deviceWidth for responsive layout', () => {
    expect(getWidth(createArgs())).toBe(env.deviceWidths.at(-1));
  });

  test('returns given width for fixed layout', () => {
    expect(getWidth(createArgs({ width: 100 }))).toBe(100);
  });

  test('is derived from height and aspect ratio', () => {
    expect(getWidth(createArgs({ height: 100 }))).toBe(200);
  });

  test('is undefined when aspect ratio is unknown', () => {
    const args = createArgs({ height: 100 });
    args.src.aspectRatio = undefined;
    expect(getWidth(args)).toBeUndefined();
  });
});

describe('getHeight', () => {
  test('is derived from width and aspect ratio', () => {
    expect(getHeight(createArgs({ width: 150 }))).toBe(75);
  });

  test('returns given height', () => {
    expect(getHeight(createArgs({ width: 150, height: 50 }))).toBe(50);
  });

  test('is derived from largest deviceWidth for responsive layout', () => {
    expect(getHeight(createArgs())).toBe(
      Math.round(env.deviceWidths.at(-1)! / 2),
    );
  });

  test('is undefined when aspect ratio is unknown', () => {
    const args = createArgs({ width: 150 });
    args.src.aspectRatio = undefined;
    expect(getHeight(args)).toBeUndefined();
  });
});

describe('getSrc', () => {
  test('uses largest deviceWidth as fallback', () => {
    expect(getSrc(createArgs())).toBe(
      `/provider/w${env.deviceWidths.at(-1)}/image.jpeg`,
    );
  });

  test('uses given width', () => {
    expect(getSrc(createArgs({ width: 100 }))).toBe(
      '/provider/w100/image.jpeg',
    );
  });

  test('passes auto format', () => {
    const args = createArgs();
    const imageUrlFor = args.src.imageUrlFor;
    const spy = (width: number, type?: string) => imageUrlFor(width, type);
    args.src.imageTypes = 'auto';
    const result = getSrc(args);
    expect(result).toBe(spy(env.deviceWidths.at(-1)!, 'auto'));
  });
});

describe('getSources', () => {
  test('uses availableWidths for responsive layout', () => {
    const args = createArgs();
    args.src.availableWidths = [50, 100, 640];
    const sources = getSources(args);
    expect(sources).toHaveLength(3);
    expect(sources[0]?.srcset).toBe(
      '/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w',
    );
    expect(sources[1]?.srcset).toBe(
      '/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w',
    );
    expect(sources[2]?.srcset).toBe(
      '/provider/w50/image.avif 50w, /provider/w100/image.avif 100w, /provider/w640/image.avif 640w',
    );
  });

  test('falls back to env deviceWidths for responsive layout', () => {
    const sources = getSources(createArgs());
    expect(sources[0]?.srcset).toBe(
      env.deviceWidths
        .map((w) => `/provider/w${w}/image.jpeg ${w}w`)
        .join(', '),
    );
  });

  test('sets sizes from size argument for responsive layout', () => {
    const sources = getSources(createArgs({ size: 40 }));
    for (const source of sources) {
      expect(source.sizes).toBe('40vw');
    }
  });

  test('sets sizes from sizes argument for responsive layout', () => {
    const sizes = '(max-width: 767px) 100vw, 50vw';
    const sources = getSources(createArgs({ sizes }));
    for (const source of sources) {
      expect(source.sizes).toBe(sizes);
    }
  });

  test('uses pixel densities for fixed layout', () => {
    const sources = getSources(createArgs({ width: 50 }));
    for (const source of sources) {
      expect(source.srcset).toContain(
        '/image.${type} 1x'.replace('${type}', source.type as string),
      );
    }
    expect(sources[0]?.srcset).toBe(
      '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x',
    );
    expect(sources[2]?.srcset).toBe(
      '/provider/w50/image.avif 1x, /provider/w100/image.avif 2x',
    );
  });

  test('is empty for fixed layout when width cannot be determined', () => {
    const args = createArgs({ height: 50 });
    args.src.aspectRatio = undefined;
    expect(getSources(args)).toStrictEqual([]);
  });

  test('sets mime type per format', () => {
    const sources = getSources(createArgs());
    expect(sources).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ mimeType: 'image/jpeg' }),
        expect.objectContaining({ mimeType: 'image/webp' }),
        expect.objectContaining({ mimeType: 'image/avif' }),
      ]),
    );
  });
});

describe('getSourcesSorted', () => {
  test('prefers next-gen formats over legacy', () => {
    const args = createArgs();
    args.src.imageTypes = ['avif', 'webp', 'jpeg'];
    const sorted = getSourcesSorted(getSources(args));
    expect(sorted.map((s) => s.type)).toStrictEqual(['avif', 'webp', 'jpeg']);
  });

  test('does not mutate the input', () => {
    const sources = getSources(createArgs());
    const copy = [...sources];
    getSourcesSorted(sources);
    expect(sources).toStrictEqual(copy);
  });
});

describe('getClassNames', () => {
  test('includes base classes', () => {
    expect(getClassNames(createArgs(), false)).toBe('ri-img ri-responsive');
    expect(getClassNames(createArgs({ width: 100 }), false)).toBe(
      'ri-img ri-fixed',
    );
  });

  test('appends LQIP class when not loaded', () => {
    const args = createArgs();
    args.src.lqip = { class: 'lqip-class' };
    expect(getClassNames(args, false)).toBe('ri-img ri-responsive lqip-class');
  });

  test('omits LQIP class when loaded', () => {
    const args = createArgs();
    args.src.lqip = { class: 'lqip-class' };
    expect(getClassNames(args, true)).toBe('ri-img ri-responsive');
  });

  test('resolves LQIP class from callback', () => {
    const args = createArgs();
    args.src.lqip = { class: () => 'lqip-class' };
    expect(getClassNames(args, false)).toBe('ri-img ri-responsive lqip-class');
  });

  test('appends custom class', () => {
    expect(getClassNames(createArgs(), false, 'custom-class')).toBe(
      'ri-img ri-responsive custom-class',
    );
  });
});

describe('getStyles', () => {
  test('is undefined when loaded', () => {
    expect(getStyles(createArgs(), true)).toBeUndefined();
  });

  test('returns inline styles when not loaded', () => {
    const args = createArgs();
    args.src.lqip = { inlineStyles: { 'background-color': 'red' } };
    expect(getStyles(args, false)).toStrictEqual({ 'background-color': 'red' });
  });

  test('resolves inline styles from callback', () => {
    const args = createArgs();
    args.src.lqip = {
      inlineStyles: () => ({ 'background-color': 'blue' }),
    };
    expect(getStyles(args, false)).toStrictEqual({
      'background-color': 'blue',
    });
  });

  test('is undefined when no LQIP styles given', () => {
    expect(getStyles(createArgs(), false)).toBeUndefined();
  });
});

describe('createLqipKey', () => {
  beforeEach(() => {
    // noop; keys are per-mapper instance
  });

  test('is undefined for src without LQIP', () => {
    const key = createLqipKey();
    expect(key(createImageData())).toBeUndefined();
  });

  test('returns distinct keys for distinct srcs', () => {
    const key = createLqipKey();
    const a = createImageData({ lqip: { class: 'a' } });
    const b = createImageData({ lqip: { class: 'b' } });
    expect(key(a)).toBe(0);
    expect(key(b)).toBe(1);
    expect(key(a)).toBe(0);
    expect(key(b)).toBe(1);
  });

  test('creates independent key sequences', () => {
    const keyA = createLqipKey();
    const keyB = createLqipKey();
    const src = createImageData({ lqip: { class: 'a' } });
    expect(keyA(src)).toBe(0);
    expect(keyB(src)).toBe(0);
  });
});
