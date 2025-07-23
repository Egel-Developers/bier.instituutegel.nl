import { browser } from '$app/environment';

class NameState {
	state = $state('');

	public constructor() {
		if (!browser) return;

		this.state = localStorage.getItem('name') ?? '';
	}

	setName(val: string) {
		localStorage.setItem('name', val);
		this.state = val;
	}
}

export const name = new NameState();
