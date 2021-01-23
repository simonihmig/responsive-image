'use strict';

const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions',
];

const isCI = Boolean(process.env.CI);
const isProduction = process.env.EMBER_ENV === 'production';

// Somehow QUnit fails in an Embroider build when IE11 transpiling is active 🤔
if ((isCI || isProduction) && !process.env.EMBROIDER_TEST_SETUP_OPTIONS) {
  browsers.push('ie 11');
}

module.exports = {
  browsers,
  node: true,
};
