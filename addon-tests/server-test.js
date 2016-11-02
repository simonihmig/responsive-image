/* jshint node: true */
var RSVP = require('rsvp');
var request = RSVP.denodeify(require('request'));
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
var expect = require('chai').expect;

describe('serve assets acceptance', function() {
  this.timeout(300000);

  var app;

  before(function() {

    app = new AddonTestApp();

    return app.create('dummy', {fixturesPath: 'addon-tests/fixtures'})
    .then(function() {
      return app.startServer({
        additionalArguments: ['--serve-assets']
      });
    });
  });

  after(function() {
    return app.stopServer();
  });

  it('loads image 100w', function() {
    return request('http://localhost:49741/assets/images/responsive/kaliber5100w.png')
    .then(function(response) {
      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.eq("image/png");
    });
  });

  it('loads image 50w', function() {
    return request('http://localhost:49741/assets/images/responsive/kaliber550w.png')
    .then(function(response) {
      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.eq("image/png");
    });
  });
});