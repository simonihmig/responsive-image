import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { setConfig } from '@responsive-image/core';

import type { Config } from '@responsive-image/cdn';

setConfig<Config>('cdn', {
  cloudinary: {
    cloudName: 'responsive-image',
  },
  imgix: {
    domain: 'responsive-image.imgix.net',
  },
  netlify: {
    domain: 'responsive-image.dev',
  },
});

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - ResponsiveImage</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
