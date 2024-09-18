import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { setupLoaders } from '../src';
import path, { join, resolve } from 'path';
import type { Options } from '../src/types';

const defaultOptions: Partial<Options> = {
  // Don't use the hash part in tests, to prevent brittle tests when using snapshots
  name: '[name]-[width]w.[ext]',
};

export default function compiler(
  fixture: string,
  _dirname: string,
  options: Partial<Options> = {},
) {
  const compiler = webpack({
    context: _dirname,
    entry: `./${fixture}`,
    output: {
      path: resolve(_dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          resourceQuery: /responsive/,
          use: setupLoaders({ ...defaultOptions, ...options }),
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  });

  const fs = createFsFromVolume(new Volume());
  // @ts-expect-error type mismatch
  compiler.outputFileSystem = fs;
  compiler.outputFileSystem!.join = join.bind(path);

  return new Promise<{ stats: webpack.StatsCompilation; fs: typeof fs }>(
    (resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        if (!stats) return reject();
        if (stats.hasErrors()) return reject(stats.toJson().errors);

        resolve({
          stats: stats.toJson({
            source: true,
          }),
          fs,
        });
      });
    },
  );
}
