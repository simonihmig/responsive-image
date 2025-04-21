import type { Locator, Page } from '@playwright/test';

export async function delayImageLoading(page: Page) {
  let load: () => void = () => {
    throw new Error('load helper was not assigned properly');
  };
  let promise: Promise<unknown>;

  await page.route('**/*.{png,jpg,webp,avif}', async (route) => {
    if (!promise) {
      const p = new Promise((r) => (load = () => r(undefined)));
      promise = p;
    }
    await promise;
    await route.continue();
  });

  return {
    load() {
      load();
    },
  };
}
export function getImage(
  locator: Locator,
  isShadowDom: boolean,
): { img: Locator; picture: Locator } {
  const img = isShadowDom ? locator.locator('img') : locator;
  const picture = isShadowDom
    ? locator.locator('picture')
    : locator.page().locator('picture').filter({ has: img });

  return { img, picture };
}
