import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import externals from 'rollup-plugin-node-externals';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  // Rollup config for webpack loader
  {
    input: ['src/webpack.ts'],
    output: {
      dir: './dist',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: [
      externals(),
      babel({
        extensions: ['.js', '.gjs', '.ts', '.gts'],
        babelHelpers: 'bundled',
      }),
    ],
  },
  // Rollup config for blurhash public script
  {
    input: ['src/index.ts'],
    output: {
      dir: './dist',
      format: 'iife',
    },
    plugins: [
      nodeResolve(),
      babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
      }),
      terser(),

      // Copy Readme and License into published package
      copy({
        targets: [
          // { src: '../../README.md', dest: '.' },
          { src: '../../LICENSE.md', dest: '.' },
        ],
      }),
    ],
  },
];
