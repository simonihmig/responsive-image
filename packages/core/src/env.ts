import { getConfig } from './config.ts';

import type { Env, EnvConfig } from './types';

export const env: Env = {
  get screenWidth(): number {
    return typeof screen !== 'undefined' ? screen.width : 320;
  },
  get physicalWidth(): number {
    return env.screenWidth * env.devicePixelRatio;
  },
  get devicePixelRatio(): number {
    return typeof window !== 'undefined' ? (window?.devicePixelRatio ?? 1) : 1;
  },
  get deviceWidths(): number[] {
    return (
      getConfig<EnvConfig>('env')?.deviceWidths ?? [
        640, 750, 828, 1080, 1200, 1920, 2048, 3840,
      ]
    );
  },
};

export function getDestinationWidthBySize(size = 100): number {
  const factor = size / 100;

  return env.physicalWidth * factor;
}
