import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import {
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
} from '@responsive-image/core';
import style from 'ember-style-modifier';

import type Owner from '@ember/owner';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

import './responsive-image.css';

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
  type: ImageUrlForType;
  mimeType: string | undefined;
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

  get autoFormat(): boolean {
    return this.args.src.imageTypes === 'auto';
  }

  get layout(): Layout {
    return this.args.width === undefined && this.args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): ImageSource[] {
    const imageTypes = Array.isArray(this.args.src.imageTypes)
      ? this.args.src.imageTypes
      : [this.args.src.imageTypes];

    if (this.layout === Layout.RESPONSIVE) {
      return imageTypes.map((type) => {
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
          mimeType: type != 'auto' ? `image/${type}` : undefined,
        };
      });
    } else {
      const width = this.width;
      if (width === undefined) {
        return [];
      }

      return imageTypes.map((type) => {
        const sources: string[] = PIXEL_DENSITIES.map((density) => {
          const url = this.args.src.imageUrlFor(width * density, type)!;

          return `${url} ${density}x`;
        }).filter((source) => source !== undefined);

        return {
          srcset: sources.join(', '),
          type,
          mimeType: type != 'auto' ? `image/${type}` : undefined,
        };
      });
    }
  }

  get sourcesSorted(): ImageSource[] {
    return this.sources.sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
    );
  }

  get imgSrcset(): string | undefined {
    return this.sources[0]?.srcset;
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    const format = this.args.src.imageTypes === 'auto' ? 'auto' : undefined;
    return this.args.src.imageUrlFor(this.width ?? 640, format);
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
    const classNames = ['ri-img', `ri-${this.layout}`];
    const lqipClass = this.args.src.lqip?.class;
    if (lqipClass && !this.isLoaded) {
      classNames.push(getValueOrCallback(lqipClass));
    }

    return classNames.join(' ');
  }

  get styles(): Record<string, string | undefined> {
    if (this.isLoaded) return {};

    return getValueOrCallback(this.args.src.lqip?.inlineStyles) ?? {};
  }

  @action
  onLoad(): void {
    this.isLoaded = true;
  }

  <template>
    {{#if this.autoFormat}}
      <img
        {{! set loading before src, otherwise FF will always load eagerly! }}
        loading="lazy"
        srcset={{this.imgSrcset}}
        src={{this.src}}
        width={{this.width}}
        height={{this.height}}
        class={{this.classNames}}
        decoding="async"
        ...attributes
        data-ri-lqip={{@src.lqip.attribute}}
        {{style this.styles}}
        {{on "load" this.onLoad}}
      />
    {{else}}
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
          data-ri-lqip={{@src.lqip.attribute}}
          {{style this.styles}}
          {{on "load" this.onLoad}}
        />
      </picture>
    {{/if}}
  </template>
}
