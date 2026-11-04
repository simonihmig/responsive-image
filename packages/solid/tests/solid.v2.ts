import { isServer, render as renderSolid, renderToString } from '@solidjs/web';

export { flush } from 'solid-js';
export { isServer, renderToString };

export function render(view: () => unknown): { container: HTMLDivElement } {
  const container = document.createElement('div');
  document.body.appendChild(container);
  renderSolid(view, container);
  return { container };
}

export function cleanup(): void {
  document.body.innerHTML = '';
}
