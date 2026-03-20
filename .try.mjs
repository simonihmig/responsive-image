export default {
  scenarios: [
    {
      name: `ember-lts-6.4`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `npm:ember-source@~6.4.0`,
        },
      },
    },
    {
      name: `ember-lts-6.8`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `npm:ember-source@~6.8.0`,
        },
      },
    },
    {
      name: `ember-beta`,
      cwd: 'packages/ember',
      npm: {
        devDependencies: {
          'ember-source': `npm:ember-source@beta`,
        },
      },
    },
  ],
};
