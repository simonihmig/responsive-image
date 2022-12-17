import '@glint/environment-ember-loose';
import AddonRegistry from '../src/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export default interface Registry extends AddonRegistry {
    // add anything here
  }
}
