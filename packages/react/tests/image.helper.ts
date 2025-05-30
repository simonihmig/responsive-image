export function getImg(el: HTMLElement): HTMLImageElement {
  const imgEl =
    el instanceof HTMLImageElement
      ? el
      : (el.querySelector('img') ?? el.shadowRoot?.querySelector('img'));

  if (!imgEl) {
    throw new Error('No <img> found');
  }

  return imgEl;
}

export async function trigger(el: HTMLElement) {
  const fakeEvent = new Event('load');
  getImg(el).dispatchEvent(fakeEvent);
}
