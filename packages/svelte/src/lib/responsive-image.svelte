<script lang="ts">
	import type { ImageType, ImageData } from '@responsive-image/core';
	import type { HTMLImgAttributes } from 'svelte/elements';

	let { src, size, sizes, width, height, ...htmlAttributes }: ResponsiveImageProps = $props();

	interface ResponsiveImageArgs {
		src: ImageData;
		size?: number;
		sizes?: string;
		width?: number;
		height?: number;
	}

	type ResponsiveImageProps = Omit<HTMLImgAttributes, 'src'> & ResponsiveImageArgs;

	interface ImageSource {
		srcset: string;
		type: ImageType;
		mimeType: string;
		sizes?: string | undefined;
	}

	type Layout = 'responsive' | 'fixed';

	const PIXEL_DENSITIES = [1, 2];

	// determines the order of sources, prefereing next-gen formats over legacy
	const typeScore = new Map<ImageType, number>([
		['png', 1],
		['jpeg', 1],
		['webp', 2],
		['avif', 3]
	]);
</script>

<picture>
	<img loading="lazy" decoding="async" src="" alt="" {...htmlAttributes} />
</picture>
