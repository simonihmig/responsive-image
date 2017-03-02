'use strict';

const expect = require('chai').expect;

describe('image', function() {

  it('renders', function() {
    return this.visit('/image')
      .then(function(res) {
        let $ = res.jQuery;
        expect($('img').length).to.equal(1);
        expect($('img').attr('src')).to.equal('/assets/images/responsive/awesome640w-00e24234f1b58e32b935b1041432916f.png');
      });
  });

});
