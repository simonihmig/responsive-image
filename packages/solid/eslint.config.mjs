import { base, browser, nodeESM } from '@responsive-image/internals/eslint';

export default [
  {
    // tests-v2 has its own lockfile and dependencies (Solid 2.x) installable
    // via a package manager other than pnpm, so its files are not linted here.
    ignores: ['tests-v2/**'],
  },
  ...base,
  ...browser.map((c) => ({
    ...c,
    files: ['src/**/*'],
  })),
  ...nodeESM.map((c) => ({
    ...c,
    files: ['eslint.config.mjs', 'rollup.config.mjs', 'vitest.config.ts'],
  })),
];
