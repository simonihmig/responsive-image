import { createSignal } from 'solid-js';

import type { LqipHashProvider } from './types';
import type { LqipThumbhash } from '@responsive-image/core';

export class LqipThumbhashProvider implements LqipHashProvider {
  private script;

  constructor(private lqip: LqipThumbhash) {
    const [script, setScript] =
      createSignal<typeof import('@responsive-image/core/thumbhash/decode')>();
    this.script = script;

    // Allow lazy loading of dependency to make it pay as you go
    import('@responsive-image/core/thumbhash/decode').then(setScript);
  }

  get available() {
    return !!this.script();
  }

  get imageUrl() {
    const { hash } = this.lqip;
    const uri = this.script()?.decode2url(hash);

    return `url("${uri}")`;
  }
}
