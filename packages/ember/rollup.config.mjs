import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';
// import externals from 'rollup-plugin-node-externals';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default [
  // ember addon
  {
    // This provides defaults that work well alongside `publicEntrypoints` below.
    // You can augment this if you need to.
    output: addon.output(),

    plugins: [
      // These are the modules that users should be able to import from your
      // addon. Anything not listed here may get optimized away.
      addon.publicEntrypoints([
        'components/**/*.js',
        'helpers/**/*.js',
        'services/**/*.js',
        'initializers/*.js',
        'index.js',
        'utils/match.js',
        'template-registry.js',
      ]),

      // These are the modules that should get reexported into the traditional
      // "app" tree. Things in here should also be in publicEntrypoints above, but
      // not everything in publicEntrypoints necessarily needs to go here.
      addon.appReexports([
        'components/**/*.js',
        'helpers/**/*.js',
        'services/**/*.js',
        'initializers/*.js',
      ]),

      // This babel config should *not* apply presets or compile away ES modules.
      // It exists only to provide development niceties for you, like automatic
      // template colocation.
      //
      // By default, this will load the actual babel config from the file
      // babel.config.json.
      babel({
        extensions: ['.js', '.gjs', '.ts', '.gts'],
        babelHelpers: 'bundled',
      }),

      // Follow the V2 Addon rules about dependencies. Your code can import from
      // `dependencies` and `peerDependencies` as well as standard Ember-provided
      // package names.
      addon.dependencies(),

      // Ensure that standalone .hbs files are properly integrated as Javascript.
      addon.hbs(),

      // Ensure that .gjs files are properly integrated as Javascript
      addon.gjs(),

      // Emit .d.ts declaration files
      addon.declarations('declarations'),

      // addons are allowed to contain imports of .css files, which we want rollup
      // to leave alone and keep in the published output.
      addon.keepAssets(['**/*.css']),

      // Remove leftover build artifacts when starting a new build.
      addon.clean(),

      // Copy Readme and License into published package
      copy({
        targets: [{ src: '../../LICENSE.md', dest: '.' }],
      }),
    ],
  },
  // Compile BlurHash/ThumbHash SSR support modules separately to expose them as public assets separate from the compiled addon source, to allow to load this in a SSR (FastBoot) environment ahead of the main bundle.
  // Note: this is only needed because of legacy output semantics in Ember's index.html. With input semantics in a Vite build, this shouldn't be needed, as
  // you should be able to import the modules directly and let the bundler figoure out the rest.
  {
    input: ['src/blurhash.ts', 'src/thumbhash.ts'],
    output: {
      dir: './dist',
    },
    plugins: [
      nodeResolve(),
      babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
  },
];
