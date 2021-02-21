import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ResponsiveImageService, {
  ImageMeta,
  ImageType,
  LqipBlurhash,
  Meta,
} from 'ember-responsive-image/services/responsive-image';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwnConfig, macroCondition } from '@embroider/macros';
import { decode } from 'blurhash';

declare module '@embroider/macros' {
  export function getOwnConfig(): { usesBlurhash: boolean };
}

interface ResponsiveImageComponentArgs {
  src: string;
  size?: number;
  sizes?: string;
  width?: number;
  height?: number;
}

interface PictureSource {
  srcset: string;
  type: ImageType;
  mimeType: string;
  sizes?: string;
}

enum Layout {
  RESPONSIVE = 'responsive',
  FIXED = 'fixed',
}

const PIXEL_DENSITIES = [1, 2];
const canvas =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (typeof FastBoot === 'undefined' &&
    document.createElement('canvas')) as HTMLCanvasElement;

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentArgs> {
  @service
  responsiveImage!: ResponsiveImageService;

  @tracked
  isLoaded = false;

  constructor(owner: unknown, args: ResponsiveImageComponentArgs) {
    super(owner, args);
    assert('No image argument supplied for <ResponsiveImage>', args.src);
  }

  get layout(): Layout {
    return this.args.width === undefined && this.args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): PictureSource[] {
    if (this.layout === Layout.RESPONSIVE) {
      return this.responsiveImage
        .getAvailableTypes(this.args.src)
        .map((type) => {
          const sources: string[] = this.responsiveImage
            .getImages(this.args.src, type)
            .map((imageMeta) => `${imageMeta.image} ${imageMeta.width}w`);

          return {
            srcset: sources.join(', '),
            sizes:
              this.args.sizes ??
              (this.args.size ? `${this.args.size}vw` : undefined),
            type,
            mimeType: `image/${type}`,
          };
        });
    } else {
      const width = this.width;
      if (width === undefined) {
        return [];
      }

      return this.responsiveImage
        .getAvailableTypes(this.args.src)
        .map((type) => {
          const sources: string[] = PIXEL_DENSITIES.map((density) => {
            const imageMeta = this.responsiveImage.getImageMetaByWidth(
              this.args.src,
              width * density,
              type
            )!;

            return `${imageMeta.image} ${density}x`;
          }).filter((source) => source !== undefined);

          return {
            srcset: sources.join(', '),
            type,
            mimeType: `image/${type}`,
          };
        });
    }
  }

  get sourcesSorted(): PictureSource[] {
    return this.sources.sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0)
    );
  }

  get imageMeta(): ImageMeta | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return this.responsiveImage.getImageMetaBySize(
        this.args.src,
        this.args.size
      );
    } else {
      return this.responsiveImage.getImageMetaByWidth(
        this.args.src,
        this.width ?? 0
      );
    }
  }

  get meta(): Meta {
    return this.responsiveImage.getMeta(this.args.src);
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    return this.imageMeta?.image;
  }

  get width(): number | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return this.imageMeta?.width;
    } else {
      if (this.args.width) {
        return this.args.width;
      }

      const ar = this.responsiveImage.getAspectRatio(this.args.src);
      if (ar !== undefined && ar !== 0 && this.args.height !== undefined) {
        return this.args.height * ar;
      }

      return undefined;
    }
  }

  get height(): number | undefined {
    if (this.layout === Layout.RESPONSIVE) {
      return this.imageMeta?.height;
    } else {
      if (this.args.height) {
        return this.args.height;
      }

      const ar = this.responsiveImage.getAspectRatio(this.args.src);
      if (ar !== undefined && ar !== 0 && this.args.width !== undefined) {
        return this.args.width / ar;
      }

      return undefined;
    }
  }

  get classNames(): string {
    const classNames = [`eri-${this.layout}`];
    const lqip = this.meta.lqip;
    if (lqip && !this.isLoaded) {
      classNames.push(`eri-lqip-${lqip.type}`);
      if (lqip.type === 'color' || lqip.type === 'inline') {
        classNames.push(lqip.class);
      }
    }

    return classNames.join(' ');
  }

  get hasLqipBlurhash(): boolean {
    if (macroCondition(getOwnConfig().usesBlurhash)) {
      return this.meta.lqip?.type === 'blurhash';
    } else {
      return false;
    }
  }

  get showLqipBlurhash(): boolean {
    return !this.isLoaded && this.hasLqipBlurhash;
  }

  get lqipBlurhash(): string | undefined {
    if (macroCondition(getOwnConfig().usesBlurhash)) {
      if (!this.hasLqipBlurhash) {
        return undefined;
      }
      const { hash, width, height } = (this.meta as Required<Meta>)
        .lqip as LqipBlurhash;

      // This does not work correctly, see https://github.com/embroider-build/embroider/issues/684
      // The idea was to pull `blurhash` into our vendor.js only when needed
      // Currently we are instead importing it at the module head, but this comes at a cost for all users that don't need it.
      // const { decode } = importSync('blurhash') as any;

      const blurWidth = width * 40;
      const blurHeight = height * 40;
      const pixels = decode(hash, blurWidth, blurHeight);
      canvas.width = blurWidth;
      canvas.height = blurHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return undefined;
      }

      const imageData = ctx.createImageData(blurWidth, blurHeight);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
      const uri = canvas.toDataURL('image/png');

      return `url("${uri}")`;
    } else {
      return undefined;
    }
  }

  @action
  onLoad(): void {
    this.isLoaded = true;
  }
}
