declare module 'base-n' {
  class BaseN {
    encode(i: number): string;
  }

  class factory {
    static create: (options?: any) => BaseN;
  }
  export default factory;
}
