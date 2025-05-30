import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinary, fastly, imgix, netlify } from '@responsive-image/cdn';
import { setConfig } from '@responsive-image/core';
import '@responsive-image/wc';
import image from './images/aurora.jpg?responsive';
import imageLqipColor from './images/aurora.jpg?lqip=color&responsive';
import imageLqipInline from './images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import imageLqipBlurhash from './images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
import imageLqipThumbhash from './images/aurora.jpg?lqip={"type":"thumbhash"}&responsive';
import imagePortrait from './images/aurora.jpg?aspect=2:3&responsive';
import imageGray from './images/aurora.jpg?grayscale&responsive';

import type { Config } from '@responsive-image/cdn';

setConfig<Config>('cdn', {
  cloudinary: {
    cloudName: 'responsive-image',
  },
  fastly: {
    domain: 'www.fastly.io',
  },
  imgix: {
    domain: 'responsive-image.imgix.net',
  },
  netlify: {
    domain: 'responsive-image.dev',
  },
});

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <h1>ResponsiveImage for Lit</h1>

      <h2>Netlify</h2>

      <responsive-image
        .src=${netlify('aurora-original.jpg', { aspectRatio: 1.4971927636 })}
        data-test-netlify-image
      ></responsive-image>

      <h2>Cloudinary</h2>

      <responsive-image
        .src=${cloudinary('aurora-original_w0sk6h', { aspectRatio: 1.4971927636 })}
        data-test-cloudinary-image
      ></responsive-image>

      <h2>Fastly</h2>

      <responsive-image
        .src=${fastly('image.webp', { aspectRatio: 2 })}
        data-test-fastly-image
      ></responsive-image>

      <h2>imgix</h2>

      <responsive-image
        .src=${imgix('aurora-original.jpg', { aspectRatio: 1.4971927636 })}
        data-test-imgix-image
      ></responsive-image>

      <h2>Local</h2>

      <responsive-image .src=${image} data-test-local-image="responsive"></responsive-image>
      <responsive-image
        .src=${image}
        width=320
        data-test-local-image="fixed"
      /></responsive-image>
      <responsive-image
        .src=${imageLqipColor}
        width=320
        data-test-local-image="fixed,lqip-color"
      /></responsive-image>
      <responsive-image
        .src=${imageLqipInline}
        width=320
        data-test-local-image="fixed,lqip-inline"
      /></responsive-image>
      <responsive-image
        .src=${imageLqipBlurhash}
        width=320
        data-test-local-image="fixed,lqip-blurhash"
      /></responsive-image>
      <responsive-image
        .src=${imageLqipThumbhash}
        width=320
        data-test-local-image="fixed,lqip-thumbhash"
      /></responsive-image>
      <responsive-image
        .src=${imageGray}
        width=320
        data-test-local-image="fixed,grayscale"
      /></responsive-image>
      <responsive-image
        .src=${imagePortrait}
        width=320
        data-test-local-image="fixed,aspect"
      /></responsive-image>
    `;
  }

  // no shadow DOM needed
  protected createRenderRoot() {
    return this;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-app': MyApp;
  }
}
