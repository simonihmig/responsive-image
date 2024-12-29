import type { LqipThumbhash } from '@responsive-image/core';
import type { LqipHashProvider } from './types';
import { createResource } from 'solid-js';

export class LqipThumbhashProvider implements LqipHashProvider {
  private script;
  constructor(private lqip: LqipThumbhash) {
    // Allow lazy loading of dependency to make it pay as you go
    const [script] = createResource(
      () => import('@responsive-image/core/thumbhash/decode'),
    );

    this.script = script;
  }

  get available() {
    return !this.script.loading && !this.script.error;
  }

  get imageUrl() {
    const { hash } = this.lqip;
    const uri = this.script()?.decode2url(hash);

    return `url("${uri}")`;
  }
}
