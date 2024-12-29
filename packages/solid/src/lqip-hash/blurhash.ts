import type { LqipBlurhash } from '@responsive-image/core';
import type { LqipHashProvider } from './types';
import { createResource } from 'solid-js';

export class LqipBlurhashProvider implements LqipHashProvider {
  private script;
  constructor(private lqip: LqipBlurhash) {
    // Allow lazy loading of dependency to make it pay as you go
    const [script] = createResource(
      () => import('@responsive-image/core/blurhash/decode'),
    );

    this.script = script;
  }

  get available() {
    return !this.script.loading && !this.script.error;
  }

  get imageUrl() {
    const { hash, width, height } = this.lqip;
    const uri = this.script()?.decode2url(hash, width, height);

    return `url("${uri}")`;
  }
}
