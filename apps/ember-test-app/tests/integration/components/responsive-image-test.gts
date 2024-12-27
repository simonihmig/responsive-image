import ResponsiveImage from "@responsive-image/ember/components/responsive-image";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, skip, test } from "qunit";
import type { ImageData } from "@responsive-image/ember";
import { imageLoaded } from "../../helpers/image-loaded";

import type { RenderingTestContext } from "@ember/test-helpers";
import { env } from "@responsive-image/core";

const cacheBreaker = () => `${new Date().getTime()}-${Math.random()}`;

module("Integration: Responsive Image Component", function (hooks) {
  setupRenderingTest(hooks);

  const defaultImageData: ImageData = {
    imageTypes: ["jpeg", "webp", "avif"],
    imageUrlFor(width, type = "jpeg") {
      return `/provider/w${width}/image.${type}`;
    },
    aspectRatio: 2,
  };

  module("basics", function () {
    test("it renders a source for every format", async function (assert) {
      await render(
        <template><ResponsiveImage @src={{defaultImageData}} /></template>,
      );

      assert.dom("picture").exists({ count: 1 });
      assert.dom("picture source").exists({ count: 3 });
      assert.dom('picture source[type="image/jpeg"]').exists({ count: 1 });
      assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
    });

    test("it loads lazily by default", async function (assert) {
      await render(
        <template><ResponsiveImage @src={{defaultImageData}} /></template>,
      );
      assert.dom("img").hasAttribute("loading", "lazy");
    });

    test("it can optionally load eager", async function (assert) {
      await render(
        <template>
          <ResponsiveImage @src={{defaultImageData}} loading="eager" />
        </template>,
      );
      assert.dom("img").hasAttribute("loading", "eager");
    });

    test("it decodes async", async function (assert) {
      await render(
        <template><ResponsiveImage @src={{defaultImageData}} /></template>,
      );
      assert.dom("img").hasAttribute("decoding", "async");
    });

    test("it renders arbitrary HTML attributes", async function (assert) {
      await render(
        <template>
          <ResponsiveImage
            @src={{defaultImageData}}
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

  module("responsive layout", function () {
    test("it has responsive layout by default", async function (assert) {
      await render(
        <template><ResponsiveImage @src={{defaultImageData}} /></template>,
      );

      assert.dom("img").hasClass("ri-responsive");
      assert.dom("img").hasNoClass("ri-fixed");
    });

    test("it renders width and height attributes when aspect ratio is known", async function (this: RenderingTestContext, assert) {
      const imageData = {
        ...defaultImageData,
        aspectRatio: 2,
      };
      await render(<template><ResponsiveImage @src={{imageData}} /></template>);

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

    test("it renders the correct sourceset with width descriptors when availableWidths is available", async function (assert) {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100, 640],
      };

      await render(<template><ResponsiveImage @src={{imageData}} /></template>);

      // png
      assert
        .dom('picture source[type="image/jpeg"]')
        .hasAttribute(
          "srcset",
          "/provider/w50/image.jpeg 50w, /provider/w100/image.jpeg 100w, /provider/w640/image.jpeg 640w",
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          "srcset",
          "/provider/w50/image.webp 50w, /provider/w100/image.webp 100w, /provider/w640/image.webp 640w",
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          "srcset",
          "/provider/w50/image.avif 50w, /provider/w100/image.avif 100w, /provider/w640/image.avif 640w",
        );

      const smallImageData: ImageData = {
        ...defaultImageData,
        availableWidths: [10, 25],
      };

      await render(
        <template><ResponsiveImage @src={{smallImageData}} /></template>,
      );
      // png
      assert
        .dom('picture source[type="image/jpeg"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.jpeg 10w, /provider/w25/image.jpeg 25w",
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.webp 10w, /provider/w25/image.webp 25w",
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.avif 10w, /provider/w25/image.avif 25w",
        );
    });

    test("it renders the sourceset based on deviceWidths when availableWidths is not available", async function (assert) {
      await render(
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

    // TODO: figure out why this is not working
    skip("it renders the fallback src next to needed display size", async function (assert) {
      env.physicalWidth = 100;
      await render(
        <template><ResponsiveImage @src={{defaultImageData}} /></template>,
      );
      assert
        .dom("img")
        .hasAttribute("src", new RegExp("/provider/w100/image.jpeg"));
    });

    test("it renders a given size as sizes", async function (assert) {
      await render(
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
      await render(
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
      await render(
        <template>
          <ResponsiveImage @src={{defaultImageData}} @width={{100}} />
        </template>,
      );

      assert.dom("img").hasClass("ri-fixed");
      assert.dom("img").hasNoClass("ri-responsive");

      await render(
        <template>
          <ResponsiveImage @src={{defaultImageData}} @height={{100}} />
        </template>,
      );

      assert.dom("img").hasClass("ri-fixed");
      assert.dom("img").hasNoClass("ri-responsive");
    });

    test("it renders width and height when given", async function (assert) {
      await render(
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
      await render(
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
      await render(
        <template>
          <ResponsiveImage @src={{imageData}} @height={{100}} />
        </template>,
      );

      assert.dom("img").hasAttribute("width", "200");
      assert.dom("img").hasAttribute("height", "100");
    });

    test("it renders the correct sourceset with pixel densities", async function (assert) {
      const imageData: ImageData = {
        ...defaultImageData,
        availableWidths: [50, 100],
      };

      await render(
        <template>
          <ResponsiveImage @width={{50}} @src={{imageData}} />
        </template>,
      );

      // jpeg
      assert
        .dom('picture source[type="image/jpeg"]')
        .hasAttribute(
          "srcset",
          "/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x",
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
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          "srcset",
          "/provider/w50/image.avif 1x, /provider/w100/image.avif 2x",
        );

      await render(
        <template>
          <ResponsiveImage @width={{10}} @src={{defaultImageData}} />
        </template>,
      );

      // jpeg
      assert
        .dom('picture source[type="image/jpeg"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.jpeg 1x, /provider/w20/image.jpeg 2x",
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.webp 1x, /provider/w20/image.webp 2x",
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          "srcset",
          "/provider/w10/image.avif 1x, /provider/w20/image.avif 2x",
        );
    });

    test("it renders the fallback src", async function (assert) {
      await render(
        <template>
          <ResponsiveImage @width={{320}} @src={{defaultImageData}} />
        </template>,
      );
      assert.dom("img").hasAttribute("src", "/provider/w320/image.jpeg");

      await render(
        <template>
          <ResponsiveImage @width={{100}} @src={{defaultImageData}} />
        </template>,
      );
      assert.dom("img").hasAttribute("src", "/provider/w100/image.jpeg");
    });
  });

  module("LQIP", function () {
    test("it sets LQIP class", async function (this: RenderingTestContext, assert) {
      const { onload, loaded } = imageLoaded();
      const imageData: ImageData = {
        imageTypes: ["jpeg", "webp"],
        // to replicate the loading timing, we need to load a real existing image
        imageUrlFor: () => `/test-image.jpg?${cacheBreaker()}`,
        aspectRatio: 1.5,
        lqip: {
          type: "inline",
          class: "lqip-inline-test-class",
        },
      };

      await render(
        <template><ResponsiveImage @src={{imageData}} {{onload}} /></template>,
      );

      const imgEl = this.element.querySelector("img")!;

      if (!imgEl.complete) {
        assert.dom(imgEl).hasClass("lqip-inline-test-class");
      }

      await loaded;

      assert.dom(imgEl).hasNoClass("lqip-inline-test-class");
    });

    test("it sets LQIP from blurhash as background", async function (this: RenderingTestContext, assert) {
      const { onload, loaded } = imageLoaded();
      const imageData: ImageData = {
        imageTypes: ["jpeg", "webp"],
        // to replicate the loading timing, we need to load a real existing image
        imageUrlFor: () => `/test-image.jpg?${cacheBreaker()}`,
        aspectRatio: 1.5,
        lqip: {
          type: "blurhash",
          hash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
          width: 4,
          height: 3,
        },
      };

      await render(
        <template><ResponsiveImage @src={{imageData}} {{onload}} /></template>,
      );

      const imgEl = this.element.querySelector("img")!;

      if (!imgEl.complete) {
        assert.ok(
          imgEl.style.backgroundImage?.match(/data:image\/png/),
          "it has a background PNG",
        );
        assert.dom(imgEl).hasStyle({ "background-size": "cover" });
        assert.ok(
          window.getComputedStyle(imgEl).backgroundImage?.length > 100,
          "the background SVG has a reasonable length",
        );
      }

      await loaded;

      assert.strictEqual(
        window.getComputedStyle(imgEl).backgroundImage,
        "none",
        "after image is loaded the background PNG is removed",
      );
    });
  });
});
