interface ImageLoadedOptions {
	rejectOnError?: boolean;
}

export function getImg(el: HTMLElement): HTMLImageElement {
	const imgEl =
		el instanceof HTMLImageElement
			? el
			: (el.querySelector('img') ?? el.shadowRoot?.querySelector('img'));

	if (!imgEl) {
		throw new Error('No <img> found');
	}

	return imgEl;
}

export async function loaded(el: HTMLElement, options: ImageLoadedOptions = {}): Promise<void> {
	let resolve: () => void;
	let reject: (e: unknown) => void;
	const loaded = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	const imgEl = getImg(el);

	if (imgEl.complete) {
		resolve!();
	} else {
		imgEl.addEventListener(
			'load',
			() => {
				setTimeout(resolve, 0);
			},
			{ once: true }
		);
		if (options.rejectOnError) {
			imgEl.addEventListener(
				'error',
				(e) => {
					console.error(e.message);
					reject(e);
				},
				{ once: true }
			);
		}
	}

	return loaded;
}

export async function trigger(el: HTMLElement) {
	const fakeEvent = new Event('load');
	getImg(el).dispatchEvent(fakeEvent);
}
