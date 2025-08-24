<script lang="ts">
	import {
		type ImageData,
		type ImageUrlForType,
		getDestinationWidthBySize,
		env,
		getValueOrCallback
	} from '@responsive-image/core';

	import type { ClassValue, HTMLImgAttributes } from 'svelte/elements';

	const {
		src: srcProp,
		size: sizeProp,
		sizes: sizesProp,
		width: widthProp,
		height: heightProp,
		class: classProp,
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

	const src = $derived.by(() => {
		const format = srcProp.imageTypes === 'auto' ? 'auto' : undefined;
		return srcProp.imageUrlFor(width ?? 640, format);
	});

	const sources: ImageSource[] = $derived.by(() => {
		const imageTypes = Array.isArray(srcProp.imageTypes)
			? srcProp.imageTypes
			: [srcProp.imageTypes];
		if (isResponsiveLayout) {
			return imageTypes.map((type) => {
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
					mimeType: type != 'auto' ? `image/${type}` : undefined
				};
			});
		} else {
			if (width === undefined) {
				return [];
			} else {
				return imageTypes.map((type) => {
					const sources: string[] = PIXEL_DENSITIES.map((density) => {
						const url = srcProp.imageUrlFor(width * density, type)!;

						return `${url} ${density}x`;
					}).filter((source) => source !== undefined);

					return {
						srcset: sources.join(', '),
						type,
						mimeType: type != 'auto' ? `image/${type}` : undefined
					};
				});
			}
		}
	});

	const sourcesSorted = $derived(
		sources.sort((a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0))
	);

	const classNames = $derived.by(() => {
		const classNames: ClassValue[] = [
			'ri-img',
			`ri-${isResponsiveLayout ? 'responsive' : 'fixed'}`
		];
		const lqipClass = srcProp.lqip?.class;

		if (lqipClass && !isLoaded) {
			classNames.push(getValueOrCallback(lqipClass));
		}

		if (classProp) {
			classNames.push(classProp);
		}

		return classNames;
	});

	const styles = $derived.by(() => {
		if (isLoaded || typeof document === 'undefined') {
			return {};
		}

		return getValueOrCallback(srcProp.lqip?.inlineStyles) ?? {};
	});

	// Geez, no primitive in Svelte for applying styles from an object! See https://github.com/sveltejs/svelte/issues/7311
	const applyStyles = (el: HTMLElement) => {
		const existingStyles: Set<string> = new Set();

		$effect(() => {
			const rulesToRemove: Set<string> = new Set(existingStyles);
			existingStyles.clear();
			for (const [cssProperty, value] of Object.entries(styles)) {
				if (value !== undefined) {
					el.style.setProperty(cssProperty, value);
					rulesToRemove.delete(cssProperty);
					existingStyles.add(cssProperty);
				}
			}

			rulesToRemove.forEach((rule) => el.style.removeProperty(rule));
		});
	};
</script>

{#if srcProp.imageTypes === 'auto'}
	<img
		{width}
		{height}
		loading="lazy"
		decoding="async"
		srcset={sourcesSorted[0]?.srcset}
		{src}
		alt=""
		class={classNames.join(' ')}
		{...htmlAttributes}
		data-ri-lqip={srcProp.lqip?.attribute}
		use:applyStyles
		onload={() => (isLoaded = true)}
	/>
{:else}
	<picture>
		{#each sourcesSorted as s (s.mimeType)}
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
			use:applyStyles
			onload={() => (isLoaded = true)}
		/>
	</picture>
{/if}

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
