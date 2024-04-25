import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: {
    dir: './dist',
  },

  plugins: [
    babel(),

    // Copy Readme and License into published package
    copy({
      targets: [
        // { src: '../../README.md', dest: '.' },
        { src: '../../LICENSE.md', dest: '.' },
      ],
    }),
  ],
};
