const expect = require('chai').expect;

describe('background', function() {

  it('renders', function() {
    return this.visit('/background')
      .then(function(res) {
        let $ = res.jQuery;
        expect($('div.bg').length).to.equal(1);
        expect($('div.bg').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/awesome1080w.jpg\');');
      });
  });

});