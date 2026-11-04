export { cleanup, render } from '@solidjs/testing-library';
export { isServer, renderToString } from 'solid-js/web';

// solid v1 commits writes synchronously, so there is nothing to flush
export const flush = (): void => {};
