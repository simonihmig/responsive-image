import { find, render } from '@ember/test-helpers';
import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { test, module } from 'qunit';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);
  setupResponsiveImage(hooks);

  test('it renders the correct sourceset', async function (assert) {
    await render(hbs`<ResponsiveImage @image="test.png"/>`);
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png 100w'
        )
      );
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png 50w'
        )
      );
    await render(hbs`<ResponsiveImage @image="small.png"/>`);
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/smallresponsive/small10w-00e24234f1b58e32b935b1041432916f.png 10w'
        )
      );
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/smallresponsive/small25w-00e24234f1b58e32b935b1041432916f.png 25w'
        )
      );
    await render(hbs`<ResponsiveImage @image="dir/test.png"/>`);
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/recursiveresponsive/dir/test100w-00e24234f1b58e32b935b1041432916f.png 100w'
        )
      );
    assert
      .dom('img')
      .hasAttribute(
        'srcset',
        new RegExp(
          '/assets/images/recursiveresponsive/dir/test50w-00e24234f1b58e32b935b1041432916f.png 50w'
        )
      );
  });

  test('it renders a given size as sizes', async function (assert) {
    await render(hbs`<ResponsiveImage @image="test.png" @size="40"/>`);
    assert.dom('img').hasAttribute('sizes', '40vw');
  });

  test('it renders with given sizes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @image="test.png" @sizes="(max-width: 767px) 100vw, 50vw"/>`
    );
    assert.equal(
      find('img').getAttribute('sizes'),
      '(max-width: 767px) 100vw, 50vw'
    );
  });

  test('it renders the fallback src next to needed display size', async function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.set('physicalWidth', 45);
    await render(hbs`<ResponsiveImage @image="test.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png'
    );
    service.set('physicalWidth', 51);
    await render(hbs`<ResponsiveImage @image="test.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png'
    );
    service.set('physicalWidth', 9);
    await render(hbs`<ResponsiveImage @image="small.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/smallresponsive/small10w-00e24234f1b58e32b935b1041432916f.png'
    );
    service.set('physicalWidth', 11);
    await render(hbs`<ResponsiveImage @image="small.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/smallresponsive/small25w-00e24234f1b58e32b935b1041432916f.png'
    );
    service.set('physicalWidth', 45);
    await render(hbs`<ResponsiveImage @image="dir/test.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/recursiveresponsive/dir/test50w-00e24234f1b58e32b935b1041432916f.png'
    );
    service.set('physicalWidth', 51);
    await render(hbs`<ResponsiveImage @image="dir/test.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/recursiveresponsive/dir/test100w-00e24234f1b58e32b935b1041432916f.png'
    );
  });

  test('it renders the alt and classNames arguments', async function (assert) {
    this.set('alt', 'my description');
    this.set('className', 'my-css-class');
    await render(
      hbs`<ResponsiveImage @image="test.png" @alt={{this.alt}} @className={{this.className}} />`
    );
    assert.equal(find('img').getAttribute('alt'), 'my description');
    assert.dom('img').hasClass('my-css-class');
  });
});
