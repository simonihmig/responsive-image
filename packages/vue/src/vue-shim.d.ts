declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    any
  >;
  export default component;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $myPlugin: {
      greet: (name: string) => string;
    };
  }
}

export {};
