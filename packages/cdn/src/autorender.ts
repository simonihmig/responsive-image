import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

export interface AutorenderConfig {
  /**
   * Delivery domain that serves your transformed images,
   * e.g. `assets.autorender.io`.
   */
  domain: string;
  /**
   * Public workspace ID that routes the request, e.g. `wB5HrlVhGq`.
   * It is part of the delivery URL and is not a secret.
   */
  workspace: string;
}

export interface AutorenderOptions extends CoreOptions {
  /**
   * Extra Autorender transform tokens applied verbatim, e.g.
   * `['e_sharpen', 'br_16']`. See the transformation reference for the
   * full token vocabulary.
   */
  transforms?: string[];
}

const ABSOLUTE_URL_RE = /^https?:\/\//i;

function normalizeSrc(src: string): string {
  const normalized = src.trim();
  return normalized[0] === '/' ? normalized.slice(1) : normalized;
}

export function autorender(
  image: string,
  options: AutorenderOptions = {},
): ImageData {
  const config = getConfig<Config>('cdn')?.autorender;
  const domain = config?.domain;
  const workspace = config?.workspace;
  assert(
    'domain must be set for the autorender provider!',
    typeof domain === 'string',
  );
  assert(
    'workspace must be set for the autorender provider!',
    typeof workspace === 'string',
  );
  assert(
    'absolute URLs are not supported by the autorender provider!',
    !ABSOLUTE_URL_RE.test(image.trim()),
  );

  const src = normalizeSrc(image);

  const imageData: ImageData = {
    imageTypes: options.formats ?? 'auto',
    imageUrlFor(width: number, type: ImageUrlForType = 'jpeg'): string {
      const tokens = [...(options.transforms ?? [])];

      tokens.push(`w_${width}`);

      // Autorender accepts `f_jpeg` directly, so the format name maps 1:1.
      // `auto` emits `f_auto`, letting Autorender negotiate from the
      // Accept header instead of pinning a single format.
      tokens.push(`f_${type}`);

      if (options.quality) {
        tokens.push(`q_${options.quality}`);
      }

      return `https://${domain}/${workspace}/${tokens.join(',')}/${src}`;
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
