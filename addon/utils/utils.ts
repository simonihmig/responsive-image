export function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}
