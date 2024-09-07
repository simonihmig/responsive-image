import sharp from 'sharp';
import type { Plugin } from 'vite';
import type { Options } from '../types';
import { getPathname, parseQuery, parseURL } from '../utils';

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

      return source;
      // return source.replace(/\.css\?/, '?');
    },
    async load(id) {
      const { className, _plugin } = parseQuery(parseURL(id).searchParams);

      if (_plugin !== name) {
        return;
      }

      if (typeof className !== 'string') {
        throw new Error('Missing className');
      }

      const file = getPathname(id).replace(/\.css$/, '');
      const image = sharp(file);
      const { dominant } = await image.stats();
      const colorHex =
        dominant.r.toString(16) +
        dominant.g.toString(16) +
        dominant.b.toString(16);
      const color = '#' + colorHex;

      const cssRule = `.${className} { background-color: ${color}; }`;

      return cssRule;
    },
  };
}
