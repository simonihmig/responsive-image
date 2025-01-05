<script lang="ts">
	import type { ImageType, ImageData } from '@responsive-image/core';
	import type { HTMLImgAttributes } from 'svelte/elements';

	let { src }: ResponsiveImageProps = $props();

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

	const responsiveImageArgs: Array<keyof ResponsiveImageArgs> = [
		'src',
		'size',
		'sizes',
		'width',
		'height'
	];

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
	<img alt="" />
</picture>
