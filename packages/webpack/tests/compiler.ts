import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { setupLoaders, type LoaderOptions } from '@responsive-image/webpack';
import path, { join, resolve } from 'path';

export default function compiler(
  fixture: string,
  _dirname: string,
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
          resourceQuery: /responsive/,
          use: setupLoaders(options),
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
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
