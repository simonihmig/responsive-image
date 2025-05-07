import { test, expect } from '@playwright/test';

import { delayImageLoading, getImage } from './helpers';

interface TestOptions {
  isShadowDom?: boolean;
}

export function runTests({ isShadowDom = false }: TestOptions = {}) {
  const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const imageTypes = [
    ['jpeg', 'jpg'],
    ['webp', 'webp'],
  ];

  test('responsive layout', async ({ page }) => {
    await page.goto('/');

    const { img, picture } = getImage(
      page.locator('[data-test-local-image="responsive"]'),
      isShadowDom,
    );

    await expect(img).toHaveClass(/ri-responsive/);
    await expect(img).toHaveAttribute(
      'src',
      /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
    );
    await expect(img).toHaveScreenshot();

    for (const [type, ext] of imageTypes) {
      for (const size of sizes) {
        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of ${size}`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(
            `/assets/aurora-${size}w([-.][a-zA-Z0-9-_]+)?.${ext} ${size}w`,
          ),
        );
      }
    }
  });

  test('fixed layout', async ({ page }) => {
    await page.goto('/');

    const { img, picture } = getImage(
      page.locator('[data-test-local-image="fixed"]'),
      isShadowDom,
    );

    await expect(img).toHaveClass(/ri-fixed/);
    await expect(img).toHaveAttribute(
      'src',
      /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
    );
    await expect(img).toHaveAttribute('width', '320');
    await expect(img).toHaveAttribute('height', '213');
    await expect(img).toHaveScreenshot();

    for (const [type, ext] of imageTypes) {
      await expect(
        picture.locator(`source[type="image/${type}"]`),
        `has ${type} with a width of 1x`,
      ).toHaveAttribute(
        'srcset',
        new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
      );

      await expect(
        picture.locator(`source[type="image/${type}"]`),
        `has ${type} with a width of 2x`,
      ).toHaveAttribute(
        'srcset',
        new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
      );
    }
  });

  test('fixed layout w/ aspect', async ({ page }) => {
    await page.goto('/');

    const { img, picture } = getImage(
      page.locator('[data-test-local-image="fixed,aspect"]'),
      isShadowDom,
    );

    await expect(img).toHaveClass(/ri-fixed/);
    await expect(img).toHaveAttribute(
      'src',
      /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
    );
    await expect(img).toHaveAttribute('width', '320');
    await expect(img).toHaveAttribute('height', '480');
    await expect(img).toHaveScreenshot();

    for (const [type, ext] of imageTypes) {
      await expect(
        picture.locator(`source[type="image/${type}"]`),
        `has ${type} with a width of 1x`,
      ).toHaveAttribute(
        'srcset',
        new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
      );

      await expect(
        picture.locator(`source[type="image/${type}"]`),
        `has ${type} with a width of 2x`,
      ).toHaveAttribute(
        'srcset',
        new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
      );
    }
  });

  // LQIP is broken in web components: https://github.com/simonihmig/responsive-image/issues/1238
  (isShadowDom ? test.describe.skip : test.describe)('LQIP', () => {
    let loadImages: () => void;

    test.beforeEach(async ({ page }) => {
      const { load } = await delayImageLoading(page);
      loadImages = load;
    });

    test('color', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-color"]'),
        isShadowDom,
      );

      await expect(img).toHaveJSProperty('complete', false);
      await expect(img).toHaveScreenshot();

      await expect(img).toHaveClass(/ri-fixed/);
      await expect(img).toHaveAttribute(
        'src',
        /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
      );

      for (const [type, ext] of imageTypes) {
        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 1x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
        );

        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 2x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
        );
      }

      loadImages();

      await expect(img).toHaveJSProperty('complete', true);
      await expect(img).toHaveScreenshot();
    });

    test('inline', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-inline"]'),
        isShadowDom,
      );

      await expect(img).toHaveJSProperty('complete', false);
      await expect(img).toHaveScreenshot();

      await expect(img).toHaveClass(/ri-fixed/);
      await expect(img).toHaveAttribute(
        'src',
        /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
      );

      for (const [type, ext] of imageTypes) {
        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 1x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
        );

        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 2x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
        );
      }

      loadImages();

      await expect(img).toHaveJSProperty('complete', true);
      await expect(img).toHaveScreenshot();
    });

    test('blurhash', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-blurhash"]'),
        isShadowDom,
      );

      await expect(img).toHaveJSProperty('complete', false);
      await expect(img).toHaveScreenshot();

      await expect(img).toHaveClass(/ri-fixed/);
      await expect(img).toHaveAttribute(
        'src',
        /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
      );
      await expect(img).toHaveAttribute(
        'data-ri-lqip',
        'bh:5:3:M53T;oR8D8y.t2M.oxylRoRlHYniyBRQXR',
      );

      for (const [type, ext] of imageTypes) {
        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 1x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
        );

        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 2x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
        );
      }

      loadImages();

      await expect(img).toHaveJSProperty('complete', true);
      await expect(img).toHaveScreenshot();
    });

    test('thumbhash', async ({ page }) => {
      await page.goto('/', { waitUntil: 'commit' });

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-thumbhash"]'),
        isShadowDom,
      );

      await expect(img).toHaveJSProperty('complete', false);
      await expect(img).toHaveScreenshot();

      await expect(img).toHaveClass(/ri-fixed/);
      await expect(img).toHaveAttribute(
        'src',
        /assets\/aurora-\d+w([-.][a-zA-Z0-9-_]+)?\.jpg/,
      );
      await expect(img).toHaveAttribute(
        'data-ri-lqip',
        'th:jJcFFYI1fIWHe4dweXlYeUaAmWj3',
      );

      for (const [type, ext] of imageTypes) {
        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 1x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 1x`),
        );

        await expect(
          picture.locator(`source[type="image/${type}"]`),
          `has ${type} with a width of 2x`,
        ).toHaveAttribute(
          'srcset',
          new RegExp(`/assets/aurora-640w([-.][a-zA-Z0-9-_]+)?.${ext} 2x`),
        );
      }

      loadImages();

      await expect(img).toHaveJSProperty('complete', true);
      await expect(img).toHaveScreenshot();
    });
  });
}
