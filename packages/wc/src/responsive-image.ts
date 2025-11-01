import {
  type ImageData,
  type ImageUrlForType,
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
} from '@responsive-image/core';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { keyed } from 'lit/directives/keyed.js';
import { ref } from 'lit/directives/ref.js';
import { type StyleInfo, styleMap } from 'lit/directives/style-map.js';

interface ImageSource {
  srcset: string;
  type: ImageUrlForType;
  mimeType?: string;
  sizes?: string;
}

enum Layout {
  RESPONSIVE = 'responsive',
  FIXED = 'fixed',
}

const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageUrlForType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

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

  get layout(): Layout {
    return this.width === undefined && this.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): ImageSource[] {
    const imageTypes = Array.isArray(this.src.imageTypes)
      ? this.src.imageTypes
      : [this.src.imageTypes];
    if (this.layout === Layout.RESPONSIVE) {
      return imageTypes.map((type) => {
        let widths = this.src.availableWidths;
        if (!widths) {
          widths = env.deviceWidths;
        }
        const sources: string[] = widths.map((width) => {
          const url = this.src.imageUrlFor(width, type);
          return `${url} ${width}w`;
        });

        return {
          srcset: sources.join(', '),
          sizes: this.sizes ?? (this.size ? `${this.size}vw` : undefined),
          type,
          mimeType: type != 'auto' ? `image/${type}` : undefined,
        };
      });
    }
    const { width } = this;
    if (width === undefined) {
      return [];
    }

    return imageTypes.map((type) => {
      const sources: string[] = PIXEL_DENSITIES.map((density) => {
        const url = this.src.imageUrlFor(width * density, type)!;

        return `${url} ${density}x`;
      }).filter((source) => source !== undefined);

      return {
        srcset: sources.join(', '),
        type,
        mimeType: type != 'auto' ? `image/${type}` : undefined,
      };
    });
  }

  get sourcesSorted(): ImageSource[] {
    return this.sources.sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
    );
  }

  get imgWidth(): number | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return getDestinationWidthBySize(this.size);
    }

    if (this.width) {
      return this.width;
    }

    const ar = this.src.aspectRatio;
    if (ar !== undefined && ar !== 0 && this.height !== undefined) {
      return this.height * ar;
    }

    return undefined;
  }

  get imgHeight(): number | undefined {
    if (this.height) {
      return this.height;
    }

    const ar = this.src.aspectRatio;
    if (ar !== undefined && ar !== 0 && this.imgWidth !== undefined) {
      return Math.round(this.imgWidth / ar);
    }

    return undefined;
  }

  get imgSrc(): string | undefined {
    const format = this.src.imageTypes === 'auto' ? 'auto' : undefined;
    return this.src.imageUrlFor(this.imgWidth ?? 640, format);
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
      'ri-responsive': this.layout === Layout.RESPONSIVE,
      'ri-fixed': this.layout === Layout.FIXED,
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
              this.sources[0].srcset
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
