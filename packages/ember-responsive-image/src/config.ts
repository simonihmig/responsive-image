import { getOwnConfig } from '@embroider/macros';

export interface AddonConfig {
  deviceWidths: number[];
}

export const userConfig = getOwnConfig<Partial<AddonConfig>>();

export const defaultConfig: AddonConfig = {
  deviceWidths: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
};

export const config: AddonConfig = { ...defaultConfig, ...userConfig };
