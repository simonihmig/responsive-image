import { html, css, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  type ImageType,
  type LqipBlurhash,
  type ImageData,
  env,
  getDestinationWidthBySize,
} from '@responsive-image/core';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { decode2url } from '@responsive-image/core/blurhash/decode';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';

interface ImageSource {
  srcset: string;
  type: ImageType;
  mimeType: string;
  sizes?: string;
}

enum Layout {
  RESPONSIVE = 'responsive',
  FIXED = 'fixed',
}

const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

@customElement('responsive-image')
export class ResponsiveImage extends LitElement {
  static styles = css`
    .ri-responsive {
      width: 100%;
      height: auto;
    }

    .ri-fixed,
    .ri-responsive {
      content-visibility: auto;
    }

    .ri-lqip-inline {
      background-size: cover;
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
  private isLoaded = false;

  get layout(): Layout {
    return this.width === undefined && this.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): ImageSource[] {
    if (this.layout === Layout.RESPONSIVE) {
      return this.src.imageTypes.map((type) => {
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
          mimeType: `image/${type}`,
        };
      });
    }
    const { width } = this;
    if (width === undefined) {
      return [];
    }

    return this.src.imageTypes.map((type) => {
      const sources: string[] = PIXEL_DENSITIES.map((density) => {
        const url = this.src.imageUrlFor(width * density, type)!;

        return `${url} ${density}x`;
      }).filter((source) => source !== undefined);

      return {
        srcset: sources.join(', '),
        type,
        mimeType: `image/${type}`,
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
    return this.src.imageUrlFor(this.imgWidth ?? 640);
  }

  get hasLqipBlurhash(): boolean {
    return this.src.lqip?.type === 'blurhash';
  }

  get showLqipBlurhash(): boolean {
    return !this.isLoaded && this.hasLqipBlurhash;
  }

  get lqipBlurhash(): string | undefined {
    if (!this.hasLqipBlurhash) {
      return undefined;
    }

    const { hash, width, height } = this.src.lqip as LqipBlurhash;
    const uri = decode2url(hash, width, height);

    return `url("${uri}")`;
  }

  render() {
    const { lqip } = this.src;

    const classes: ClassInfo = {
      'ri-responsive': this.layout === Layout.RESPONSIVE,
      'ri-fixed': this.layout === Layout.FIXED,
      'ri-lqip-inline': lqip?.type === 'inline' && !this.isLoaded,
      'ri-lqip-color': lqip?.type === 'color' && !this.isLoaded,
      'ri-lqip-blurhash': lqip?.type === 'blurhash' && !this.isLoaded,
      [lqip?.type === 'color' || lqip?.type === 'inline' ? lqip.class : '']:
        (lqip?.type === 'color' || lqip?.type === 'inline') && !this.isLoaded,
    };

    const styles: StyleInfo = this.showLqipBlurhash
      ? {
          backgroundImage: this.lqipBlurhash,
          backgroundSize: 'cover',
        }
      : {};

    return html`
      <picture>
        ${this.sourcesSorted.map(
          (s) =>
            html`<source
              srcset=${s.srcset}
              type=${s.mimeType}
              sizes=${s.sizes ?? nothing}
            />`,
        )}
        <img
          part="img"
          width=${ifDefined(this.imgWidth)}
          height=${ifDefined(this.imgHeight)}
          class=${classMap(classes)}
          style=${styleMap(styles)}
          src=${ifDefined(this.imgSrc)}
          alt=${this.alt}
          loading=${this.loading}
          decoding=${this.decoding}
          crossorigin=${ifDefined(this.crossOrigin)}
          fetchpriority=${ifDefined(this.fetchPriority)}
          referrerpolicy=${ifDefined(this.referrerPolicy)}
          @load=${() => {
            this.isLoaded = true;
          }}
        />
      </picture>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'responsive-image': ResponsiveImage;
  }
}
