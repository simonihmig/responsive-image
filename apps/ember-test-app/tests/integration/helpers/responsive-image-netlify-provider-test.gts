import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { array } from "@ember/helper";
import responsiveImageNetlifyProvider from "@responsive-image/ember/helpers/responsive-image-netlify-provider";
import type { ImageData } from "@responsive-image/ember";
import { setConfig } from "@responsive-image/core";
import type { Config } from "@responsive-image/cdn";

module(
  "Integration | Helper | responsive-image-netlify-provider",
  function (hooks) {
    setupRenderingTest(hooks);

    let data: ImageData | undefined;
    const dump = (argument: ImageData) => {
      data = argument;
    };

    hooks.beforeEach(() => {
      setConfig<Config>("cdn", { netlify: { domain: "dummy.netlify.app" } });
    });

    test("it supports default image types", async function (assert) {
      await render(
        <template>
          {{dump (responsiveImageNetlifyProvider "/foo/bar.jpg")}}
        </template>,
      );

      assert.deepEqual(data?.imageTypes, ["webp", "avif"]);
    });

    test("it returns correct relative image URLs", async function (assert) {
      await render(
        <template>
          {{dump (responsiveImageNetlifyProvider "/foo/bar.jpg")}}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=100&fm=jpg",
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, "webp"),
        "https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=1000&fm=webp",
      );
    });

    test("it returns correct remote image URLs", async function (assert) {
      await render(
        <template>
          {{dump
            (responsiveImageNetlifyProvider "https://example.com/foo/bar.jpg")
          }}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://dummy.netlify.app/.netlify/images?url=https%3A%2F%2Fexample.com%2Ffoo%2Fbar.jpg&w=100&fm=jpg",
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, "webp"),
        "https://dummy.netlify.app/.netlify/images?url=https%3A%2F%2Fexample.com%2Ffoo%2Fbar.jpg&w=1000&fm=webp",
      );
    });

    test("it supports custom image formats", async function (assert) {
      await render(
        <template>
          {{dump
            (responsiveImageNetlifyProvider
              "/foo/bar.jpg" formats=(array "webp" "avif")
            )
          }}
        </template>,
      );

      assert.deepEqual(data?.imageTypes, ["webp", "avif"]);
    });

    test("it supports custom quality setting", async function (assert) {
      await render(
        <template>
          {{dump (responsiveImageNetlifyProvider "/foo/bar.jpg" quality=50)}}
        </template>,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, "jpeg"),
        "https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=100&fm=jpg&q=50",
      );
    });
  },
);
