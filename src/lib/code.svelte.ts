import { browser } from '$app/environment';

class CodeState {
	state = $state('');

	public constructor() {
		if (!browser) return;

		this.state = localStorage.getItem('code') ?? '';
	}

	setCode(val: string) {
		localStorage.setItem('code', val);
		this.state = val;
	}
}

export const code = new CodeState();
