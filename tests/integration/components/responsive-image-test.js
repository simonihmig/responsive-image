import { expect } from 'chai';
import { initialize } from 'ember-responsive-image/instance-initializers/browser/responsive-meta';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {
  before
} from 'mocha';

describeComponent(
  'responsive-image',
  'Integration: Responsive Image Component',
  {
    integration: true
  },
  function() {
    before(function() {
      initialize();
    });
    it('it renders the correct sourceset', function() {
      this.render(hbs`{{responsive-image image="test.png"}}`);
      expect(this.$('img').attr('srcset')).to.equal('/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png 100w, /assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png 50w');
    });

    it('it renders a given size as sizes', function() {
      this.render(hbs`{{responsive-image image="test.png" size="40"}}`);
      expect(this.$('img').attr('sizes')).to.equal('40vw');
    });

    it('it renders with given sizes', function() {
      this.render(hbs`{{responsive-image image="test.png" sizes="(max-width: 767px) 100vw, 50vw"}}`);
      expect(this.$('img').attr('sizes')).to.equal('(max-width: 767px) 100vw, 50vw');
    });

    it('it renders the fallback src next to needed display size', function() {
      this.inject.service('responsive-image');
      this.get('responsive-image').set('physicalWidth', 45);
      this.render(hbs`{{responsive-image image="test.png"}}`);
      expect(this.$('img').attr('src')).to.equal('/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png');
      this.get('responsive-image').set('physicalWidth', 51);
      this.render(hbs`{{responsive-image image="test.png"}}`);
      expect(this.$('img').attr('src')).to.equal('/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png');
    });
    it('it renders the alt and classNames arguments', function() {
      this.set('alt', 'my description');
      this.set('className', 'my-css-class');
      this.render(hbs`{{responsive-image image="test.png" alt=alt className=className}}`);
      expect(this.$('img').attr('alt')).to.equal('my description');
      expect(this.$('img').attr('class')).to.contain('my-css-class');
    });
  }
);
