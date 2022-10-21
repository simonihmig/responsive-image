import type { LoaderContext } from 'webpack';

export interface LoaderOptions {}

export default function loader(
  this: LoaderContext<LoaderOptions>,
  url: string
): string {
  return `export default ${JSON.stringify({ url })}`;
}
