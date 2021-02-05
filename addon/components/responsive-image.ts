import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ResponsiveImageService, {
  ImageMeta,
  ImageType,
} from 'ember-responsive-image/services/responsive-image';
import { assert } from '@ember/debug';

interface ResponsiveImageComponentArgs {
  image: string;
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

  constructor(owner: unknown, args: ResponsiveImageComponentArgs) {
    super(owner, args);
    assert('No image argument supplied for <ResponsiveImage>', args.image);
  }

  get layout(): Layout {
    return this.args.width === undefined && this.args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;
  }

  get sources(): PictureSource[] {
    if (this.layout === Layout.RESPONSIVE) {
      return this.responsiveImage
        .getAvailableTypes(this.args.image)
        .map((type) => {
          const sources: string[] = this.responsiveImage
            .getImages(this.args.image, type)
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
        .getAvailableTypes(this.args.image)
        .map((type) => {
          const sources: string[] = PIXEL_DENSITIES.map((density) => {
            const imageMeta = this.responsiveImage.getImageMetaByWidth(
              this.args.image,
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
        this.args.image,
        this.args.size
      );
    } else {
      return this.responsiveImage.getImageMetaByWidth(
        this.args.image,
        this.width ?? 0
      );
    }
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

      const ar = this.responsiveImage.getAspectRatio(this.args.image);
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

      const ar = this.responsiveImage.getAspectRatio(this.args.image);
      if (ar !== undefined && ar !== 0 && this.args.width !== undefined) {
        return this.args.width / ar;
      }

      return undefined;
    }
  }
}
