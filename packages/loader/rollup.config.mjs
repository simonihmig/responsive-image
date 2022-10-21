import typescript from 'rollup-plugin-ts';

export default {
  input: 'src/index.ts',
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
