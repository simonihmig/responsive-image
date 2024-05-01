import type { CloudinaryConfig, ImgixConfig } from '@responsive-image/cdn';
import { setConfig, type EnvConfig } from '@responsive-image/core';
import { getOwnConfig } from '@embroider/macros';

interface AddonConfig {
  env: EnvConfig;
  cloudinary: CloudinaryConfig;
  imgix: ImgixConfig;
}

export function applyMacrosConfig(): void {
  const userConfig = getOwnConfig<Partial<AddonConfig>>();

  for (const [namespace, config] of Object.entries(userConfig)) {
    setConfig(namespace, config);
  }
}
