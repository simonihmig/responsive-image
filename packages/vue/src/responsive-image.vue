<script setup lang="ts">
import {
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
  type ImageData,
  type ImageUrlForType,
} from '@responsive-image/core';
import { onMounted, ref, useTemplateRef } from 'vue';

import type { ImgHTMLAttributes } from 'vue';

interface ResponsiveImageArgs extends /* @vue-ignore */ Omit<
  ImgHTMLAttributes,
  'src'
> {
  src: ImageData;
  /**
   * The [sizes attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes) for `img`.
   */
  sizes?: string | undefined;
  /**
   * The [height attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#height) for `img`.
   */
  height?: number | undefined;
  /**
   * The [width attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#width) for `img`.
   */
  width?: number | undefined;
  /**
   * Number of vw units to use for responsive layout.
   */
  size?: number | undefined;
}

const args = defineProps<ResponsiveImageArgs>();
defineOptions({
  inheritAttrs: false,
});

interface ImageSource {
  srcset: string;
  type: ImageUrlForType;
  mimeType: string | undefined;
  sizes?: string | undefined;
}

const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageUrlForType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

const loadedSrc = ref<ImageData | undefined>();

const isLoaded = () => loadedSrc.value === args.src;

const isResponsiveLayout = () =>
  args.width === undefined && args.height === undefined;

const width = () => {
  if (isResponsiveLayout()) {
    return getDestinationWidthBySize(args.size);
  } else if (args.width) {
    return args.width;
  } else {
    const ar = args.src.aspectRatio;
    if (ar !== undefined && ar !== 0 && args.height !== undefined) {
      return args.height * ar;
    }
  }

  return undefined;
};

const height = () => {
  if (args.height) {
    return args.height;
  }

  const ar = args.src.aspectRatio;
  const w = width();
  if (ar !== undefined && ar !== 0 && w !== undefined) {
    return Math.round(w / ar);
  }

  return undefined;
};

const src = () => {
  const format = args.src.imageTypes === 'auto' ? 'auto' : undefined;
  return args.src.imageUrlFor(width() ?? 640, format);
};

const sources = (): ImageSource[] => {
  const imageTypes = Array.isArray(args.src.imageTypes)
    ? args.src.imageTypes
    : [args.src.imageTypes];

  if (isResponsiveLayout()) {
    return imageTypes.map((type) => {
      let widths = args.src.availableWidths;
      if (!widths) {
        widths = env.deviceWidths;
      }
      const sources: string[] = widths.map((width) => {
        const url = args.src.imageUrlFor(width, type);
        return `${url} ${width}w`;
      });

      return {
        srcset: sources.join(', '),
        sizes: args.sizes ?? (args.size ? `${args.size}vw` : undefined),
        type,
        mimeType: type === 'auto' ? undefined : `image/${type}`,
      };
    });
  } else {
    const w = width();
    if (w === undefined) {
      return [];
    } else {
      return imageTypes.map((type) => {
        const sources: string[] = PIXEL_DENSITIES.map((density) => {
          const url = args.src.imageUrlFor(w * density, type)!;

          return `${url} ${density}x`;
        }).filter((source) => source !== undefined);

        return {
          srcset: sources.join(', '),
          type,
          mimeType: type === 'auto' ? undefined : `image/${type}`,
        };
      });
    }
  }
};

const sourcesSorted = () =>
  sources().sort(
    (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
  );

const classNames = () => {
  const classNames = [
    'ri-img',
    `ri-${isResponsiveLayout() ? 'responsive' : 'fixed'}`,
  ];
  const lqipClass = args.src.lqip?.class;
  if (lqipClass && !isLoaded()) {
    classNames.push(getValueOrCallback(lqipClass));
  }

  return classNames;
};

const styles = () => {
  if (isLoaded() || typeof window === 'undefined') {
    return undefined;
  }

  return getValueOrCallback(args.src.lqip?.inlineStyles);
};

let keyCounter = 0;
const keyMap = new WeakMap<ImageData, number>();

// When LQIP is used, we need to use a key, so when src changes, the img element is recreated to re-apply LQIP styles without having
// the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
// See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
// Ideally, we would just use src as the key, but Vue only allows for simple values (numbers or strings) as key, so we need to use
// a mapping of src to generated primitive keys, that ensures that we get the same key for the same src
const key = () => {
  let key: number | undefined;

  if (args.src.lqip) {
    key = keyMap.get(args.src);

    if (key === undefined) {
      key = keyCounter++;
      keyMap.set(args.src, key);
    }
  }
  return key;
};

const imgEl = useTemplateRef<HTMLImageElement>('imgEl');
onMounted(() => {
  if (imgEl.value?.complete) {
    loadedSrc.value = args.src;
  }
});
</script>
<template>
  <img
    v-if="args.src.imageTypes === 'auto'"
    :key="key()"
    ref="imgEl"
    :width="width()"
    :height="height()"
    :class="classNames()"
    loading="lazy"
    decoding="async"
    :srcSet="args.src.imageTypes === 'auto' ? sources()[0]?.srcset : undefined"
    :src="src()"
    :data-ri-lqip="args.src.lqip?.attribute"
    v-bind="$attrs"
    :style="styles()"
  />
  <picture v-else>
    <source
      v-for="{ srcset, mimeType, sizes } in sourcesSorted()"
      :key="mimeType"
      :srcset="srcset"
      :type="mimeType"
      :sizes="sizes"
    />
    <img
      :key="key()"
      ref="imgEl"
      :width="width()"
      :height="height()"
      :class="classNames()"
      loading="lazy"
      decoding="async"
      :srcSet="
        typeof args.src.imageTypes === 'string' &&
        args.src.imageTypes === 'auto'
          ? sources()[0]?.srcset
          : undefined
      "
      :src="src()"
      :data-ri-lqip="args.src.lqip?.attribute"
      :style="styles()"
      v-bind="$attrs"
      @load="loadedSrc = args.src"
    />
  </picture>
</template>

<style scoped>
.ri-img {
  background-size: cover;
}

.ri-responsive {
  width: 100%;
  height: auto;
}

.ri-fixed,
.ri-responsive {
  content-visibility: auto;
}
</style>
