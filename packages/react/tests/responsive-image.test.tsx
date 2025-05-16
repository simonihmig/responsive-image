import { type ImageData } from '@responsive-image/core';
import { render, act } from '@testing-library/react';
import React from 'react';
import { assert, describe, expect, it } from 'vitest';

import { trigger } from './image.helper.ts';
import { ResponsiveImage } from '../src/responsive-image.tsx';

const defaultImageData: ImageData = {
  imageTypes: ['jpeg', 'webp', 'avif'],
  imageUrlFor(width, type = 'jpeg') {
    return `/provider/w${width}/image.${type}`;
  },
  aspectRatio: 2,
};

describe('Response image', () => {
  it('renders the given formats as sources', async () => {
    const image = render(
      <ResponsiveImage src={defaultImageData}></ResponsiveImage>,
    );
    assert.ok(image);

    assert.equal(
      image.container.querySelectorAll('picture').length,
      1,
      'Expected to find a picture element',
    );

    assert.equal(
      image.container.querySelectorAll('source').length,
      3,
      'Expected to find three sources, matching jpeg, webp and avif formats',
    );

    assert.ok(image.container.querySelector('source[type="image/jpeg"]'));
    assert.ok(image.container.querySelector('source[type="image/webp"]'));
    assert.ok(image.container.querySelector('source[type="image/avif"]'));
  });

  it('loads lazily by default', async () => {
    const image = render(
      <ResponsiveImage src={defaultImageData}></ResponsiveImage>,
    );
    assert.ok(image);

    const img = image.container.querySelector('img');
    assert.ok(img);

    assert.equal(img.getAttribute('loading'), 'lazy');
  });

  it('decodes async by default', async () => {
    const image = render(
      <ResponsiveImage src={defaultImageData}></ResponsiveImage>,
    );
    assert.ok(image);

    const img = image.container.querySelector('img');
    assert.ok(img);

    assert.equal(img.getAttribute('decoding'), 'async');
  });

  it('can load eager', async () => {
    const image = render(
      <ResponsiveImage
        src={defaultImageData}
        loading="eager"
      ></ResponsiveImage>,
    );
    assert.ok(image);

    const img = image.container.querySelector('img');
    assert.ok(img);

    assert.equal(img.getAttribute('loading'), 'eager');
  });

  it('can decode sync', async () => {
    const image = render(
      <ResponsiveImage
        src={defaultImageData}
        decoding="sync"
      ></ResponsiveImage>,
    );
    assert.ok(image);

    const img = image.container.querySelector('img');
    assert.ok(img);

    assert.equal(img.getAttribute('decoding'), 'sync');
  });

  describe('LQIP', () => {
    it('it sets LQIP class from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: 'lqip-color-test-class',
        },
      };

      const { container } = render(<ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      await act(() => trigger(imgEl));

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    it('it sets LQIP class from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          class: () => 'lqip-color-test-class',
        },
      };

      const { container } = render(<ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveClass('lqip-color-test-class');

      await act(() => trigger(imgEl));

      expect(imgEl).not.toHaveClass('lqip-color-test-class');
    });

    it('it sets LQIP background image from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          bgImage: 'test.png',
        },
      };

      const { container } = render(<ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'url("test.png")',
      });

      await act(() => trigger(imgEl));

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'none',
      });
    });

    it('it sets LQIP background image from callback', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          bgImage: () => 'test.png',
        },
      };

      const { container } = render(<ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toBeDefined();
      expect(imgEl.complete).toBe(false);
      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'url("test.png")',
      });

      await act(() => trigger(imgEl));

      expect(imgEl).toHaveStyle({
        backgroundSize: 'cover',
        backgroundImage: 'none',
      });
    });

    it('it sets LQIP attribute from literal', async () => {
      const imageData: ImageData = {
        ...defaultImageData,
        lqip: {
          attribute: 'test-attr',
        },
      };

      const { container } = render(<ResponsiveImage src={imageData} />);
      const imgEl = container.querySelector('img')!;

      expect(imgEl).toHaveAttribute('data-ri-lqip', 'test-attr');
    });
  });
});
