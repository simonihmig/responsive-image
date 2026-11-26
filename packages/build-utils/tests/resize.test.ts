import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { generateResizedImage, getCacheFilename } from '../src';

import type { ImageLoaderChainedResult } from '../src';
import type { ImageConfig } from 'imagetools-core';

function createInput(): ImageLoaderChainedResult {
  return {
    sharp: sharp({
      create: {
        width: 16,
        height: 16,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    }),
    hash: 'test-hash',
    imports: [],
  } as unknown as ImageLoaderChainedResult;
}

const config: ImageConfig = { w: '640', format: 'jpeg' };

describe('generateResizedImage', () => {
  let cacheDir: string;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'responsive-image-test-'));
  });

  afterEach(async () => {
    await rm(cacheDir, { recursive: true, force: true });
  });

  test('returns a valid image and populates the cache', async () => {
    const input = createInput();
    const { data } = await generateResizedImage(input, config, {
      cache: true,
      cacheDir,
    });

    const buffer = await data();
    const metadata = await sharp(buffer).metadata();

    expect(metadata.format).toBe('jpeg');

    const cacheFile = getCacheFilename(input, config, 'jpeg', cacheDir);
    expect((await stat(cacheFile)).size).toBeGreaterThan(0);
  });

  test('ignores empty cache files', async () => {
    const input = createInput();
    const cacheFile = getCacheFilename(input, config, 'jpeg', cacheDir);

    await mkdir(cacheDir, { recursive: true });
    await writeFile(cacheFile, '');

    const { data } = await generateResizedImage(input, config, {
      cache: true,
      cacheDir,
    });

    const buffer = await data();

    expect(buffer.length).toBeGreaterThan(0);
    expect((await readFile(cacheFile)).length).toBeGreaterThan(0);
  });

  test('does not leave temporary files behind', async () => {
    const input = createInput();
    const { data } = await generateResizedImage(input, config, {
      cache: true,
      cacheDir,
    });

    await data();

    expect(await readdir(cacheDir)).toEqual([
      basename(getCacheFilename(input, config, 'jpeg', cacheDir)),
    ]);
  });

  test('generates valid images for concurrent requests sharing a cache entry', async () => {
    // Mimics multiple modules importing the same image with the same
    // configuration, whose transforms run concurrently
    const inputs = Array.from({ length: 4 }, () => createInput());

    const results = await Promise.all(
      inputs.map((input) =>
        generateResizedImage(input, config, { cache: true, cacheDir }),
      ),
    );

    const buffers = await Promise.all(results.map(({ data }) => data()));

    for (const buffer of buffers) {
      expect(buffer.length).toBeGreaterThan(0);
      expect((await sharp(buffer).metadata()).format).toBe('jpeg');
    }

    expect(await readdir(cacheDir)).toEqual([
      basename(getCacheFilename(inputs[0], config, 'jpeg', cacheDir)),
    ]);
  });
});
