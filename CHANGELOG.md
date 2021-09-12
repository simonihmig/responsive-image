
## v3.1.1 (2021-09-12)

#### :bug: Bug Fix
* [#339](https://github.com/kaliber5/ember-responsive-image/pull/339) Fix image lookup on Windows builds ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#335](https://github.com/kaliber5/ember-responsive-image/pull/335) Configure Renovate ([@renovate[bot]](https://github.com/apps/renovate))
* [#340](https://github.com/kaliber5/ember-responsive-image/pull/340) Fix devDependencies for Ember 4 ([@simonihmig](https://github.com/simonihmig))
* [#338](https://github.com/kaliber5/ember-responsive-image/pull/338) Run CI on Windows ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v3.1.0 (2021-08-18)

#### :rocket: Enhancement
* [#329](https://github.com/kaliber5/ember-responsive-image/pull/329) Upgrade sharp to 0.29.0, enhancing AVIF performance and compatibility w/ Chrome 93+ ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#330](https://github.com/kaliber5/ember-responsive-image/pull/330) Fix broken FastBoot rendering of imgix provider ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#332](https://github.com/kaliber5/ember-responsive-image/pull/332) Fix CI for Ember 4.x ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v3.0.1 (2021-07-26)

#### :bug: Bug Fix
* [#323](https://github.com/kaliber5/ember-responsive-image/pull/323) Don't fail the build if images config is empty ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v3.0.0 (2021-07-23)

#### :boom: Breaking Change
* [#284](https://github.com/kaliber5/ember-responsive-image/pull/284) Drop node 10 support ([@simonihmig](https://github.com/simonihmig))
* [#283](https://github.com/kaliber5/ember-responsive-image/pull/283) Update to Ember 3.27, drop support for Ember 3.16 ([@simonihmig](https://github.com/simonihmig))
* [#297](https://github.com/kaliber5/ember-responsive-image/pull/297) Extract functionality for local images into separate service ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#273](https://github.com/kaliber5/ember-responsive-image/pull/273) Add image provider API, implement basic Cloudinary image CDN support ([@simonihmig](https://github.com/simonihmig))
* [#280](https://github.com/kaliber5/ember-responsive-image/pull/280) Support custom transformations in Cloudinary provider ([@simonihmig](https://github.com/simonihmig))
* [#281](https://github.com/kaliber5/ember-responsive-image/pull/281) Support specifying image formats in Cloudinary provider ([@simonihmig](https://github.com/simonihmig))
* [#299](https://github.com/kaliber5/ember-responsive-image/pull/299) Support Cloudinary's remote fetching mode ([@simonihmig](https://github.com/simonihmig))
* [#308](https://github.com/kaliber5/ember-responsive-image/pull/308) Support Cloudinary's chained transformations ([@simonihmig](https://github.com/simonihmig))
* [#310](https://github.com/kaliber5/ember-responsive-image/pull/310) Add imgix provider ([@simonihmig](https://github.com/simonihmig))
* [#311](https://github.com/kaliber5/ember-responsive-image/pull/311) Support custom parameters for imgix provider ([@simonihmig](https://github.com/simonihmig))
* [#314](https://github.com/kaliber5/ember-responsive-image/pull/314) Support a custom quality setting for cloudinary and imgix providers ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* [#312](https://github.com/kaliber5/ember-responsive-image/pull/312) Add docs for provider configuration ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#298](https://github.com/kaliber5/ember-responsive-image/pull/298) Run CI with Firefox ([@simonihmig](https://github.com/simonihmig))
* [#284](https://github.com/kaliber5/ember-responsive-image/pull/284) Drop node 10 support ([@simonihmig](https://github.com/simonihmig))
* [#283](https://github.com/kaliber5/ember-responsive-image/pull/283) Update to Ember 3.27, drop support for Ember 3.16 ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.0.0 (2021-03-09)

This is a major new release, with a lot of new features and several breaking changes. Please see the changelog below of previous changes of the several RC-releases and the [Migration Guide](docs/MIGRATION.md) when upgrading!

#### :bug: Bug Fix
* [#184](https://github.com/kaliber5/ember-responsive-image/pull/184) Fix use of absolute path for `src` attribute ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* [#196](https://github.com/kaliber5/ember-responsive-image/pull/196) Add a migration guide ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.0.0-rc.5 (2021-03-06)

#### :rocket: Enhancement
* [#183](https://github.com/kaliber5/ember-responsive-image/pull/183) Disable AVIF by default ([@simonihmig](https://github.com/simonihmig))
* [#182](https://github.com/kaliber5/ember-responsive-image/pull/182) Change `formats` config option to allow special `original` reference ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v2.0.0-rc.4 (2021-03-05)

#### :boom: Breaking Change
* [#180](https://github.com/kaliber5/ember-responsive-image/pull/180) Refactor internal meta format, add own fingerprinting implementation ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#180](https://github.com/kaliber5/ember-responsive-image/pull/180) Refactor internal meta format, add own fingerprinting implementation ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v2.0.0-rc.3 (2021-02-24)

#### :rocket: Enhancement
* [#177](https://github.com/kaliber5/ember-responsive-image/pull/177) Optimize Blurhash performance ([@simonihmig](https://github.com/simonihmig))
* [#178](https://github.com/kaliber5/ember-responsive-image/pull/178) Move meta data script to end of body, to improve FastBoot performance ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v2.0.0-rc.2 (2021-02-23)

#### :rocket: Enhancement
* [#172](https://github.com/kaliber5/ember-responsive-image/pull/172) Add support for Blurhash in FastBoot ([@simonihmig](https://github.com/simonihmig))
* [#162](https://github.com/kaliber5/ember-responsive-image/pull/162) Apply LQIP styles with dynamically generated CSS, to support FastBoot ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#176](https://github.com/kaliber5/ember-responsive-image/pull/176) Delay setting src attribute after <img> is in DOM to prevent extraneous image loading ([@simonihmig](https://github.com/simonihmig))
* [#175](https://github.com/kaliber5/ember-responsive-image/pull/175) Limit Blurhash size to allowed values ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#173](https://github.com/kaliber5/ember-responsive-image/pull/173) Import htmlSafe from `@ember/template` ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.0.0-rc.1 (2021-02-20)

#### :bug: Bug Fix
* [#159](https://github.com/kaliber5/ember-responsive-image/pull/159) Handle absolute image path ([@simonihmig](https://github.com/simonihmig))
* [#158](https://github.com/kaliber5/ember-responsive-image/pull/158) Fix plugins path ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v2.0.0-rc.0 (2021-02-20)

#### :boom: Breaking Change
* [#154](https://github.com/kaliber5/ember-responsive-image/pull/154) Rename `@image` argument to `@src` ([@simonihmig](https://github.com/simonihmig))
* [#155](https://github.com/kaliber5/ember-responsive-image/pull/155) Rename `supportedWidths` config option to `widths` ([@simonihmig](https://github.com/simonihmig))
* [#136](https://github.com/kaliber5/ember-responsive-image/pull/136) Move addon options into ember-cli-build.js ([@simonihmig](https://github.com/simonihmig))
* [#130](https://github.com/kaliber5/ember-responsive-image/pull/130) Support fixed and responsive layouts ([@simonihmig](https://github.com/simonihmig))
* [#115](https://github.com/kaliber5/ember-responsive-image/pull/115) Change config to support different configurations per file pattern ([@simonihmig](https://github.com/simonihmig))
* [#113](https://github.com/kaliber5/ember-responsive-image/pull/113) Refactor the ember-cli hooks integration, remove setupResponsiveImage test-helper ([@simonihmig](https://github.com/simonihmig))
* [#111](https://github.com/kaliber5/ember-responsive-image/pull/111) Refactor ResponsiveImage to Glimmer component ([@simonihmig](https://github.com/simonihmig))
* [#110](https://github.com/kaliber5/ember-responsive-image/pull/110) Remove mixins ([@simonihmig](https://github.com/simonihmig))
* [#109](https://github.com/kaliber5/ember-responsive-image/pull/109) Remove ResponsiveBackground component ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#157](https://github.com/kaliber5/ember-responsive-image/pull/157) Update helper to support image format ([@simonihmig](https://github.com/simonihmig))
* [#153](https://github.com/kaliber5/ember-responsive-image/pull/153) Add `content-visibility: auto;` for lazy rendering ([@simonihmig](https://github.com/simonihmig))
* [#137](https://github.com/kaliber5/ember-responsive-image/pull/137) Add support for blurhash-based LQIP ([@simonihmig](https://github.com/simonihmig))
* [#136](https://github.com/kaliber5/ember-responsive-image/pull/136) Move addon options into ember-cli-build.js ([@simonihmig](https://github.com/simonihmig))
* [#135](https://github.com/kaliber5/ember-responsive-image/pull/135) Add support for a dominant color LQIP strategy ([@simonihmig](https://github.com/simonihmig))
* [#133](https://github.com/kaliber5/ember-responsive-image/pull/133) Add built-in support for a blurry placeholder (LQIP) ([@simonihmig](https://github.com/simonihmig))
* [#132](https://github.com/kaliber5/ember-responsive-image/pull/132) Add AVIF format support ([@simonihmig](https://github.com/simonihmig))
* [#131](https://github.com/kaliber5/ember-responsive-image/pull/131) Let the browser decode images asynchronously ([@simonihmig](https://github.com/simonihmig))
* [#130](https://github.com/kaliber5/ember-responsive-image/pull/130) Support fixed and responsive layouts ([@simonihmig](https://github.com/simonihmig))
* [#129](https://github.com/kaliber5/ember-responsive-image/pull/129) Enable native lazy loading by default ([@simonihmig](https://github.com/simonihmig))
* [#128](https://github.com/kaliber5/ember-responsive-image/pull/128) Refactor component to render `<picture>` element, supporting multiple image types ([@simonihmig](https://github.com/simonihmig))
* [#127](https://github.com/kaliber5/ember-responsive-image/pull/127) Migrate to TypeScript ([@simonihmig](https://github.com/simonihmig))
* [#114](https://github.com/kaliber5/ember-responsive-image/pull/114) Add Embroider support ([@simonihmig](https://github.com/simonihmig))
* [#116](https://github.com/kaliber5/ember-responsive-image/pull/116) Add WebP format support ([@simonihmig](https://github.com/simonihmig))
* [#115](https://github.com/kaliber5/ember-responsive-image/pull/115) Change config to support different configurations per file pattern ([@simonihmig](https://github.com/simonihmig))
* [#113](https://github.com/kaliber5/ember-responsive-image/pull/113) Refactor the ember-cli hooks integration, remove setupResponsiveImage test-helper ([@simonihmig](https://github.com/simonihmig))
* [#111](https://github.com/kaliber5/ember-responsive-image/pull/111) Refactor ResponsiveImage to Glimmer component ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* [#152](https://github.com/kaliber5/ember-responsive-image/pull/152) Update documentation for v2 ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#112](https://github.com/kaliber5/ember-responsive-image/pull/112) Refactor service and helper to native classes ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.0.1 (2021-01-08)

#### :house: Internal
* [#102](https://github.com/kaliber5/ember-responsive-image/pull/102) Refactor image processor to async/await ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.0.0 (2021-01-08)

#### :boom: Breaking Change
* [#80](https://github.com/kaliber5/ember-responsive-image/pull/80) Update Ember, drop support for Ember < 3.16, migrate tests to QUnit ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#71](https://github.com/kaliber5/ember-responsive-image/pull/71) Add option to recursively process sub directories of sourcePath ([@elgordino](https://github.com/elgordino))

#### :memo: Documentation
* [#100](https://github.com/kaliber5/ember-responsive-image/pull/100) Update README for Octane patterns ([@simonihmig](https://github.com/simonihmig))
* [#69](https://github.com/kaliber5/ember-responsive-image/pull/69) JSDoc typo ([@lolmaus](https://github.com/lolmaus))

#### :house: Internal
* [#83](https://github.com/kaliber5/ember-responsive-image/pull/83) Setup Dependabot ([@simonihmig](https://github.com/simonihmig))
* [#82](https://github.com/kaliber5/ember-responsive-image/pull/82) Refactor Fastboot and image processing tests ([@simonihmig](https://github.com/simonihmig))
* [#81](https://github.com/kaliber5/ember-responsive-image/pull/81) Add HTML attributes test ([@simonihmig](https://github.com/simonihmig))
* [#80](https://github.com/kaliber5/ember-responsive-image/pull/80) Update Ember, drop support for Ember < 3.16, migrate tests to QUnit ([@simonihmig](https://github.com/simonihmig))
* [#78](https://github.com/kaliber5/ember-responsive-image/pull/78) Setup release-it ([@simonihmig](https://github.com/simonihmig))
* [#77](https://github.com/kaliber5/ember-responsive-image/pull/77) Setup Github actions ([@simonihmig](https://github.com/simonihmig))

#### Committers: 4
- Andrey Mikhaylov (lolmaus) ([@lolmaus](https://github.com/lolmaus))
- Gordon Johnston ([@elgordino](https://github.com/elgordino))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

# Changelog
