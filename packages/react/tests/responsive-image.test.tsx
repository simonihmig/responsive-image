import { type ImageData } from '@responsive-image/core';
import { render } from '@testing-library/react';
import React from 'react';
import { assert, test } from 'vitest';

import { ResponsiveImage } from '../src/responsive-image.tsx';

const imageData: ImageData = {
  imageTypes: ['jpeg', 'webp', 'avif'],
  imageUrlFor(width, type = 'jpeg') {
    return `/provider/w${width}/image.${type}`;
  },
  aspectRatio: 2,
};

test('renders the given formats as sources', async () => {
  const image = render(<ResponsiveImage src={imageData}></ResponsiveImage>);
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

test('loads lazily by default', async () => {
  const image = render(<ResponsiveImage src={imageData}></ResponsiveImage>);
  assert.ok(image);

  const img = image.container.querySelector('img');
  assert.ok(img);

  assert.equal(img.getAttribute('loading'), 'lazy');
});

test('decodes async by default', async () => {
  const image = render(<ResponsiveImage src={imageData}></ResponsiveImage>);
  assert.ok(image);

  const img = image.container.querySelector('img');
  assert.ok(img);

  assert.equal(img.getAttribute('decoding'), 'async');
});

test('can load eager', async () => {
  const image = render(
    <ResponsiveImage src={imageData} loading="eager"></ResponsiveImage>,
  );
  assert.ok(image);

  const img = image.container.querySelector('img');
  assert.ok(img);

  assert.equal(img.getAttribute('loading'), 'eager');
});

test('can decode sync', async () => {
  const image = render(
    <ResponsiveImage src={imageData} decoding="sync"></ResponsiveImage>,
  );
  assert.ok(image);

  const img = image.container.querySelector('img');
  assert.ok(img);

  assert.equal(img.getAttribute('decoding'), 'sync');
});
