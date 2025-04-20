import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { build } from 'vite';

import { setupPlugins } from '../src';

import type { Options } from '../src/types';
import type { OutputAsset, OutputChunk, RollupOutput } from 'rollup';
import type { Plugin } from 'vite';

const _dirname = dirname(fileURLToPath(import.meta.url));

function entryFile(source: string): Plugin {
  let id: string;

  return {
    name: 'test-entry',
    resolveId(source, importer) {
      if (source === 'entry.js') {
        id = join(dirname(importer || ''), 'entry.js');
        return id;
      }
    },
    load(_id) {
      if (_id === id)
        return {
          code: source,
          moduleSideEffects: 'no-treeshake',
        };
    },
  };
}

export interface CompileResult {
  source: string;
  assets: OutputAsset[];
}

export async function compile(
  image: string,
  options: Partial<Options> = {},
): Promise<CompileResult> {
  // we do we need the side-effect of console.log to not tree-shake our import, though we have moduleSideEffects: 'no-treeshake' in test-entry?
  const source = `import image from './${image}'; console.log(image);`;

  let bundle = (await build({
    root: join(_dirname, 'fixtures'),
    logLevel: 'warn',
    mode: 'development',
    build: {
      lib: {
        entry: 'index.js',
        formats: ['es'],
      },
      minify: false,
      write: false,
      modulePreload: { polyfill: false },
      rollupOptions: {
        external: (id) => id.startsWith('@responsive-image/'),
      },
    },
    plugins: [entryFile(source), setupPlugins(options)],
  })) as RollupOutput | RollupOutput[];

  if (Array.isArray(bundle)) {
    bundle = bundle[0];
  }

  const module = bundle.output.find((chunk): chunk is OutputChunk =>
    chunk.fileName.endsWith('.mjs'),
  );

  if (!module) {
    throw new Error('No js chunk found in test output');
  }

  const assets = bundle.output
    .filter((chunk): chunk is OutputAsset => chunk.type === 'asset')
    .toSorted((a, b) => a.fileName.localeCompare(b.fileName));

  return {
    source: module.code,
    assets,
  };
}
