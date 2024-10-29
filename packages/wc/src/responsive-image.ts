import { html, css, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  type ImageType,
  // type LqipBlurhash,
  type ImageData,
  env,
  getDestinationWidthBySize,
} from '@responsive-image/core';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

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

  @property({ type: String }) loading: 'lazy' | 'eager' = 'lazy';

  @property({ type: String }) alt = '';

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
      return this.imgWidth / ar;
    }

    return undefined;
  }

  get imgSrc(): string | undefined {
    return this.src.imageUrlFor(this.imgWidth ?? 640);
  }

  render() {
    const classes = {
      'ri-responsive': this.layout === Layout.RESPONSIVE,
      'ri-fixed': this.layout === Layout.FIXED,
    };

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
          width=${ifDefined(this.imgWidth)}
          height=${ifDefined(this.imgHeight)}
          class=${classMap(classes)}
          src=${ifDefined(this.imgSrc)}
          alt=${this.alt}
          loading=${this.loading}
          decoding="async"
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