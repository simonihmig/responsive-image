#!/usr/bin/env node

// Run the Solid test suite against Solid v2. The v2 dependencies are only
// installed for this run: the `solid-v2` scenario is applied to package.json
// and both package.json and the lockfile are restored afterwards.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const solidDir = resolve(root, 'packages/solid');
const pkgPath = resolve(solidDir, 'package.json');
const lockPath = resolve(root, 'pnpm-lock.yaml');

const pkg = readFileSync(pkgPath, 'utf8');
const lock = readFileSync(lockPath, 'utf8');

const run = (command, cwd) => execSync(command, { cwd, stdio: 'inherit' });

try {
  run(
    'node ../../scripts/try.mjs --config ../../.try.mjs apply solid-v2',
    solidDir,
  );
  run('pnpm install --no-frozen-lockfile', root);
  run('pnpm test.vitest', solidDir);
  run('pnpm test.vitest:server', solidDir);
} finally {
  writeFileSync(pkgPath, pkg);
  writeFileSync(lockPath, lock);
  run('pnpm install', root);
}
