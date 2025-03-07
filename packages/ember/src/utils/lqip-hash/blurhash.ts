import { assert } from '@ember/debug';
import { TrackedAsyncData } from 'ember-async-data';

import type { LqipHashProvider } from './types';
import type { LqipBlurhash } from '@responsive-image/core';

export class LqipBlurhashProvider implements LqipHashProvider {
  private script;
  constructor(private lqip: LqipBlurhash) {
    // Allow lazy loading of dependency to make it pay as you go
    const promise = import('@responsive-image/core/blurhash/decode');
    this.script = new TrackedAsyncData(promise);
  }

  get available() {
    return this.script.isResolved;
  }

  get imageUrl() {
    assert(
      'Cannot access imageUrl when not available yet',
      this.script.isResolved,
    );

    const { hash, width, height } = this.lqip;
    const uri = this.script.value.decode2url(hash, width, height);

    return `url("${uri}")`;
  }
}
