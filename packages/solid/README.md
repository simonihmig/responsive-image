# @responsive-image/solid

Solid component to render responsive images, provided as locally processed images or loaded remotely from Image CDNs.

Part of the [ResponsiveImage](https://github.com/simonihmig/responsive-image) project.

## Compatibility

- Solid 1.6 or above
- Solid 2.x or above

A single uncompiled source ships under the `solid` export condition (the
consumer's Solid toolchain compiles it for the installed major), with a
pre-compiled fallback for non-Solid-aware tools. Both majors are covered by
dedicated client and SSR test suites.

## Development

The tests run against one Solid major at a time, picked up from the installed
`solid-js` version. The regular `pnpm test` runs them against Solid v1. For v2,
from the repo root:

```sh
pnpm test:solid-v2
```

This applies the `solid-v2` scenario from [`.try.mjs`](../../.try.mjs), installs
the v2 dependencies, runs the client and SSR suites, and restores
`package.json` and `pnpm-lock.yaml` afterwards. It is the same setup the
`solid-v2` CI job uses.

## Documentation

Visit [responsive-image.dev](https://responsive-image.dev) for our complete documentation site.

## License

This project is licensed under the [MIT License](LICENSE.md).
