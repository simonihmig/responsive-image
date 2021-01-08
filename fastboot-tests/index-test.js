'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('index', function () {
  setupTest('fastboot' /*, options */);

  it('renders', function () {
    return this.visit('/').then(function (res) {
      let $ = res.jQuery;
      expect($('body').length).to.equal(1);
      expect($('h1').text().trim()).to.equal('ember-fastboot-addon-tests');
    });
  });
});
