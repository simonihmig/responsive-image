import { defineConfig } from 'vitest/config';
import { basename, dirname, join } from 'node:path';

import packageJson from './package.json';

function viteMajor() {
  return parseInt(packageJson.devDependencies.vite.split('.').at(0) ?? '', 10);
}

export default defineConfig({
  test: {
    testTimeout: 60000,
    resolveSnapshotPath(testPath, snapExtension) {
      const versionSpecificPath = viteMajor() === 8 ? `v8` : 'other';

      return join(
        'tests',
        '__snapshots__',
        versionSpecificPath,
        basename(testPath) + snapExtension,
      );
    },
  },
});
