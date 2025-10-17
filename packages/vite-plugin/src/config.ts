import type { Plugin } from 'vite';

export default function configPlugin(): Plugin {
  return {
    name: 'responsive-image/config',
    configEnvironment(_name, config) {
      if (config.consumer === 'server') {
        return {
          resolve: {
            noExternal: ['@responsive-image/*'],
          },
        };
      }
    },
  };
}
