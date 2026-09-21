import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import {
  getClassNames,
  getHeight,
  getSources,
  getSourcesSorted,
  getSrc,
  getValueOrCallback,
  getWidth,
} from '@responsive-image/core';
import { modifier } from 'ember-modifier';
import style from 'ember-style-modifier';

import type Owner from '@ember/owner';
import type { ImageData, ImageSource } from '@responsive-image/core';

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

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentSignature> {
  @tracked
  loadedSrc?: ImageData;

  constructor(owner: Owner, args: ResponsiveImageComponentSignature['Args']) {
    super(owner, args);
    assert('No @src argument supplied for <ResponsiveImage>', args.src);
    assert(
      'Image paths as @src argument for <ResponsiveImage> are not supported anymore.',
      typeof args.src !== 'string',
    );
  }

  get isLoaded(): boolean {
    return this.loadedSrc === this.args.src;
  }

  get autoFormat(): boolean {
    return this.args.src.imageTypes === 'auto';
  }

  get sources(): ImageSource[] {
    return getSources(this.args);
  }

  get sourcesSorted(): ImageSource[] {
    return getSourcesSorted(this.sources);
  }

  get imgSrcset(): string | undefined {
    return this.sources[0]?.srcset;
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    return getSrc(this.args);
  }

  @cached
  get width(): number | undefined {
    return getWidth(this.args);
  }

  get height(): number | undefined {
    return getHeight(this.args);
  }

  get classNames(): string {
    return getClassNames(this.args, this.isLoaded);
  }

  get styles(): Record<string, string | undefined> {
    if (this.isLoaded) return {};

    return getValueOrCallback(this.args.src.lqip?.inlineStyles) ?? {};
  }

  get keyedSrcArray(): [unknown] {
    // Ember only supports "keying" (to force DOM recreation) with the each helper, so we create an artificial length=1 array
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    return [this.args.src.lqip ? this.args.src : null];
  }

  @action
  onLoad(): void {
    this.loadedSrc = this.args.src;
  }

  checkAlreadyLoaded = modifier((el: HTMLImageElement) => {
    if (el.complete) {
      this.loadedSrc = this.args.src;
    }
  });

  <template>
    {{#if this.autoFormat}}
      {{#each this.keyedSrcArray}}
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
          {{this.checkAlreadyLoaded}}
          {{on "load" this.onLoad}}
        />
      {{/each}}
    {{else}}
      <picture>
        {{#each this.sourcesSorted as |s|}}
          <source srcset={{s.srcset}} type={{s.mimeType}} sizes={{s.sizes}} />
        {{/each}}
        {{#each this.keyedSrcArray}}
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
            {{this.checkAlreadyLoaded}}
            {{on "load" this.onLoad}}
          />
        {{/each}}
      </picture>
    {{/if}}
  </template>
}
