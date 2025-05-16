import { type ImageData } from '@responsive-image/core';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ResponsiveImage } from '../src/responsive-image.tsx';

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('undefined');
  });
});

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
    aspectRatio: 1.5,
  };

  it('renders a responsive image', () => {
    const string = renderToString(<ResponsiveImage src={defaultImageData} />);
    expect(string).toMatchInlineSnapshot(
      `"<picture><source srcSet="/provider/w640/image.avif 640w, /provider/w750/image.avif 750w, /provider/w828/image.avif 828w, /provider/w1080/image.avif 1080w, /provider/w1200/image.avif 1200w, /provider/w1920/image.avif 1920w, /provider/w2048/image.avif 2048w, /provider/w3840/image.avif 3840w" type="image/avif"/><source srcSet="/provider/w640/image.webp 640w, /provider/w750/image.webp 750w, /provider/w828/image.webp 828w, /provider/w1080/image.webp 1080w, /provider/w1200/image.webp 1200w, /provider/w1920/image.webp 1920w, /provider/w2048/image.webp 2048w, /provider/w3840/image.webp 3840w" type="image/webp"/><source srcSet="/provider/w640/image.jpeg 640w, /provider/w750/image.jpeg 750w, /provider/w828/image.jpeg 828w, /provider/w1080/image.jpeg 1080w, /provider/w1200/image.jpeg 1200w, /provider/w1920/image.jpeg 1920w, /provider/w2048/image.jpeg 2048w, /provider/w3840/image.jpeg 3840w" type="image/jpeg"/><img class="ri-img ri-responsive" loading="lazy" decoding="async" width="320" height="213" src="/provider/w320/image.jpeg"/></picture>"`,
    );
  });

  it('renders LQIP class', () => {
    const imageData: ImageData = {
      ...defaultImageData,
      lqip: {
        class: 'test-class',
      },
    };
    const string = renderToString(<ResponsiveImage src={imageData} />);
    expect(string).toMatchInlineSnapshot(
      `"<picture><source srcSet="/provider/w640/image.avif 640w, /provider/w750/image.avif 750w, /provider/w828/image.avif 828w, /provider/w1080/image.avif 1080w, /provider/w1200/image.avif 1200w, /provider/w1920/image.avif 1920w, /provider/w2048/image.avif 2048w, /provider/w3840/image.avif 3840w" type="image/avif"/><source srcSet="/provider/w640/image.webp 640w, /provider/w750/image.webp 750w, /provider/w828/image.webp 828w, /provider/w1080/image.webp 1080w, /provider/w1200/image.webp 1200w, /provider/w1920/image.webp 1920w, /provider/w2048/image.webp 2048w, /provider/w3840/image.webp 3840w" type="image/webp"/><source srcSet="/provider/w640/image.jpeg 640w, /provider/w750/image.jpeg 750w, /provider/w828/image.jpeg 828w, /provider/w1080/image.jpeg 1080w, /provider/w1200/image.jpeg 1200w, /provider/w1920/image.jpeg 1920w, /provider/w2048/image.jpeg 2048w, /provider/w3840/image.jpeg 3840w" type="image/jpeg"/><img class="ri-img ri-responsive test-class" loading="lazy" decoding="async" width="320" height="213" src="/provider/w320/image.jpeg"/></picture>"`,
    );
  });
});
