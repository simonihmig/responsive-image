import { settled } from '@ember/test-helpers';
import { modifier } from 'ember-modifier';

export function imageLoaded() {
  let resolve: (v: unknown) => void;
  const loaded = new Promise((r) => {
    resolve = r;
  }).then(settled);

  const onload = modifier((el: HTMLImageElement) => {
    if (el.complete) {
      resolve(undefined);
    } else {
      el.addEventListener('load', () => setTimeout(resolve, 0), { once: true });
    }
  });

  return { onload, loaded };
}
