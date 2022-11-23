import typescript from 'rollup-plugin-ts';
import { createRequire } from 'node:module';
import glob from 'glob';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: glob.sync('src/**/*.ts'),
  external: Object.keys(pkg.dependencies),
  output: {
    dir: './dist',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    // compile TypeScript to latest JavaScript, including Babel transpilation
    typescript({
      transpiler: 'babel',
      browserslist: false,
      transpileOnly: false,
    }),
  ],
};
