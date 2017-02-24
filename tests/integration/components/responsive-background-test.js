/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'responsive-background',
  'Integration: ResponsiveBackgroundComponent',
  {
    integration: true
  },
  function() {
    it('renders with backround url', function() {
      this.render(hbs`{{responsive-background image="test.png"}}`);
      expect(this.$('div').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png\');');
    });
    it('it renders the background url next to needed display size', function() {
      this.inject.service('responsive-image');
      this.get('responsive-image').set('physicalWidth', 45);
      this.render(hbs`{{responsive-background image="test.png"}}`);
      expect(this.$('div').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png\');');
      this.get('responsive-image').set('physicalWidth', 51);
      this.render(hbs`{{responsive-background image="test.png"}}`);
      expect(this.$('div').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png\');');
    });
    it('it renders the background url next to given render size', function() {
      this.inject.service('responsive-image');
      this.get('responsive-image').set('physicalWidth', 100);
      this.set('size', 45);
      this.render(hbs`{{responsive-background image="test.png" size=size}}`);
      expect(this.$('div').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png\');');
      this.set('size', 51);
      expect(this.$('div').attr('style')).to.equal('background-image: url(\'/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png\');');
    });
  }
);
