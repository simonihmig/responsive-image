// Regression check: bundling ResponsiveImage must not retain unused solid-js
// code. A namespace import (`import * as Solid from 'solid-js'`) forces the
// bundler to keep the whole solid-js export surface, which every page of a
// consumer app then pays for in its shared vendor chunk.
//
// Bundles the built package (run `pnpm build` first) with Vite, exporting only
// `ResponsiveImage`, and compares it with a reference bundle that uses the
// solid-js runtime pieces ResponsiveImage needs. Runs against whichever Solid
// major is installed (v1 by default, v2 via the `solid-v2` try scenario).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { build } from 'vite';

const { default: solidPkg } = await import('solid-js/package.json', {
  with: { type: 'json' },
});
const isSolid2 = solidPkg.version.startsWith('2.');

const pluginModule = await import(
  isSolid2 ? '@solidjs/vite-plugin' : 'vite-plugin-solid'
);
const solidPlugin =
  typeof pluginModule === 'function' ? pluginModule : pluginModule.default;

const dist = (file) =>
  fileURLToPath(new URL(`../dist/${file}`, import.meta.url));

// v1 consumers may resolve either entry. v2 consumers resolve the `solid`
// export condition (index.jsx); index.js is compiled for the v1 runtime.
const entries = isSolid2
  ? [['index.jsx', 'responsive-image.jsx']]
  : [
      ['index.js', 'index.js'],
      ['index.jsx', 'responsive-image.jsx'],
    ];

// Uses the same solid-js primitives and a similar template as ResponsiveImage,
// so it pulls in the same runtime but nothing beyond it.
const reference = `
import { createSignal, Show, untrack } from 'solid-js';
export const Reference = (props) => {
  const [loaded, setLoaded] = createSignal();
  return (
    <Show when={props.src} keyed={untrack(() => !!props.src) && false}>
      <picture>
        <img class={loaded() ? 'a' : 'b'} {...props} onLoad={() => setLoaded(props.src)} />
      </picture>
    </Show>
  );
};
`;

// Virtual (never written) module, named .jsx so the Solid plugin compiles it.
const entryId = fileURLToPath(
  new URL('tree-shaking-entry.jsx', import.meta.url),
);

async function bundle(code) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    mode: 'production',
    plugins: [
      solidPlugin(isSolid2 ? {} : { hot: false, dev: false }),
      {
        name: 'tree-shaking-entry',
        resolveId: (source) =>
          source.endsWith('tree-shaking-entry.jsx') ? entryId : undefined,
        load: (id) => (id === entryId ? code : undefined),
      },
    ],
    build: {
      write: false,
      minify: true,
      sourcemap: true,
      lib: { entry: entryId, formats: ['es'], fileName: 'bundle' },
    },
  });
  const output = (Array.isArray(result) ? result : [result]).flatMap(
    (r) => r.output,
  );
  const chunk = output.find((o) => o.type === 'chunk' && o.isEntry);
  return {
    min: Buffer.byteLength(chunk.code),
    gzip: gzipSync(chunk.code).length,
    sources: chunk.map?.sources ?? [],
  };
}

const format = ({ min, gzip }) => `${min} B min / ${gzip} B gzip`;

// ResponsiveImage adds ~2-3 KB on top of the reference; a retained solid-js
// namespace adds tens of KB.
const budget = 8 * 1024;

const ref = await bundle(reference);
let failed = false;

console.log(`solid-js ${solidPkg.version}`);
console.log(`  reference:                 ${format(ref)}`);

for (const [entry, module] of entries) {
  const actual = await bundle(
    `export { ResponsiveImage } from ${JSON.stringify(dist(entry))};`,
  );
  console.log(`  dist/${entry.padEnd(9)} ResponsiveImage: ${format(actual)}`);

  const problems = [];

  if (
    /import\s*\*\s*as\s+\w+\s+from\s*["']solid-js["']/.test(
      readFileSync(dist(module), 'utf8'),
    )
  ) {
    problems.push(`dist/${module} imports the solid-js namespace`);
  }

  // Solid v2 ships its runtime as many modules (e.g. the unused
  // `@solidjs/signals/dist/prod/store/*`), so modules missing from the
  // reference reveal retained code directly.
  const extra = actual.sources.filter(
    (s) => /\/(solid-js|@solidjs\/[^/]+)\//.test(s) && !ref.sources.includes(s),
  );
  if (extra.length > 0) {
    problems.push(
      `bundle retains solid modules unused by the reference:\n      ${extra.join('\n      ')}`,
    );
  }

  if (actual.min - ref.min > budget) {
    problems.push(
      `bundle is ${actual.min - ref.min} B larger than the reference (budget ${budget} B)`,
    );
  }

  for (const problem of problems) console.error(`    ✗ ${problem}`);
  failed ||= problems.length > 0;
}

if (failed) {
  console.error('ResponsiveImage retains unused solid-js code.');
  process.exitCode = 1;
} else {
  console.log('✓ no unused solid-js code retained');
}
