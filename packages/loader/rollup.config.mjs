import typescript from 'rollup-plugin-ts';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies),
  output: {
    dir: './dist',
    format: 'cjs',
    exports: 'default',
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
