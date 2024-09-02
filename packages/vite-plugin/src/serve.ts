import { Readable } from 'stream';
import type { Plugin } from 'vite';
import type { Options, ServedImageData } from './types';
import { getViteBasePath } from './utils';

export default function servePlugin(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userOptions: Partial<Options> = {},
): Plugin {
  let basePath: string;

  let getServedImageData: (url: string) => ServedImageData;

  return {
    name: 'responsive-image/serve',

    configResolved(config) {
      basePath = getViteBasePath(config);

      const parentName = 'responsive-image/export';
      const parentPlugin = config.plugins.find(
        (plugin) => plugin.name === parentName,
      );
      if (!parentPlugin) {
        throw new Error(`This plugin depends on the "${parentName}" plugin.`);
      }
      getServedImageData = parentPlugin.api.getServedImageData;
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith(basePath)) {
          let [, id] = req.url.split(basePath);
          id = decodeURI(id);

          const imageEntry = getServedImageData(id);

          if (!imageEntry) {
            return next(new Error(`No responsive image found for ID "${id}".`));
          }

          const { data, format } = imageEntry;

          res.setHeader('Content-Type', `image/${format}`);
          return Readable.from(await data()).pipe(res);
        }

        next();
      });
    },
  };
}
