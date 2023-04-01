import typescript from 'rollup-plugin-ts';
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
      // compile TypeScript to latest JavaScript, including Babel transpilation
      typescript({
        transpiler: 'babel',
        browserslist: false,
        transpileOnly: true,
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
      // compile TypeScript to latest JavaScript, including Babel transpilation
      typescript({
        transpiler: 'babel',
        browserslist: false,
        transpileOnly: true,
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
