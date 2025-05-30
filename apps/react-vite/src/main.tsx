import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { cloudinary, imgix, netlify } from '@responsive-image/cdn';
import { setConfig } from '@responsive-image/core';
import { ResponsiveImage } from '@responsive-image/react';

import image from './images/aurora.jpg?responsive';
import imageLqipColor from './images/aurora.jpg?lqip=color&responsive';
import imageLqipInline from './images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import imageLqipBlurhash from './images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
import imageLqipThumbhash from './images/aurora.jpg?lqip={"type":"thumbhash"}&responsive';
import imagePortrait from './images/aurora.jpg?aspect=2:3&responsive';
import imageGray from './images/aurora.jpg?grayscale&responsive';

setConfig('cdn', {
  cloudinary: {
    cloudName: 'responsive-image',
  },
  imgix: {
    domain: 'responsive-image.imgix.net',
  },
  netlify: {
    domain: 'responsive-image.dev',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>
      <h2>Netlify</h2>
      <ResponsiveImage
        src={netlify('aurora-original.jpg', { aspectRatio: 1.4971927636 })}
        data-test-netlify-image
      />
      <h2>Cloudinary</h2>
      <ResponsiveImage
        src={cloudinary('aurora-original_w0sk6h', {
          aspectRatio: 1.4971927636,
        })}
        data-test-cloudinary-image
      />
      <h2>imgix</h2>
      <ResponsiveImage
        src={imgix('aurora-original.jpg', { aspectRatio: 1.4971927636 })}
        data-test-imgix-image
      />
      <h2>Local</h2>
      <ResponsiveImage src={image} data-test-local-image="responsive" />
      <ResponsiveImage src={image} width={320} data-test-local-image="fixed" />
      <ResponsiveImage
        src={imageLqipColor}
        width={320}
        data-test-local-image="fixed,lqip-color"
      />
      <ResponsiveImage
        src={imageLqipInline}
        width={320}
        data-test-local-image="fixed,lqip-inline"
      />
      <ResponsiveImage
        src={imageLqipBlurhash}
        width={320}
        data-test-local-image="fixed,lqip-blurhash"
      />
      <ResponsiveImage
        src={imageLqipThumbhash}
        width={320}
        data-test-local-image="fixed,lqip-thumbhash"
      />
      <ResponsiveImage
        src={imageGray}
        width={320}
        data-test-local-image="fixed,grayscale"
      />
      <ResponsiveImage
        src={imagePortrait}
        width={320}
        data-test-local-image="fixed,aspect"
      />
    </div>
  </StrictMode>,
);
