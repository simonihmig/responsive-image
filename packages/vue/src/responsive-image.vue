<script setup lang="ts">
import {
  createLqipKey,
  getClassNames,
  getHeight,
  getSources,
  getSourcesSorted,
  getSrc,
  getValueOrCallback,
  getWidth,
  type ImageData,
  type ResponsiveImageArgs,
} from '@responsive-image/core';
import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';

import type { ImgHTMLAttributes } from 'vue';

type ResponsiveImageProps = ResponsiveImageArgs &
  /* @vue-ignore */ Omit<ImgHTMLAttributes, keyof ResponsiveImageArgs | 'src'>;

const args = defineProps<ResponsiveImageProps>();
defineOptions({
  inheritAttrs: false,
});

const loadedSrc = shallowRef<ImageData | undefined>();

const isLoaded = () => loadedSrc.value === args.src;

const width = () => getWidth(args);

const height = () => getHeight(args);

const src = () => getSrc(args);

const sources = () => getSources(args);

const sourcesSorted = () => getSourcesSorted(sources());

const classNames = () => getClassNames(args, isLoaded());

const styles = computed(() => {
  if (
    isLoaded() ||
    mounted.value === false ||
    typeof document === 'undefined'
  ) {
    return undefined;
  }

  return getValueOrCallback(args.src.lqip?.inlineStyles);
});

const getLqipKey = createLqipKey();

// When LQIP is used, we need to use a key, so when src changes, the img element is recreated to re-apply LQIP styles without having
// the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
// See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
// Ideally, we would just use src as the key, but Vue only allows for simple values (numbers or strings) as key, so we need to use
// a mapping of src to generated primitive keys, that ensures that we get the same key for the same src
const key = () => getLqipKey(args.src);

const imgEl = useTemplateRef<HTMLImageElement>('imgEl');
const mounted = ref(false);
onMounted(() => {
  if (imgEl.value?.complete) {
    loadedSrc.value = args.src;
  }
  // Triggering mounted will render inline LQIP styles which we don't want in SSR output.
  // Need to delay this here to not cause Vue SSR mismatch errors.
  setTimeout(() => (mounted.value = true), 0);
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
    :style="styles"
    v-bind="$attrs"
    @load="loadedSrc = args.src"
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
      :style="styles"
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
