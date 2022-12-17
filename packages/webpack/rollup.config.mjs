import typescript from 'rollup-plugin-ts';
import copy from 'rollup-plugin-copy';
import glob from 'glob';
import externals from 'rollup-plugin-node-externals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  input: Object.fromEntries(
    glob.sync('src/**/*.ts').map((file) => [
      // This remove `src/` as well as the file extension from each file, so e.g.
      // src/nested/foo.js becomes nested/foo
      path.relative(
        'src',
        file.slice(0, file.length - path.extname(file).length)
      ),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, import.meta.url)),
    ])
  ),
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
      transpileOnly: false,
    }),

    // Copy Readme and License into published package
    copy({
      targets: [
        // { src: '../../README.md', dest: '.' },
        { src: '../../LICENSE.md', dest: '.' },
      ],
    }),
  ],
};
