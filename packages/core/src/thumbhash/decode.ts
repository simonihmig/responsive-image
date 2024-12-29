// Replace this with the native feature once fully available in browsers!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
// https://caniuse.com/?search=fromBase64
import { decode } from 'base64-arraybuffer';
import { thumbHashToDataURL } from 'thumbhash';

export function decode2url(hash: string): string | undefined {
  const arrayBuffer = decode(hash);
  return thumbHashToDataURL(new Uint8Array(arrayBuffer));
}
