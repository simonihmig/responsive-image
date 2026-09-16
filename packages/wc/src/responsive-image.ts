import {
  type ImageData,
  type ImageSource,
  type ResponsiveImageLayout,
  getLayout,
  getSources,
  getSourcesSorted,
  getSrc,
  getValueOrCallback,
  getWidth,
  getHeight,
} from '@responsive-image/core';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { keyed } from 'lit/directives/keyed.js';
import { ref } from 'lit/directives/ref.js';
import { type StyleInfo, styleMap } from 'lit/directives/style-map.js';

@customElement('responsive-image')
export class ResponsiveImage extends LitElement {
  static styles = css`
    .ri-img {
      background-size: cover;
    }

    .ri-responsive {
      width: 100%;
      height: auto;
    }

    .ri-fixed,
    .ri-responsive {
      content-visibility: auto;
    }
  `;

  @property({ type: Object }) src!: ImageData;

  @property({ type: Number }) size?: number;

  @property({ type: String }) sizes?: string;

  @property({ type: Number }) width?: number;

  @property({ type: Number }) height?: number;

  @property({ type: String }) loading: 'eager' | 'lazy' = 'lazy';

  @property({ type: String }) decoding: 'async' | 'sync' | 'auto' = 'async';

  @property({ type: String }) fetchPriority?: 'high' | 'low' | 'auto';

  @property({ type: String }) crossOrigin?: 'anonymous' | 'use-credentials';

  @property({ type: String })
  referrerPolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

  @property({ type: String }) alt = '';

  @state()
  private loadedSrc?: ImageData;

  get complete(): boolean {
    return this.loadedSrc === this.src;
  }

  get layout(): ResponsiveImageLayout {
    return getLayout(this);
  }

  get sources(): ImageSource[] {
    return getSources(this);
  }

  get sourcesSorted(): ImageSource[] {
    return getSourcesSorted(this.sources);
  }

  get imgWidth(): number | undefined {
    return getWidth(this);
  }

  get imgHeight(): number | undefined {
    return getHeight(this);
  }

  get imgSrc(): string | undefined {
    return getSrc(this);
  }

  checkAlreadyLoaded(el?: HTMLImageElement) {
    if (el?.complete) {
      this.loadedSrc = this.src;
    }
  }

  render(): unknown {
    const { lqip, imageTypes } = this.src;

    if (lqip?.class) {
      throw new Error(
        "Using LQIP with a class name is not supported in @responsive-image/wc, as globals styles will not work with web components and Shadow DOM. Use the `styles: 'inline'` option in your build plugin config.",
      );
    }

    const classes: ClassInfo = {
      'ri-img': true,
      'ri-responsive': this.layout === 'responsive',
      'ri-fixed': this.layout === 'fixed',
      ...(lqip?.class && !this.complete
        ? { [getValueOrCallback(lqip.class)]: true }
        : {}),
    };

    const styles: StyleInfo = this.complete
      ? {}
      : {
          ...(lqip?.inlineStyles ? getValueOrCallback(lqip.inlineStyles) : {}),
        };

    const _img = html`
      <img
        part="img"
        width=${ifDefined(this.imgWidth)}
        height=${ifDefined(this.imgHeight)}
        class=${classMap(classes)}
        loading=${this.loading}
        style=${styleMap(styles)}
        srcset=${ifDefined(
          imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              this.sources[0]?.srcset
            : undefined,
        )}
        src=${ifDefined(this.imgSrc)}
        alt=${this.alt}
        decoding=${this.decoding}
        crossorigin=${ifDefined(this.crossOrigin)}
        fetchpriority=${ifDefined(this.fetchPriority)}
        referrerpolicy=${ifDefined(this.referrerPolicy)}
        data-ri-lqip=${ifDefined(lqip?.attribute)}
        @load=${(event: Event) => {
          this.loadedSrc = this.src;
          this.dispatchEvent(new Event(event.type, event));
        }}
        @error=${(event: Event) => {
          this.dispatchEvent(new ErrorEvent(event.type, event));
        }}
        @abort=${(event: Event) => {
          this.dispatchEvent(new Event(event.type, event));
        }}
        ${ref(this.checkAlreadyLoaded as (el?: Element) => void)}
      />
    `;

    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    const img = keyed(this.src.lqip && this.src, _img);

    if (imageTypes === 'auto') {
      return img;
    }

    return html`
      <picture>
        ${this.sourcesSorted.map(
          (s) =>
            html`<source
              srcset=${s.srcset}
              type=${ifDefined(s.mimeType)}
              sizes=${s.sizes ?? nothing}
            />`,
        )}
        ${img}
      </picture>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'responsive-image': ResponsiveImage;
  }
}
