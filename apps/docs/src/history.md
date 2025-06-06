# History of the project

_Simon Ihmig_

This project has its roots in late 2016, when Andreas Schacht, my then co-worker, and [me](./team.md) started to work on `ember-responsive-image`. This came out of the need to render optimized responsive images in our framkework of choice [Ember.js](https://emberjs.com/), for client projects at [kaliber5](https://www.kaliber5.de), the consultancy that I co-founded.

As strong believers in open source software, and as this proved to be useful for others as well, we started the project in the open on GitHub, see the [first commit](https://github.com/simonihmig/responsive-image/commit/1718f0c6d113d21309cb3800338c944d5ba90943). Don't look too closely at the code though, 2016 was different! 😅

Over time it matured and improved. Feature-wise by adding support for e.g. next-gen image formats, Image CDNs or SSR (aka FastBoot in Ember world). Also much of the underlying implementation evolved, moving from invoking `ImageMagick` to using [`sharp`](https://sharp.pixelplumbing.com/), adopting Ember's [Octane](https://blog.emberjs.com/octane-is-here/) patterns (native classes, Glimmer components) and TypeScript.

But at some point it become obvious that we were running into a more fundamental technical problem, when [Embroider](https://github.com/embroider-build/embroider), Ember's next-gen build system, which is building a bridge towards adopting popular ecosystem build tools like webpack or Vite, was going to take over the very Ember-specific build system of Ember CLI. Alongside that came a new [v2 format](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/) to publish Ember addons. Previously, `ember-responsive-image` had the privilege of using the superpowers that v1 addons gave us, by being able to provide Ember runtime code (the component to render responsive images) _and_ plugging into the (legacy) Ember CLI build (for processing local images) _at the same time_. With the new v2 format, which are basically just static npm packages now that you import _runtime_ code from, this was not possible anymore. So what's next?

As Embroider embraced off-the-shelve build tools like [webpack](https://webpack.js.org/) and later [Vite](https://vitejs.dev/), this project basically had to do the same. Instead of tying our image processing into the legacy build system, we started to offer native [build-plugins](./build/index.md) for what Embroider uses already: webpack and Vite. These are now doing the heavy lifting, albeit in a completely frontend framework agnostic way!

This opened up the way to rethink the scope of this project: instead of being coupled to one specific framework, [Ember](https://emberjs.com/) (which I still love btw and encourage you to check out if you haven't lately!), this project started to move into a multi-framework project. Gone is the `ember-responsive-image` package, say hello to `@responsive-image/ember`, which is now a fully static lightweight v2 addon. Support for other frameworks is planned. Have ideas, or want to contribute? Feel free to raise an [issue](https://github.com/simonihmig/responsive-image/issues), [PR](https://github.com/simonihmig/responsive-image/pulls)'s are certainly very welcome as well! 😀

So stay tuned, the future is hopefully bright!

_PS. none of this would have been possible without the help of other people and building on the shoulders of giants, which I want to give [credit](credits.md) here!_
