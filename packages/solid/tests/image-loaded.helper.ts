export function imageLoaded() {
  let resolve: (v: unknown) => void;
  let reject: (e: unknown) => void;
  const loaded = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const onload = (el: HTMLElement) => {
    const imgEl = el.querySelector('img');
    if (!imgEl) {
      throw new Error('No <img> element found');
    }

    if (imgEl.complete) {
      resolve(undefined);
    } else {
      imgEl.addEventListener(
        'load',
        () => {
          setTimeout(resolve, 0);
        },
        { once: true },
      );
      imgEl.addEventListener(
        'error',
        (e) => {
          console.error(e.message);
          reject(e);
        },
        { once: true },
      );
    }
  };

  return { onload, loaded };
}
