import typescript from 'rollup-plugin-ts';
import glob from 'glob';
import externals from 'rollup-plugin-node-externals';

export default {
  input: glob.sync('src/**/*.ts'),
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
  ],
};
