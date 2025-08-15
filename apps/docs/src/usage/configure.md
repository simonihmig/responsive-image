# Configure

Using the `setConfig` method you can configure what device widths ResponsiveImage considers when generating the `<picture>`'s `<source>` list by overriding `deviceWidths`.

By default the largest device width is used as the source for the `<img>` tag fallback. If you want to override that value, set `fallbackScreenWidth`.

```ts
import { type EnvConfig, setConfig } from '@responsive-image/core';

setConfig<EnvConfig>('env', {
  deviceWidths: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  fallbackScreenWidth: 3840,
});
```
