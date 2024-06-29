import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, type RenderingTestContext } from "@ember/test-helpers";
import { array, hash } from "@ember/helper";
import responsiveImageImgixProvider from "@responsive-image/ember/helpers/responsive-image-imgix-provider";
import type { ImageData } from "@responsive-image/ember";

interface TestContext extends RenderingTestContext {
  dump: (argument: ImageData) => void;
}

module(
  "Integration | Helper | responsive-image-imgix-provider",
  function (hooks) {
    setupRenderingTest(hooks);
    let data: ImageData | undefined;
    const dump = (argument: ImageData) => {
      data = argument;
    };

    test("it supports jpg, png and webp image types", async function (assert) {
      await render<TestContext>(
        <template>
          {{dump (responsiveImageImgixProvider "foo/bar.jpg")}}
        </template>,
      );

      assert.deepEqual(data?.imageTypes, ["png", "jpeg", "webp"]);
    });

    test("it returns correct image URLs", async function (assert) {
      await render<TestContext>(
        <template>
          {{dump (responsiveImageImgixProvider "foo/bar.jpg")}}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max",
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, "jpeg"),
        "https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=1000&fit=max",
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "webp"),
        "https://kaliber5.imgix.net/foo/bar.jpg?fm=webp&w=100&fit=max",
      );
    });

    test("it supports custom params", async function (assert) {
      await render<TestContext>(
        <template>
          {{dump
            (responsiveImageImgixProvider
              "foo/bar.jpg" params=(hash monochrome="44768B" px=10)
            )
          }}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&monochrome=44768B&px=10",
      );
    });

    test("it supports custom image formats", async function (assert) {
      await render<TestContext>(
        <template>
          {{dump
            (responsiveImageImgixProvider
              "foo/bar.jpg" formats=(array "webp" "jpeg")
            )
          }}
        </template>,
      );

      assert.deepEqual(data?.imageTypes, ["webp", "jpeg"]);
    });

    test("it supports custom quality setting", async function (assert) {
      await render<TestContext>(
        <template>
          {{dump (responsiveImageImgixProvider "foo/bar.jpg" quality=50)}}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&q=50",
      );
    });
  },
);
