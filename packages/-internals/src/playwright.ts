import { test, expect, type Locator } from '@playwright/test';

function getImage(
  locator: Locator,
  isShadowDom: boolean,
): { img: Locator; picture: Locator } {
  const img = isShadowDom ? locator.locator('img') : locator;
  const picture = isShadowDom
    ? locator.locator('picture')
    : locator.page().locator('picture').filter({ has: img });

  return { img, picture };
}

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

  test.describe('LQIP', () => {
    test('color', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-color"]'),
        isShadowDom,
      );

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
    });

    test('inline', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-inline"]'),
        isShadowDom,
      );

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
    });

    test('blurhash', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-blurhash"]'),
        isShadowDom,
      );

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
    });

    test('thumbhash', async ({ page }) => {
      await page.goto('/');

      const { img, picture } = getImage(
        page.locator('[data-test-local-image="fixed,lqip-thumbhash"]'),
        isShadowDom,
      );

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
    });
  });
}
