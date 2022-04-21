import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import { assert } from '@ember/debug';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwnConfig, macroCondition } from '@embroider/macros';
import { provider as localProvider } from 'ember-responsive-image/helpers/responsive-image-local-provider';
import {
  ImageType,
  LqipBlurhash,
  ProviderResult,
} from 'ember-responsive-image/types';
import { getOwner } from '@ember/application';

declare module '@embroider/macros' {
  export function getOwnConfig(): { usesBlurhash: boolean };
}

declare global {
  const __eri_blurhash: {
    bh2url: (hash: string, width: number, height: number) => string | undefined;
  };

  const FastBoot: unknown;
}

export interface ResponsiveImageComponentSignature {
  Element: HTMLImageElement;
  Args: {
    src: string | ProviderResult;
    size?: number;
    sizes?: string;
    width?: number;
    height?: number;
    cacheBreaker?: string;
  };
}

interface PictureSource {
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

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentSignature> {
  @service
  responsiveImage!: ResponsiveImageService;

  @tracked
  isLoaded = false;

  @tracked
  isRendered = false;

  constructor(owner: unknown, args: ResponsiveImageComponentSignature['Args']) {
    super(owner, args);
    assert('No image argument supplied for <ResponsiveImage>', args.src);
  }

  @cached
  get providerResult(): ProviderResult {
    return typeof this.args.src === 'string'
      ? localProvider(
          this.args.src,
          getOwner(this).lookup('service:responsive-image-local')
        )
      : this.args.src;
  }

  get layout(): Layout {
    return this.args.width === undefined && this.args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): PictureSource[] {
    if (this.layout === Layout.RESPONSIVE) {
      return this.providerResult.imageTypes.map((type) => {
        let widths = this.providerResult.availableWidths;
        if (!widths) {
          widths = this.responsiveImage.meta.deviceWidths;
        }
        const sources: string[] = widths.map((width) => {
          const url = this.providerResult.imageUrlFor(width, type);
          return `${url}${
            this.args.cacheBreaker ? '?' + this.args.cacheBreaker : ''
          } ${width}w`;
        });

        return {
          srcset: sources.join(', '),
          sizes:
            this.args.sizes ??
            (this.args.size ? `${this.args.size}vw` : undefined),
          type,
          mimeType: `image/${type}`,
        };
      });
    } else {
      const width = this.width;
      if (width === undefined) {
        return [];
      }

      return this.providerResult.imageTypes.map((type) => {
        const sources: string[] = PIXEL_DENSITIES.map((density) => {
          const url = this.providerResult.imageUrlFor(width * density, type)!;

          return `${url}${
            this.args.cacheBreaker ? '?' + this.args.cacheBreaker : ''
          } ${density}x`;
        }).filter((source) => source !== undefined);

        return {
          srcset: sources.join(', '),
          type,
          mimeType: `image/${type}`,
        };
      });
    }
  }

  get sourcesSorted(): PictureSource[] {
    return this.sources.sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0)
    );
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    // We *must not* set the src attribute before the <img> is actually rendered, and a child of <picture>
    // Otherwise some browsers (FF, Safari) will eagerly load it, although the image isn't the one the browser
    // should load given the other source/srcset variants. Also prevents native lazy loading.
    if (!this.isRendered && typeof FastBoot === 'undefined') {
      return undefined;
    }

    return this.providerResult.imageUrlFor(this.width ?? 640);
  }

  @cached
  get width(): number | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return this.responsiveImage.getDestinationWidthBySize(
        this.args.size ?? 0
      );
    } else {
      if (this.args.width) {
        return this.args.width;
      }

      const ar = this.providerResult.aspectRatio;
      if (ar !== undefined && ar !== 0 && this.args.height !== undefined) {
        return this.args.height * ar;
      }

      return undefined;
    }
  }

  get height(): number | undefined {
    if (this.args.height) {
      return this.args.height;
    }

    const ar = this.providerResult.aspectRatio;
    if (ar !== undefined && ar !== 0 && this.width !== undefined) {
      return this.width / ar;
    }

    return undefined;
  }

  get classNames(): string {
    const classNames = [`eri-${this.layout}`];
    const lqip = this.providerResult.lqip;
    if (lqip && !this.isLoaded) {
      classNames.push(`eri-lqip-${lqip.type}`);
      if (lqip.type === 'color' || lqip.type === 'inline') {
        classNames.push(lqip.class);
      }
    }

    return classNames.join(' ');
  }

  get hasLqipBlurhash(): boolean {
    if (macroCondition(getOwnConfig().usesBlurhash)) {
      return this.providerResult.lqip?.type === 'blurhash';
    } else {
      return false;
    }
  }

  get showLqipBlurhash(): boolean {
    return !this.isLoaded && this.hasLqipBlurhash;
  }

  get blurhashMeta(): LqipBlurhash | undefined {
    if (macroCondition(getOwnConfig().usesBlurhash)) {
      return this.providerResult.lqip?.type === 'blurhash'
        ? this.providerResult.lqip
        : undefined;
    } else {
      return undefined;
    }
  }

  get lqipBlurhash(): string | undefined {
    if (macroCondition(getOwnConfig().usesBlurhash)) {
      if (!this.hasLqipBlurhash) {
        return undefined;
      }
      const { hash, width, height } = this.providerResult.lqip as LqipBlurhash;
      const uri = __eri_blurhash.bh2url(hash, width, height);

      return `url("${uri}")`;
    } else {
      return undefined;
    }
  }

  processUrl(url: string): string {
    return `${url}${
      this.args.cacheBreaker ? '?' + this.args.cacheBreaker : ''
    }`;
  }

  @action
  onLoad(): void {
    this.isLoaded = true;
  }

  @action
  setRendered(): void {
    this.isRendered = true;
  }
}
