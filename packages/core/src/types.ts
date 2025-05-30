export type ImageType = 'png' | 'jpeg' | 'webp' | 'avif';

export type NonFunction =
  | string
  | number
  | boolean
  | undefined
  | null
  | object
  | Array<unknown>;
export type ValueOrCallback<T extends NonFunction> = T | (() => T);

export interface Lqip {
  /**
   * While the real image is loading the image component would apply this class.
   */
  class?: ValueOrCallback<string>;

  /**
   * If set, the image component will apply a data-ri-lqip=<value> attribute, which can be used e.g. for embedded decoding information for SSR
   */
  attribute?: string;

  /**
   * Image components may apply this inline CSS (aka CSS-in-JS). Used when components make use of Shadow DOM, where CSS imports that build systems would apply to document.head would not get applied behind the Shadow DOM.
   */
  inlineStyles?: ValueOrCallback<Record<string, string | undefined>>;
}

export interface ImageData {
  imageTypes: ImageType[];
  availableWidths?: number[];
  aspectRatio?: number;
  imageUrlFor(width: number, type?: ImageType): string | undefined;
  lqip?: Lqip;
}

export interface ImageOutputResult {
  url: string;
  width: number;
  format: ImageType;
}

export interface Env {
  screenWidth: number;
  physicalWidth: number;
  devicePixelRatio: number;
  deviceWidths: number[];
}

export interface EnvConfig {
  deviceWidths?: number[];
}
