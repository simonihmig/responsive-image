'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('background', function() {
  setupTest('fastboot'/*, options */);

  it('renders', function() {
    return this.visit('/background')
      .then(function(res) {
        let $ = res.jQuery;
        expect($('div.bg').length).to.equal(1);
        expect($('div.bg').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/awesome640w-00e24234f1b58e32b935b1041432916f.png\');');
      });
  });

});
