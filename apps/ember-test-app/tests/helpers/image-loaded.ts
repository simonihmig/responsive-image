import { settled } from '@ember/test-helpers';
import { modifier } from 'ember-modifier';

export function imageLoaded() {
  let resolve: (v: unknown) => void;
  let reject: (e: unknown) => void;
  const loaded = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }).then(settled);

  const onload = modifier((el: HTMLImageElement) => {
    if (el.complete) {
      resolve(undefined);
    } else {
      el.addEventListener(
        'load',
        () => {
          setTimeout(resolve, 0);
        },
        { once: true },
      );
      el.addEventListener(
        'error',
        (e) => {
          console.error(e.message);
          reject(e);
        },
        { once: true },
      );
    }
  });

  return { onload, loaded };
}
