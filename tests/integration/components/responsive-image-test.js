import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {
  beforeEach,
  afterEach
} from 'mocha';

describeComponent(
  'responsive-image',
  'Integration: Responsive Image Component',
  {
    integration: true
  },
  function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('it renders the correct sourceset', function() {
      this.render(hbs`{{responsive-image image="kaliber5.png"}}`);
      expect(this.$('img').attr('srcset')).to.equal('/assets/images/responsive/kaliber5100w.png 100w, /assets/images/responsive/kaliber550w.png 50w');
    });

    it('it renders a given size as sizes', function() {
      this.render(hbs`{{responsive-image image="kaliber5.png" size="40"}}`);
      expect(this.$('img').attr('sizes')).to.equal('40vw');
    });

    it('it renders with given sizes', function() {
      this.render(hbs`{{responsive-image image="kaliber5.png" sizes="(max-width: 767px) 100vw, 50vw"}}`);
      expect(this.$('img').attr('sizes')).to.equal('(max-width: 767px) 100vw, 50vw');
    });

    it('it renders the fallback src next to needed display size', function() {
      this.set('displaySize', '45');
      this.render(hbs`{{responsive-image image="kaliber5.png" physicalWidth=displaySize}}`);
      expect(this.$('img').attr('src')).to.equal('/assets/images/responsive/kaliber550w.png');
      this.set('displaySize', '51');
      expect(this.$('img').attr('src')).to.equal('/assets/images/responsive/kaliber5100w.png');
    });

  }
);
