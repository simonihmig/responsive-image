import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cloudinaryProvider, imgixProvider } from '@responsive-image/cdn';
import { setConfig } from '@responsive-image/core';
import '@responsive-image/wc';
import image from './images/aurora.jpg?responsive';
import imageLqipColor from './images/aurora.jpg?lqip=color&responsive';
import imageLqipInline from './images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import imageLqipBlurhash from './images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
import imagePortrait from './images/aurora.jpg?aspect=2:3&responsive';
import imageGray from './images/aurora.jpg?grayscale&responsive';

import type { CloudinaryConfig, ImgixConfig } from '@responsive-image/cdn';

setConfig<CloudinaryConfig>('cloudinary', {
  cloudName: 'kaliber5',
});
setConfig<ImgixConfig>('imgix', {
  domain: 'kaliber5.imgix.net',
});

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <h1>ResponsiveImage for Lit</h1>

      <h2>Cloudinary</h2>

      <responsive-image
        .src=${cloudinaryProvider('samples/animals/three-dogs')}
        data-test-cloudinary-image
      ></responsive-image>

      <h2>imgix</h2>

      <responsive-image
        .src=${imgixProvider('pages/approach/agile_2000x1200.jpg')}
        data-test-imgix-image
      ></responsive-image>

      <h2>Local</h2>

      <responsive-image .src=${image}></responsive-image>
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

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-app': MyApp;
  }
}