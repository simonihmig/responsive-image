import { assert } from '@ember/debug';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import {
  env,
  getDestinationWidthBySize,
  isLqipBlurhash,
  isLqipThumbhash,
} from '@responsive-image/core';
import style from 'ember-style-modifier';

import { LqipBlurhashProvider } from '../utils/lqip-hash/blurhash.ts';
import { LqipThumbhashProvider } from '../utils/lqip-hash/thumbhash.ts';

import type { LqipHashProvider } from '../utils/lqip-hash/types';
import type {
  ImageData,
  ImageType,
  LqipBlurhash,
} from '@responsive-image/core';
import './responsive-image.css';

declare global {
  const __eri_blurhash: {
    bh2url: (hash: string, width: number, height: number) => string | undefined;
  };

  const FastBoot: unknown;
}

export interface ResponsiveImageComponentSignature {
  Element: HTMLImageElement;
  Args: {
    src: ImageData;
    size?: number;
    sizes?: string;
    width?: number;
    height?: number;
  };
}

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

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentSignature> {
  @tracked
  isLoaded = false;

  constructor(owner: Owner, args: ResponsiveImageComponentSignature['Args']) {
    super(owner, args);
    assert('No @src argument supplied for <ResponsiveImage>', args.src);
    assert(
      'Image paths as @src argument for <ResponsiveImage> are not supported anymore.',
      typeof args.src !== 'string',
    );
  }

  get layout(): Layout {
    return this.args.width === undefined && this.args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): ImageSource[] {
    if (this.layout === Layout.RESPONSIVE) {
      return this.args.src.imageTypes.map((type) => {
        let widths = this.args.src.availableWidths;
        if (!widths) {
          widths = env.deviceWidths;
        }
        const sources: string[] = widths.map((width) => {
          const url = this.args.src.imageUrlFor(width, type);
          return `${url} ${width}w`;
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

      return this.args.src.imageTypes.map((type) => {
        const sources: string[] = PIXEL_DENSITIES.map((density) => {
          const url = this.args.src.imageUrlFor(width * density, type)!;

          return `${url} ${density}x`;
        }).filter((source) => source !== undefined);

        return {
          srcset: sources.join(', '),
          type,
          mimeType: `image/${type}`,
        };
      });
    }
  }

  get sourcesSorted(): ImageSource[] {
    return this.sources.sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
    );
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    const url = this.args.src.imageUrlFor(this.width ?? 640);
    return url;
  }

  @cached
  get width(): number | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return getDestinationWidthBySize(this.args.size);
    } else {
      if (this.args.width) {
        return this.args.width;
      }

      const ar = this.args.src.aspectRatio;
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

    const ar = this.args.src.aspectRatio;
    if (ar !== undefined && ar !== 0 && this.width !== undefined) {
      return this.width / ar;
    }

    return undefined;
  }

  get classNames(): string {
    const classNames = [`ri-${this.layout}`];
    const lqip = this.args.src.lqip;
    if (lqip && !this.isLoaded) {
      classNames.push(`ri-lqip-${lqip.type}`);
      if (lqip.type === 'color' || lqip.type === 'inline') {
        classNames.push(lqip.class);
      }
    }

    return classNames.join(' ');
  }

  get blurhashMeta(): LqipBlurhash | undefined {
    return isLqipBlurhash(this.args.src.lqip) ? this.args.src.lqip : undefined;
  }

  get thumbhashMeta(): LqipThumbhash | undefined {
    return isLqipThumbhash(this.args.src.lqip) ? this.args.src.lqip : undefined;
  }

  @cached
  get lqipHashProvider(): LqipHashProvider | undefined {
    if (isLqipBlurhash(this.args.src.lqip)) {
      return new LqipBlurhashProvider(this.args.src.lqip);
    }

    if (isLqipThumbhash(this.args.src.lqip)) {
      return new LqipThumbhashProvider(this.args.src.lqip);
    }

    return undefined;
  }

  get showLqipHash(): boolean {
    return (!this.isLoaded && this.lqipHashProvider?.available) ?? false;
  }

  @action
  onLoad(): void {
    this.isLoaded = true;
  }

  <template>
    <picture>
      {{#each this.sourcesSorted as |s|}}
        <source srcset={{s.srcset}} type={{s.mimeType}} sizes={{s.sizes}} />
      {{/each}}
      <img
        {{! set loading before src, otherwise FF will always load eagerly! }}
        loading="lazy"
        src={{this.src}}
        width={{this.width}}
        height={{this.height}}
        class={{this.classNames}}
        decoding="async"
        ...attributes
        data-ri-bh={{this.blurhashMeta.hash}}
        data-ri-bh-w={{this.blurhashMeta.width}}
        data-ri-bh-h={{this.blurhashMeta.height}}
        data-ri-th={{this.thumbhashMeta.hash}}
        {{style
          (if
            this.showLqipHash
            (hash
              background-image=this.lqipHashProvider.imageUrl
              background-size="cover"
            )
          )
        }}
        {{on "load" this.onLoad}}
      />
    </picture>
  </template>
}
