export function assert(message: string, check: boolean): asserts check is true {
  if (!check) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
