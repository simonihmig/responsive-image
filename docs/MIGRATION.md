# Migrating from 0.x/1.x to 2.x

## Config

* The configuration of the addon moved from `config/environment.js` to `ember-cli-build.js`.
* The configuration now expects an object with an `images` key. So instead of `[{ // image options },...]` you would transform that to `{ images: [{ // image options },...]}`.
* the `sourceDir` and `destinationDir` image options have been removed in favor of an `include` glob pattern (array). So transform `sourceDir: 'some/path'` to `include: ['some/path/*']`.
* the `recursive` option has been removed. To process images in sub folders, use the `**` glob pattern: `include: ['some/path/**/*']`.
* the `extensions` option has been removed. To process only files with a certain extension you can integration the extension into the glob pattern: `include: ['some/path/*.jpg']`.
* rename your `supportedWidths` option to just `widths`.

## `<ResponsiveImage>` Component

* the `@image` argument has been renamed to `@src`, and it now refers to the image using its full path (just like a normal `<img src="...">` does!).
* the rendered markup now has the `<img>` element wrapped in a `<picture>`. In most cases this should not be noticeable, but when your CSS is sensitive to the nesting like for example with a flexbox layout or a direct child selector `.some > img` the CSS might be applied differently now.
* The image is loaded lazily by default, using the browser's native capabilites (if supported). This can cause difference in loading timings, eventually leading to *worse* performance metrics (like FCP/LCP) when an image is clearly above the fold, but the browser needs to wait for the first page layout to happen before it can decide weather it needs to be loaded. So for images *above* the fold it is recommended to set loading to "eager": `<ResponsiveImage @src="some/image.jpg" loading="eager"/>`.
* The image will have responsive CSS applied by default (unless you make it a "fixed" layout, see the main docs), so check if that causes any layout changes.

## Other changes

* the `<ResponsiveBackground>` has been removed (as its capabilities to detect the optimal image size and format were too limited anyway). You can render a normal `<ResponsiveImage>` instead and make it behave like a background using CSS like in this example:
```css
img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}
```
* The previous mixins have been removed, as they don't fit well into the modern Octane paradigms like native classes.
* The `setupResponsiveImage()` test helper is not needed and not available anymore.
* The addon now integrates powerful LQIP (low quality image placeholders) techniques. These are not enabled by default, so no changes are expected. But be sure to look into these new options that you might want to enable.

