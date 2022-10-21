import '@glint/environment-ember-loose';
import '@ember-responsive-image/core/glint';
import type Helper from '@ember/component/helper';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'page-title': new () => Helper<{
      Args: { Positional: [string] };
      Return: void;
    }>;
    dump: new () => Helper<{
      Args: { Positional: [unknown] };
      Return: void;
    }>;
  }
}
