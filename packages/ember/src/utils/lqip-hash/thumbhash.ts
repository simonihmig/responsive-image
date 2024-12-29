import type { LqipThumbhash } from '@responsive-image/core';
import type { LqipHashProvider } from './types';
import { TrackedAsyncData } from 'ember-async-data';
import { assert } from '@ember/debug';

export class LqipThumbhashProvider implements LqipHashProvider {
  private script;
  constructor(private lqip: LqipThumbhash) {
    // Allow lazy loading of dependency to make it pay as you go
    const promise = import('@responsive-image/core/thumbhash/decode');
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

    const { hash } = this.lqip;
    const uri = this.script.value.decode2url(hash);

    return `url("${uri}")`;
  }
}
