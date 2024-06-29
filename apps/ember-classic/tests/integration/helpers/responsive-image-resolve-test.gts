import { render } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import responsiveImageResolve from "@responsive-image/ember/helpers/responsive-image-resolve";
import type { ImageData } from "@responsive-image/ember";
import testImage from "ember-classic/images/tests/test.png?&w=640;2048&responsive";

interface TestContext {
  testImage: ImageData;
}

module("Helper: responsive-image-resolve", function (hooks) {
  setupRenderingTest(hooks);

  test("works without size", async function (assert) {
    await render<TestContext>(
      <template>
        <h1>{{responsiveImageResolve testImage}}</h1>
      </template>,
    );
    assert.dom("h1").hasText(new RegExp("/images/test-2048w(-\\w+)?.png"));
  });

  test("supports size", async function (assert) {
    await render<TestContext>(
      <template>
        <h1>{{responsiveImageResolve testImage size=10}}</h1>
      </template>,
    );

    // @todo use custom sizes for loader here
    assert.dom("h1").hasText(new RegExp("/images/test-640w(-\\w+)?.png"));
  });

  test("supports format", async function (assert) {
    await render<TestContext>(
      <template>
        <h1>{{responsiveImageResolve testImage format="webp"}}</h1>
      </template>,
    );

    assert.dom("h1").hasText(new RegExp("/images/test-2048w(-\\w+)?.webp"));
  });
});
