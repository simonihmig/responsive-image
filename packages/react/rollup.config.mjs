import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';
import ts from 'typescript';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
  },

  plugins: [
    babel({
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
    nodeResolve(),
    externals(),
    addon.keepAssets(['**/*.css']),
    {
      name: 'ts',
      buildEnd() {
        const program = ts.createProgram(['src/index.tsx'], {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          jsx: ts.JsxEmit.React,
          allowImportingTsExtensions: true,
          rewriteRelativeImportExtensions: true,
          outDir: 'dist',
          declarationDir: 'dist',
          declaration: true,
        });

        program.emit();
      },
    },
  ],
};
