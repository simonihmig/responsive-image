import ResponsiveImage from "@responsive-image/ember/components/responsive-image";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, settled } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, skip, test } from "qunit";
import { on } from "@ember/modifier";
import type { ImageData } from "@responsive-image/ember";
import testImage from "ember-classic/images/tests/image.jpg?w=50;100;640&format=original;webp;avif&responsive";
import testImageLqipInline from "ember-classic/images/tests/image.jpg?lqip=inline&w=50;100;640&responsive";
import testImageLqipColor from "ember-classic/images/tests/image.jpg?lqip=color&w=50;100;640&responsive";
import testImageLqipBlurhash from "ember-classic/images/tests/image.jpg?lqip=blurhash&w=50;100;640&responsive";
import smallImage from "ember-classic/images/tests/image.jpg?w=10;25&format=original;webp;avif&responsive";

import type { RenderingTestContext } from "@ember/test-helpers";
import { env } from "@responsive-image/core";

interface TestContext extends RenderingTestContext {
  cacheBreaker: () => string;
  testImage: ImageData;
  testImageLqipInline: ImageData;
  testImageLqipColor: ImageData;
  testImageLqipBlurhash: ImageData;
  smallImage: ImageData;
}

const cacheBreaker = () => new Date().getTime() + "#" + Math.random();

module("Integration: Responsive Image Component", function (hooks) {
  setupRenderingTest(hooks);

  module("source from local files", function () {
    module("responsive layout", function () {
      test("it has responsive layout by default", async function (assert) {
        await render<TestContext>(
          <template><ResponsiveImage @src={{testImage}} /></template>,
        );

        assert.dom("img").hasClass("eri-responsive");
        assert.dom("img").hasNoClass("eri-fixed");
      });

      test("it renders width and height attributes", async function (this: RenderingTestContext, assert) {
        await render<TestContext>(
          <template><ResponsiveImage @src={{testImage}} /></template>,
        );

        assert.dom("img").hasAttribute("width");
        assert.dom("img").hasAttribute("height");
        assert.strictEqual(
          parseInt(
            this.element.querySelector("img")?.getAttribute("width") ?? "",
            10,
          ) /
            parseInt(
              this.element.querySelector("img")?.getAttribute("height") ?? "",
              10,
            ),
          2,
        );
      });

      test("it renders the correct sourceset with width descriptors", async function (assert) {
        await render<TestContext>(
          <template><ResponsiveImage @src={{testImage}} /></template>,
        );

        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-640w(-\\w+)?.jpg 640w"),
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.jpg 100w"),
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.jpg 50w"),
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-640w(-\\w+)?.webp 640w"),
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.webp 100w"),
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.webp 50w"),
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-640w(-\\w+)?.avif 640w"),
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.avif 100w"),
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.avif 50w"),
          );

        await render<TestContext>(
          <template><ResponsiveImage @src={{smallImage}} /></template>,
        );
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.jpg 10w"),
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.jpg 25w"),
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.webp 10w"),
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.webp 25w"),
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.avif 10w"),
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.avif 25w"),
          );
      });

      // Blocked on https://github.com/embroider-build/ember-auto-import/issues/503
      skip("it renders the fallback src next to needed display size", async function (assert) {
        env.physicalWidth = 45;
        await render<TestContext>(
          <template><ResponsiveImage @src={{testImage}} /></template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-50w(-\\w+)?.jpg"));
        env.physicalWidth = 51;
        await render<TestContext>(
          <template><ResponsiveImage @src={{testImage}} /></template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-100w(-\\w+)?.jpg"));
        env.physicalWidth = 9;
        await render<TestContext>(
          <template><ResponsiveImage @src={{smallImage}} /></template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-10w(-\\w+)?.jpg"));
        env.physicalWidth = 11;
        await render<TestContext>(
          <template><ResponsiveImage @src={{smallImage}} /></template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-25w(-\\w+)?.jpg"));
      });

      test("it renders a given size as sizes", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @size={{40}} />
          </template>,
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute("sizes", "40vw");
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute("sizes", "40vw");
      });

      test("it renders with given sizes", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage
              @src={{testImage}}
              @sizes="(max-width: 767px) 100vw, 50vw"
            />
          </template>,
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute("sizes", "(max-width: 767px) 100vw, 50vw");
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute("sizes", "(max-width: 767px) 100vw, 50vw");
      });
    });

    module("fixed layout", function () {
      test("it has fixed layout when width or height is provided", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @width={{100}} />
          </template>,
        );

        assert.dom("img").hasClass("eri-fixed");
        assert.dom("img").hasNoClass("eri-responsive");

        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @height={{100}} />
          </template>,
        );

        assert.dom("img").hasClass("eri-fixed");
        assert.dom("img").hasNoClass("eri-responsive");
      });

      test("it renders width and height when given", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @width={{150}} @height={{50}} />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "150");
        assert.dom("img").hasAttribute("height", "50");
      });

      test("it renders height when width is given according to aspect ratio", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @width={{150}} />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "150");
        assert.dom("img").hasAttribute("height", "75");
      });

      test("it renders width when height is given according to aspect ratio", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @src={{testImage}} @height={{100}} />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "200");
        assert.dom("img").hasAttribute("height", "100");
      });

      test("it renders the correct sourceset with pixel densities", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{50}} @src={{testImage}} />
          </template>,
        );
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.jpg 2x"),
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.jpg 1x"),
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.webp 2x"),
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.webp 1x"),
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-100w(-\\w+)?.avif 2x"),
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-50w(-\\w+)?.avif 1x"),
          );

        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{10}} @src={{smallImage}} />
          </template>,
        );
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.jpg 1x"),
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.jpg 2x"),
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.webp 1x"),
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.webp 2x"),
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-10w(-\\w+)?.avif 1x"),
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            "srcset",
            new RegExp("/images/image-25w(-\\w+)?.avif 2x"),
          );
      });

      test("it renders the fallback src next to needed display size", async function (assert) {
        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{320}} @src={{testImage}} />
          </template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-640w(-\\w+)?.jpg"));

        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{101}} @src={{testImage}} />
          </template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-640w(-\\w+)?.jpg"));

        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{100}} @src={{testImage}} />
          </template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-100w(-\\w+)?.jpg"));

        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{51}} @src={{testImage}} />
          </template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-100w(-\\w+)?.jpg"));

        await render<TestContext>(
          <template>
            <ResponsiveImage @width={{50}} @src={{testImage}} />
          </template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/images/image-50w(-\\w+)?.jpg"));
      });
    });

    module("LQIP", function () {
      module("inline", function () {
        test("it sets LQIP SVG as background", async function (this: RenderingTestContext, assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          const onload = () => setTimeout(resolve, 0);

          await render<TestContext & { onload: () => void }>(
            <template>
              <ResponsiveImage
                @src={{testImageLqipInline}}
                @cacheBreaker={{(cacheBreaker)}}
                {{on "load" onload}}
              />
            </template>,
          );

          assert.ok(
            window
              .getComputedStyle(this.element.querySelector("img")!)
              .backgroundImage?.match(/data:image\/svg/),
            "it has a background SVG",
          );
          assert.dom("img").hasStyle({ "background-size": "cover" });
          assert.ok(
            window.getComputedStyle(this.element.querySelector("img")!)
              .backgroundImage?.length > 100,
            "the background SVG has a reasonable length",
          );

          await waitUntilLoaded;
          await settled();

          assert.strictEqual(
            window.getComputedStyle(this.element.querySelector("img")!)
              .backgroundImage,
            "none",
            "after image is loaded the background SVG is removed",
          );
        });
      });

      module("color", function () {
        test("it sets background-color", async function (assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          const onload = () => setTimeout(resolve, 0);

          await render<TestContext & { onload: () => void }>(
            <template>
              <ResponsiveImage
                @src={{testImageLqipColor}}
                @cacheBreaker={{(cacheBreaker)}}
                {{on "load" onload}}
              />
            </template>,
          );

          assert.dom("img").hasStyle({ "background-color": "rgb(88, 72, 56)" });

          await waitUntilLoaded;
          await settled();

          assert
            .dom("img")
            .hasStyle({ "background-color": "rgba(0, 0, 0, 0)" });
        });
      });

      module("blurhash", function () {
        test("it sets LQIP from blurhash as background", async function (this: RenderingTestContext, assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          const onload = () => setTimeout(resolve, 0);

          await render<TestContext & { onload: () => void }>(
            <template>
              <ResponsiveImage
                @src={{testImageLqipBlurhash}}
                @cacheBreaker={{(cacheBreaker)}}
                {{on "load" onload}}
              />
            </template>,
          );

          assert.ok(
            this.element
              .querySelector("img")!
              .style.backgroundImage?.match(/data:image\/png/),
            "it has a background PNG",
          );
          assert.dom("img").hasStyle({ "background-size": "cover" });
          assert.ok(
            window.getComputedStyle(this.element.querySelector("img")!)
              .backgroundImage?.length > 100,
            "the background SVG has a reasonable length",
          );

          await waitUntilLoaded;
          await settled();

          assert.strictEqual(
            window.getComputedStyle(this.element.querySelector("img")!)
              .backgroundImage,
            "none",
            "after image is loaded the background PNG is removed",
          );
        });
      });
    });
  });

  module("source from provider", function () {
    const defaultImageData: ImageData = {
      imageTypes: ["jpeg", "webp"],
      imageUrlFor(width, type = "jpeg") {
        return `/provider/w${width}/image.${type}`;
      },
    };

    interface TestContextWithDefaultProvider extends TestContext {
      defaultImageData: ImageData;
    }

    module("responsive layout", function () {
      test("it has responsive layout by default", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template><ResponsiveImage @src={{defaultImageData}} /></template>,
        );

        assert.dom("img").hasClass("eri-responsive");
        assert.dom("img").hasNoClass("eri-fixed");
      });

      test("it renders width and height attributes when aspect ratio is known", async function (this: RenderingTestContext, assert) {
        const imageData = {
          ...defaultImageData,
          aspectRatio: 2,
        };
        await render<TestContextWithDefaultProvider & { imageData: ImageData }>(
          <template><ResponsiveImage @src={{imageData}} /></template>,
        );

        assert.dom("img").hasAttribute("width");
        assert.dom("img").hasAttribute("height");
        assert.strictEqual(
          parseInt(
            this.element.querySelector("img")?.getAttribute("width") ?? "",
            10,
          ) /
            parseInt(
              this.element.querySelector("img")?.getAttribute("height") ?? "",
              10,
            ),
          2,
        );
      });

      test("it renders the sourceset based on deviceWidths", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template><ResponsiveImage @src={{defaultImageData}} /></template>,
        );

        const { deviceWidths } = env;

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            deviceWidths
              .map((w) => `/provider/w${w}/image.webp ${w}w`)
              .join(", "),
          );

        // jpeg
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            deviceWidths
              .map((w) => `/provider/w${w}/image.jpeg ${w}w`)
              .join(", "),
          );
      });

      test("it renders the sourceset based on provided widths", async function (assert) {
        const imageData = {
          ...defaultImageData,
          availableWidths: [320, 640],
        };

        await render<TestContextWithDefaultProvider & { imageData: ImageData }>(
          <template><ResponsiveImage @src={{imageData}} /></template>,
        );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            "/provider/w320/image.webp 320w, /provider/w640/image.webp 640w",
          );

        // jpeg
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            "/provider/w320/image.jpeg 320w, /provider/w640/image.jpeg 640w",
          );
      });

      // Blocked on https://github.com/embroider-build/ember-auto-import/issues/503
      skip("it renders the fallback src next to needed display size", async function (assert) {
        env.physicalWidth = 100;
        await render<TestContextWithDefaultProvider>(
          <template><ResponsiveImage @src={{defaultImageData}} /></template>,
        );
        assert
          .dom("img")
          .hasAttribute("src", new RegExp("/provider/w100/image.jpeg"));
      });

      test("it renders a given size as sizes", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage @src={{defaultImageData}} @size={{40}} />
          </template>,
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute("sizes", "40vw");
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute("sizes", "40vw");
      });

      test("it renders with given sizes", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage
              @src={{defaultImageData}}
              @sizes="(max-width: 767px) 100vw, 50vw"
            />
          </template>,
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute("sizes", "(max-width: 767px) 100vw, 50vw");
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute("sizes", "(max-width: 767px) 100vw, 50vw");
      });
    });

    module("fixed layout", function () {
      test("it has fixed layout when width or height is provided", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage @src={{defaultImageData}} @width={{100}} />
          </template>,
        );

        assert.dom("img").hasClass("eri-fixed");
        assert.dom("img").hasNoClass("eri-responsive");
      });

      test("it renders width and height when given", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage
              @src={{defaultImageData}}
              @width={{150}}
              @height={{50}}
            />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "150");
        assert.dom("img").hasAttribute("height", "50");
      });

      test("it renders height when width is given according to aspect ratio", async function (assert) {
        const imageData = {
          ...defaultImageData,
          aspectRatio: 2,
        };
        await render<TestContextWithDefaultProvider & { imageData: ImageData }>(
          <template>
            <ResponsiveImage @src={{imageData}} @width={{150}} />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "150");
        assert.dom("img").hasAttribute("height", "75");
      });

      test("it renders width when height is given according to aspect ratio", async function (assert) {
        const imageData = {
          ...defaultImageData,
          aspectRatio: 2,
        };
        await render<TestContextWithDefaultProvider & { imageData: ImageData }>(
          <template>
            <ResponsiveImage @src={{imageData}} @height={{100}} />
          </template>,
        );

        assert.dom("img").hasAttribute("width", "200");
        assert.dom("img").hasAttribute("height", "100");
      });

      test("it renders the correct sourceset with pixel densities", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage @width={{50}} @src={{defaultImageData}} />
          </template>,
        );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            "srcset",
            "/provider/w50/image.webp 1x, /provider/w100/image.webp 2x",
          );

        // avif
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            "srcset",
            "/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x",
          );
      });

      test("it renders the fallback src next to needed display size", async function (assert) {
        await render<TestContextWithDefaultProvider>(
          <template>
            <ResponsiveImage @width={{320}} @src={{defaultImageData}} />
          </template>,
        );
        assert.dom("img").hasAttribute("src", "/provider/w320/image.jpeg");
      });
    });
  });

  test("it renders a source for every format", async function (assert) {
    await render<TestContext>(
      <template><ResponsiveImage @src={{testImage}} /></template>,
    );

    assert.dom("picture").exists({ count: 1 });
    assert.dom("picture source").exists({ count: 3 });
    assert.dom('picture source[type="image/jpeg"]').exists({ count: 1 });
    assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
  });

  test("it loads lazily by default", async function (assert) {
    await render<TestContext>(
      <template><ResponsiveImage @src={{testImage}} /></template>,
    );
    assert.dom("img").hasAttribute("loading", "lazy");
  });

  test("it can optionally load eager", async function (assert) {
    await render<TestContext>(
      <template>
        <ResponsiveImage @src={{testImage}} loading="eager" />
      </template>,
    );
    assert.dom("img").hasAttribute("loading", "eager");
  });

  test("it decodes async", async function (assert) {
    await render<TestContext>(
      <template><ResponsiveImage @src={{testImage}} /></template>,
    );
    assert.dom("img").hasAttribute("decoding", "async");
  });

  test("it renders arbitrary HTML attributes", async function (assert) {
    await render<TestContext>(
      <template>
        <ResponsiveImage
          @src={{testImage}}
          class="foo"
          role="button"
          data-test-image
        />
      </template>,
    );
    assert.dom("img").hasClass("foo");
    assert.dom("img").hasAttribute("role", "button");
    assert.dom("img").hasAttribute("data-test-image");
  });
});
