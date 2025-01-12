<script lang="ts">
	import {
		type ImageType,
		type ImageData,
		getDestinationWidthBySize,
		env,
		isLqipBlurhash
	} from '@responsive-image/core';
	import type { HTMLImgAttributes } from 'svelte/elements';

	let {
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

	type Layout = 'responsive' | 'fixed';

	const PIXEL_DENSITIES = [1, 2];

	// determines the order of sources, prefereing next-gen formats over legacy
	const typeScore = new Map<ImageType, number>([
		['png', 1],
		['jpeg', 1],
		['webp', 2],
		['avif', 3]
	]);

	let isLoaded = $state(false);

	const isResponsiveLayout = widthProp === undefined && heightProp === undefined;

	let width: number | undefined = undefined;

	if (isResponsiveLayout) {
		width = getDestinationWidthBySize(sizeProp);
	} else {
		if (widthProp) {
			width = widthProp;
		} else {
			const ar = srcProp.aspectRatio;
			if (ar !== undefined && ar !== 0 && heightProp !== undefined) {
				width = heightProp * ar;
			}
		}
	}

	let height: number | undefined = heightProp;

	const ar = srcProp.aspectRatio;
	if (height === undefined && ar !== undefined && ar !== 0 && width !== undefined) {
		height = Math.round(width / ar);
	}

	const src = srcProp.imageUrlFor(width ?? 640);
	let sources: ImageSource[];

	if (isResponsiveLayout) {
		sources = srcProp.imageTypes.map((type) => {
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
			sources = [];
		} else {
			sources = srcProp.imageTypes.map((type) => {
				const sources: string[] = PIXEL_DENSITIES.map((density) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

	const sourcesSorted = sources.sort(
		(a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0)
	);

	const classNames = $derived.by(() => {
		const classNames = [`ri-${isResponsiveLayout ? 'responsive' : 'fixed'}`];
		const lqip = srcProp.lqip;
		if (lqip && !isLoaded) {
			classNames.push(`ri-lqip-${lqip.type}`);
			if (lqip.type === 'color' || lqip.type === 'inline') {
				classNames.push(lqip.class);
			}
		}

		return classNames;
	});

	let blurhashMeta = $derived(isLqipBlurhash(srcProp.lqip) ? srcProp.lqip : undefined);

	const blurhashLib = $state<{
		value: typeof import('@responsive-image/core/blurhash/decode') | undefined;
	}>({ value: undefined });
	const loadBlurhashLib = () => {
		$effect(() => {
			import('@responsive-image/core/blurhash/decode').then((script) => {
				blurhashLib.value = script;
			});
		});

		return blurhashLib;
	};

	let blurhashUrl = $derived.by(() => {
		if (!blurhashMeta || isLoaded) {
			return undefined;
		}

		let script = loadBlurhashLib().value;

		if (script) {
			const { hash, width, height } = blurhashMeta;
			return script.decode2url(hash, width, height);
		}

		return undefined;
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
		data-ri-bh={blurhashMeta?.hash}
		data-ri-bh-w={blurhashMeta?.width}
		data-ri-bh-h={blurhashMeta?.height}
		style:background-image={blurhashUrl && `url("${blurhashUrl}")`}
		style:background-size={blurhashUrl ? 'cover' : undefined}
		onload={() => (isLoaded = true)}
	/>
</picture>
