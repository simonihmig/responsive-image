import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { array, hash } from "@ember/helper";
import responsiveImageCloudinary from "@responsive-image/ember/helpers/responsive-image-cloudinary";
import type { ImageData } from "@responsive-image/ember";

module("Integration | Helper | responsive-image-cloudinary", function (hooks) {
  setupRenderingTest(hooks);

  let data: ImageData | undefined;
  const dump = (argument: ImageData) => {
    data = argument;
  };

  test("it supports default image types", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageCloudinary "samples/animals/three-dogs")}}
      </template>,
    );

    assert.deepEqual(data?.imageTypes, ["webp", "avif"]);
  });

  test("it returns correct upload image URLs", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageCloudinary "samples/animals/three-dogs")}}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg",
    );

    assert.strictEqual(
      data?.imageUrlFor(1000, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/upload/w_1000,c_limit,q_auto/samples/animals/three-dogs.jpeg",
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "webp"),
      "https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.webp",
    );
  });

  test("it returns correct fetch image URLs", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageCloudinary "https://via.placeholder.com/150")}}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_jpg/https%3A%2F%2Fvia.placeholder.com%2F150",
    );

    assert.strictEqual(
      data?.imageUrlFor(1000, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/fetch/w_1000,c_limit,q_auto,f_jpg/https%3A%2F%2Fvia.placeholder.com%2F150",
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "webp"),
      "https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_webp/https%3A%2F%2Fvia.placeholder.com%2F150",
    );
  });

  test("it supports custom transformations", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageCloudinary
            "samples/animals/three-dogs"
            transformations=(hash co="rgb:20a020" e="colorize:50")
          )
        }}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg",
    );
  });

  test("it supports custom chained transformations", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageCloudinary
            "samples/animals/three-dogs"
            transformations=(array
              (hash co="rgb:20a020" e="colorize:50")
              (hash ar="1.0" c="fill" w="150")
              (hash r="max")
            )
          )
        }}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg",
    );
  });

  test("it supports custom image formats", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageCloudinary
            "samples/animals/three-dogs" formats=(array "webp" "avif")
          )
        }}
      </template>,
    );

    assert.deepEqual(data?.imageTypes, ["webp", "avif"]);
  });

  test("it supports custom quality setting", async function (assert) {
    await render(
      <template>
        {{dump
          (responsiveImageCloudinary "samples/animals/three-dogs" quality=50)
        }}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "jpeg"),
      "https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_50/samples/animals/three-dogs.jpeg",
    );
  });

  test("it supports remote fetching", async function (assert) {
    await render(
      <template>
        {{dump (responsiveImageCloudinary "https://www.example.com/image.jpg")}}
      </template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, "webp"),
      "https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_webp/https%3A%2F%2Fwww.example.com%2Fimage.jpg",
    );
  });
});
