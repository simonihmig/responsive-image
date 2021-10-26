'use strict';

const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions',
];

// check if we have https://github.com/emberjs/ember.js/pull/19397
const semver = require('semver');
const supportsNodeTargets = semver.gte(
  require('ember-source/package.json').version,
  '3.27.0'
);

// ember-auto-import v2 expects a `browsers` property, so use the comman targets format when supported
module.exports = supportsNodeTargets
  ? {
      browsers,
      node: true,
    }
  : [...browsers, 'maintained node versions'];
