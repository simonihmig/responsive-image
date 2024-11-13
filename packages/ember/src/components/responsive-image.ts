import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  env,
  getDestinationWidthBySize,
  isLqipBlurhash,
} from '@responsive-image/core';
import { TrackedAsyncData } from 'ember-async-data';
import type {
  ImageType,
  LqipBlurhash,
  ImageData,
} from '@responsive-image/core';
import type Owner from '@ember/owner';

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

  @tracked
  isRendered = false;

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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    // We *must not* set the src attribute before the <img> is actually rendered, and a child of <picture>
    // Otherwise some browsers (FF, Safari) will eagerly load it, although the image isn't the one the browser
    // should load given the other source/srcset variants. Also prevents native lazy loading.
    if (!this.isRendered && typeof FastBoot === 'undefined') {
      return undefined;
    }

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

  get showLqipBlurhash(): boolean {
    return (
      !this.isLoaded &&
      isLqipBlurhash(this.args.src.lqip) &&
      this.blurhashScript.isResolved
    );
  }

  get blurhashMeta(): LqipBlurhash | undefined {
    return isLqipBlurhash(this.args.src.lqip) ? this.args.src.lqip : undefined;
  }

  @cached
  get blurhashScript() {
    const promise = import('@responsive-image/core/blurhash/decode');
    return new TrackedAsyncData(promise);
  }

  get lqipBlurhash(): string | undefined {
    if (
      !isLqipBlurhash(this.args.src.lqip) ||
      !this.blurhashScript.isResolved
    ) {
      return undefined;
    }

    const { hash, width, height } = this.args.src.lqip;
    const uri = this.blurhashScript.value.decode2url(hash, width, height);

    return `url("${uri}")`;
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
