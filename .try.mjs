export default {
  scenarios: [
    {
      name: `ember-lts-6.4`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `~6.4.0`,
        },
      },
    },
    {
      name: `ember-lts-6.8`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `~6.8.0`,
        },
      },
    },
    {
      name: `ember-beta`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `beta`,
        },
      },
    },
    {
      name: `vite-6`,
      cwd: 'packages/vite-plugin',
      npm: {
        devDependencies: {
          vite: `^6.0.0`,
        },
      },
    },
    {
      name: `vite-7`,
      cwd: 'packages/vite-plugin',
      npm: {
        devDependencies: {
          vite: `^7.0.0`,
        },
      },
    },
  ],
};
