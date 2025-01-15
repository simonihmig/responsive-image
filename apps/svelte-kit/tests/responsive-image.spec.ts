import { test, expect } from '@playwright/test';

const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const imageTypes = [
  ['jpeg', 'jpg'],
  ['webp', 'webp'],
];

test('responsive layout', async ({ page }) => {
  await page.goto('/');

  const img = page.locator('[data-test-local-image="responsive"]');
  const picture = page.locator('picture').filter({ has: img });

  await expect(img).toHaveClass(/ri-responsive/);
  await expect(img).toHaveAttribute(
    'src',
    new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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

  const img = page.locator('[data-test-local-image="fixed"]');
  const picture = page.locator('picture').filter({ has: img });

  await expect(img).toHaveClass(/ri-fixed/);
  await expect(img).toHaveAttribute(
    'src',
    new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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

  const img = page.locator('[data-test-local-image="fixed,aspect"]');
  const picture = page.locator('picture').filter({ has: img });

  await expect(img).toHaveClass(/ri-fixed/);
  await expect(img).toHaveAttribute(
    'src',
    new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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

    const img = page.locator('[data-test-local-image="fixed,lqip-color"]');
    const picture = page.locator('picture').filter({ has: img });

    await expect(img).toHaveClass(/ri-fixed/);
    await expect(img).toHaveAttribute(
      'src',
      new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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

    const img = page.locator('[data-test-local-image="fixed,lqip-inline"]');
    const picture = page.locator('picture').filter({ has: img });

    await expect(img).toHaveClass(/ri-fixed/);
    await expect(img).toHaveAttribute(
      'src',
      new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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

    const img = page.locator('[data-test-local-image="fixed,lqip-blurhash"]');
    const picture = page.locator('picture').filter({ has: img });

    await expect(img).toHaveClass(/ri-fixed/);
    await expect(img).toHaveAttribute(
      'src',
      new RegExp(`/assets/aurora-[0-9]+w([-.][a-zA-Z0-9-_]+)?.jpg`),
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
