<script lang="ts">
	import {
		type ImageType,
		type ImageData,
		getDestinationWidthBySize,
		env,
		getValueOrCallback
	} from '@responsive-image/core';

	import type { HTMLImgAttributes } from 'svelte/elements';

	const {
		src: srcProp,
		size: sizeProp,
		sizes: sizesProp,
		width: widthProp,
		height: heightProp,
		...htmlAttributes
	}: ResponsiveImageProps = $props();

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

	const PIXEL_DENSITIES = [1, 2];

	// determines the order of sources, prefereing next-gen formats over legacy
	const typeScore = new Map<ImageType, number>([
		['png', 1],
		['jpeg', 1],
		['webp', 2],
		['avif', 3]
	]);

	let isLoaded = $state(false);

	const isResponsiveLayout = $derived(widthProp === undefined && heightProp === undefined);

	const width: number | undefined = $derived.by(() => {
		if (isResponsiveLayout) {
			return getDestinationWidthBySize(sizeProp);
		} else {
			if (widthProp) {
				return widthProp;
			} else {
				const ar = srcProp.aspectRatio;
				if (ar !== undefined && ar !== 0 && heightProp !== undefined) {
					return heightProp * ar;
				}
			}

			return undefined;
		}
	});

	const height: number | undefined = $derived.by(() => {
		if (heightProp) {
			return heightProp;
		}

		const ar = srcProp.aspectRatio;
		if (heightProp === undefined && ar !== undefined && ar !== 0 && width !== undefined) {
			return Math.round(width / ar);
		}

		return undefined;
	});

	const src = $derived(srcProp.imageUrlFor(width ?? 640));

	const sources: ImageSource[] = $derived.by(() => {
		if (isResponsiveLayout) {
			return srcProp.imageTypes.map((type) => {
				let widths = srcProp.availableWidths;
				if (!widths) {
					widths = env.deviceWidths;
				}
				const sources: string[] = widths.map((width) => {
					const url = srcProp.imageUrlFor(width, type);
					return `${url} ${width}w`;
				});

				return {
					srcset: sources.join(', '),
					sizes: sizesProp ?? (sizeProp ? `${sizeProp}vw` : undefined),
					type,
					mimeType: `image/${type}`
				};
			});
		} else {
			if (width === undefined) {
				return [];
			} else {
				return srcProp.imageTypes.map((type) => {
					const sources: string[] = PIXEL_DENSITIES.map((density) => {
						const url = srcProp.imageUrlFor(width * density, type)!;

						return `${url} ${density}x`;
					}).filter((source) => source !== undefined);

					return {
						srcset: sources.join(', '),
						type,
						mimeType: `image/${type}`
					};
				});
			}
		}
	});

	const sourcesSorted = $derived(
		sources.sort((a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0))
	);

	const classNames = $derived.by(() => {
		const classNames = ['ri-img', `ri-${isResponsiveLayout ? 'responsive' : 'fixed'}`];
		const lqipClass = srcProp.lqip?.class;

		if (lqipClass && !isLoaded) {
			classNames.push(getValueOrCallback(lqipClass));
		}

		return classNames;
	});

	const bgImage = $derived.by(() => {
		if (isLoaded || typeof document === 'undefined') {
			return undefined;
		}

		const bgImage = srcProp.lqip?.bgImage;
		return bgImage ? `url("${getValueOrCallback(bgImage)}")` : undefined;
	});
</script>

<picture>
	{#each sourcesSorted as s}
		<source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
	{/each}
	<img
		{width}
		{height}
		loading="lazy"
		decoding="async"
		{src}
		alt=""
		class={classNames.join(' ')}
		{...htmlAttributes}
		data-ri-lqip={srcProp.lqip?.attribute}
		style:background-image={bgImage}
		style:background-size={bgImage ? 'cover' : undefined}
		onload={() => (isLoaded = true)}
	/>
</picture>

<style>
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
