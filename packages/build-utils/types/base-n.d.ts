declare module 'base-n' {
  class BaseN {
    encode(i: number): string;
  }

  class factory {
    static create: (options?: unknown) => BaseN;
  }
  export default factory;
}
