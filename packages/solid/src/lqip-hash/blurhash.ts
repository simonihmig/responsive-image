import { createSignal } from 'solid-js';

import type { LqipHashProvider } from './types';
import type { LqipBlurhash } from '@responsive-image/core';

export class LqipBlurhashProvider implements LqipHashProvider {
  private script;

  constructor(private lqip: LqipBlurhash) {
    const [script, setScript] =
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      createSignal<typeof import('@responsive-image/core/blurhash/decode')>();
    this.script = script;

    import('@responsive-image/core/blurhash/decode').then(setScript);
  }

  get available() {
    return !!this.script();
  }

  get imageUrl() {
    const { hash, width, height } = this.lqip;
    const uri = this.script()?.decode2url(hash, width, height);

    return `url("${uri}")`;
  }
}
