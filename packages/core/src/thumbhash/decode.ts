import { decode } from 'base64-arraybuffer';
import { thumbHashToDataURL } from 'thumbhash';

export function decode2url(hash: string): string | undefined {
  const arrayBuffer = decode(hash);
  return thumbHashToDataURL(new Uint8Array(arrayBuffer));
}
