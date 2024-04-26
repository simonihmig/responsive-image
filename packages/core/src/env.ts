// import { config } from '../config.ts';

import type { Env } from './types';

const screenWidth = typeof screen !== 'undefined' ? screen.width : 320;
const devicePixelRatio = window?.devicePixelRatio ?? 1;
const physicalWidth = screenWidth * devicePixelRatio;
// TODO: figure out user config
// const deviceWidths =  config.deviceWidths;
const deviceWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

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
