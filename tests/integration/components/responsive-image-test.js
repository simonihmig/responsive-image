import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('responsive-image', 'Integration | Component | responsive image', {
  integration: true
});

test('it renders the correct sourceset', function(assert) {
  this.render(hbs`{{responsive-image image="kaliber5.png"}}`);

  // <img id="ember276" src="assets/images/responsive/kaliber5100w.png" srcset="assets/images/responsive/kaliber5100w.png 100w, assets/images/responsive/kaliber550w.png 50w" class="ember-view">

  //assert.ok(this.$().html().match());
  assert.equal(this.$().attr('srcset'), 'assets/images/responsive/kaliber5100w.png 100w, assets/images/responsive/kaliber550w.png 50w', 'The sourceset is not as expected');
});
