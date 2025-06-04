import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { env, getDestinationWidthBySize, setConfig } from '../src';

import type { EnvConfig } from '../src';

describe('env', () => {
  beforeAll(() => {
    expect(
      globalThis.window,
      'these tests only run in node.js',
    ).toBeUndefined();
  });

  afterEach(() => {
    // reset any modifications
    setConfig<EnvConfig>('env', {});
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  describe('deviceWidths', () => {
    test('reads from config if available', () => {
      setConfig<EnvConfig>('env', { deviceWidths: [1, 2, 3] });
      expect(env.deviceWidths).toStrictEqual([1, 2, 3]);
    });

    test('has expected defaults', () => {
      expect(env.deviceWidths).toStrictEqual([
        640, 750, 828, 1080, 1200, 1920, 2048, 3840,
      ]);
    });
  });

  describe('screenWidth', () => {
    test('uses screen.width if available', () => {
      vi.stubGlobal('screen', { width: 800 });

      expect(env.screenWidth).toBe(800);
    });

    test('defaults to 320', () => {
      expect(env.screenWidth).toBe(320);
    });
  });

  describe('devicePixelRatio', () => {
    test('uses window.devicePixelRatio if available', () => {
      vi.stubGlobal('window', { devicePixelRatio: 2 });

      expect(env.devicePixelRatio).toBe(2);
    });

    test('defaults to 1', () => {
      expect(env.devicePixelRatio).toBe(1);
    });
  });

  describe('physicalWidth', () => {
    test('is the product of screenWidth and devicePixelRatio', () => {
      vi.stubGlobal('window', { devicePixelRatio: 2 });
      vi.stubGlobal('screen', { width: 800 });

      expect(env.physicalWidth).toBe(1600);
    });
  });

  describe('getDestinationWidthBySize', () => {
    test('calculates width based on given size and physicalWidth', () => {
      vi.spyOn(env, 'physicalWidth', 'get').mockReturnValue(640);

      expect(getDestinationWidthBySize()).toBe(640);
      expect(getDestinationWidthBySize(100)).toBe(640);
      expect(getDestinationWidthBySize(50)).toBe(320);
    });
  });
});
