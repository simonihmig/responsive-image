<script lang="ts">
	import {
		type ImageData,
		getClassNames,
		getHeight,
		getSources,
		getSourcesSorted,
		getSrc,
		getValueOrCallback,
		getWidth,
		type ResponsiveImageArgs
	} from '@responsive-image/core';

	import type { HTMLImgAttributes } from 'svelte/elements';

	const {
		src: srcProp,
		size: sizeProp,
		sizes: sizesProp,
		width: widthProp,
		height: heightProp,
		class: classProp,
		...htmlAttributes
	}: ResponsiveImageProps = $props();

	type ResponsiveImageProps = Omit<HTMLImgAttributes, 'src'> & ResponsiveImageArgs;

	const riProps = $derived({
		src: srcProp,
		size: sizeProp,
		sizes: sizesProp,
		width: widthProp,
		height: heightProp
	});

	let loadedSrc = $state<ImageData | undefined>(undefined);
	const isLoaded = $derived(loadedSrc === srcProp);

	const width: number | undefined = $derived(getWidth(riProps));
	const height: number | undefined = $derived(getHeight(riProps));
	const src = $derived(getSrc(riProps));

	const sources = $derived(getSources(riProps));
	const sourcesSorted = $derived(getSourcesSorted(sources));

	const classNames = $derived(getClassNames(riProps, isLoaded, classProp as string | undefined));

	const styles = $derived.by(() => {
		if (isLoaded || typeof document === 'undefined') {
			return {};
		}

		return getValueOrCallback(srcProp.lqip?.inlineStyles) ?? {};
	});

	const checkAlreadyLoaded = (el: HTMLImageElement) => {
		if (el.complete) {
			loadedSrc = srcProp;
		}
	};

	// Geez, no primitive in Svelte for applying styles from an object! See https://github.com/sveltejs/svelte/issues/7311
	const applyStyles = (el: HTMLImageElement) => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const existingStyles: Set<string> = new Set();

		$effect(() => {
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
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
	{#key srcProp.lqip && srcProp}
		<img
			{width}
			{height}
			loading="lazy"
			decoding="async"
			srcset={sourcesSorted[0]?.srcset}
			{src}
			alt=""
			class={classNames}
			{...htmlAttributes}
			data-ri-lqip={srcProp.lqip?.attribute}
			use:checkAlreadyLoaded
			use:applyStyles
			onload={() => (loadedSrc = srcProp)}
		/>
	{/key}
{:else}
	<picture>
		{#each sourcesSorted as s (s.mimeType)}
			<source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
		{/each}
		{#key srcProp.lqip && srcProp}
			<img
				{width}
				{height}
				loading="lazy"
				decoding="async"
				{src}
				alt=""
				class={classNames}
				{...htmlAttributes}
				data-ri-lqip={srcProp.lqip?.attribute}
				use:checkAlreadyLoaded
				use:applyStyles
				onload={() => (loadedSrc = srcProp)}
			/>
		{/key}
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
