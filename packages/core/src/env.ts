import { getConfig } from './config.ts';
import type { Env } from './types';

export interface EnvConfig {
  deviceWidths?: number[];
}

const screenWidth = typeof screen !== 'undefined' ? screen.width : 320;
const devicePixelRatio =
  typeof window !== 'undefined' ? (window?.devicePixelRatio ?? 1) : 1;
const physicalWidth = screenWidth * devicePixelRatio;
const deviceWidths = getConfig<EnvConfig>('env')?.deviceWidths ?? [
  640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

export const env: Env = {
  screenWidth,
  physicalWidth,
  devicePixelRatio,
  deviceWidths,
};

export function getDestinationWidthBySize(size = 100): number {
  const factor = size / 100;

  return physicalWidth * factor;
}
