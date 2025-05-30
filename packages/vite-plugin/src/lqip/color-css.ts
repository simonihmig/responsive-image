import {
  getPathname,
  parseQuery,
  parseURL,
} from '@responsive-image/build-utils';
import sharp from 'sharp';

import type { Options } from '../types';
import type { Plugin } from 'vite';

export const name = 'responsive-image/lqip/color-css';

export default function lqipColorCssPlugin(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name,
    resolveId(source) {
      const { _plugin } = parseQuery(parseURL(source).searchParams);

      if (_plugin !== name) {
        return null;
      }

      // return the same module id to make vite think this file exists and is a .css file
      // we will load the actually existing file without .css in the load hook
      return source;
    },
    async load(id) {
      const { className, inline, _plugin } = parseQuery(
        parseURL(id).searchParams,
      );

      if (_plugin !== name) {
        return;
      }

      const originalFile = getPathname(id).replace(/\.(css|xyz)$/, '');
      const file = await this.resolve(originalFile);
      const image = sharp(file?.id);
      const { dominant } = await image.stats();
      const colorHex =
        dominant.r.toString(16).padStart(2, '0') +
        dominant.g.toString(16).padStart(2, '0') +
        dominant.b.toString(16).padStart(2, '0');
      const color = '#' + colorHex;

      return inline
        ? `export default ${JSON.stringify({ 'background-color': color })}`
        : `.${className} { background-color: ${color}; }`;
    },
  };
}
