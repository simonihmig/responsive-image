import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@responsive-image/wc';
import auroraImage from './assets/aurora.jpg?responsive';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html` <responsive-image .src=${auroraImage}></responsive-image> `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-app': MyApp;
  }
}
