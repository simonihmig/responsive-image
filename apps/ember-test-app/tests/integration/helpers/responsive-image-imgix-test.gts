import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { array, hash } from "@ember/helper";
import responsiveImageImgix from "@responsive-image/ember/helpers/responsive-image-imgix";
import type { ImageData } from "@responsive-image/ember";

module("Integration | Helper | responsive-image-imgix", function (hooks) {
  setupRenderingTest(hooks);
  let data: ImageData | undefined;
  const dump = (argument: ImageData) => {
    data = argument;
  };

  test("it supports default image types", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageImgix "aurora-original.jpg")}}
      </template>,
    );

    assert.deepEqual(data?.imageTypes, ["webp", "avif"]);
  });

  test("it returns correct image URLs", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageImgix "aurora-original.jpg")}}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://responsive-image.imgix.net/aurora-original.jpg?fm=jpg&w=100&fit=max",
    );

    assert.strictEqual(
      data?.imageUrlFor(1000, "jpeg"),
      "https://responsive-image.imgix.net/aurora-original.jpg?fm=jpg&w=1000&fit=max",
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "webp"),
      "https://responsive-image.imgix.net/aurora-original.jpg?fm=webp&w=100&fit=max",
    );
  });

  test("it supports custom params", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageImgix
            "aurora-original.jpg" params=(hash monochrome="44768B" px=10)
          )
        }}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://responsive-image.imgix.net/aurora-original.jpg?fm=jpg&w=100&fit=max&monochrome=44768B&px=10",
    );
  });

  test("it supports custom image formats", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageImgix
            "aurora-original.jpg" formats=(array "webp" "jpeg")
          )
        }}
      </template>,
    );

    assert.deepEqual(data?.imageTypes, ["webp", "jpeg"]);
  });

  test("it supports custom quality setting", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageImgix "aurora-original.jpg" quality=50)}}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://responsive-image.imgix.net/aurora-original.jpg?fm=jpg&w=100&fit=max&q=50",
    );
  });
});
