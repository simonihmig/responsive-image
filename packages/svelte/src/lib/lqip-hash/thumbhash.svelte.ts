import type { LqipHashProvider } from './types';
import type { LqipThumbhash } from '@responsive-image/core';

export class LqipThumbhashProvider implements LqipHashProvider {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	script = $state<typeof import('@responsive-image/core/thumbhash/decode') | undefined>();

	constructor(private lqip: LqipThumbhash) {
		// Allow lazy loading of dependency to make it pay as you go

		$effect(() => {
			import('@responsive-image/core/thumbhash/decode').then((script) => {
				this.script = script;
			});
		});
	}

	get available() {
		return !!this.script;
	}

	get imageUrl() {
		const { hash } = this.lqip;
		const uri = this.script?.decode2url(hash);

		return `url("${uri}")`;
	}
}
