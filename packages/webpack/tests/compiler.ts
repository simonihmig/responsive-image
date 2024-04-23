import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import {
  setupLoaders,
  type LoaderOptions,
} from '@ember-responsive-image/webpack';
import path, { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

export default function compiler(
  fixture: string,
  options: Partial<LoaderOptions> = {},
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
          test: /\.jpg$/,
          use: setupLoaders(options),
        },
      ],
    },
  });

  // @ts-expect-error type mismatch
  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem!.join = join.bind(path);

  return new Promise<webpack.Stats>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);
      if (!stats) return reject();
      if (stats.hasErrors()) return reject(stats.toJson().errors);

      resolve(stats);
    });
  });
}
