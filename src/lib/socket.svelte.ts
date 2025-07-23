import { browser, dev } from '$app/environment';
import { code } from './code.svelte';
import { error } from './error.svelte';
import { name } from './name.svelte';
import { ranking } from './ranking.svelte';
import { unflattenRanking, type SocketData } from './types';

class Socket {
	private ws!: Promise<WebSocket>;

	public askCode = $state(false);
	public askName = $state(false);
	public joever = $state(false);

	private confirmedCode = false;
	private confirmedName = false;

	public locked_in = $state(false);

	public constructor() {
		if (!browser) return;

		const { promise: ws, resolve: res } = Promise.withResolvers<WebSocket>();
		this.ws = ws;

		const ws_ = new WebSocket(dev ? 'http://localhost:3000' : 'https://api.bier.instituutegel.nl');
		ws_.onerror = () => (this.joever = true);
		ws_.onopen = () => {
			res(ws_);
			ws_.send(JSON.stringify({ code: code.state, name: name.state }));
		};
		ws_.onmessage = (e) => {
			console.log(e.data);

			switch (e.data) {
				case 'nuh uh':
					if (code.state !== '') error.set('Nuh uh');
					this.askCode = true;
					return;
				case 'juh uh':
					error.clear();
					this.askCode = false;
					this.confirmedCode = true;
					if (this.confirmedCode && this.confirmedName) this.locked_in = true;
					return;
				case 'name up':
					if (name.state !== '') error.set('Nuh uh');
					this.askName = true;
					return;
				case 'name down':
					error.clear();
					this.askName = false;
					this.confirmedName = true;
					if (this.confirmedCode && this.confirmedName) this.locked_in = true;
					return;
				default: {
					const parsed: SocketData = JSON.parse(e.data);
					switch (parsed.type) {
						case 'all':
							ranking.state = unflattenRanking(parsed.data);
							return;
						default:
							console.error('Huh?');
					}
				}
			}
		};
	}

	public async sendCredentials() {
		(await this.ws).send(
			JSON.stringify({ locked_in: this.locked_in, code: code.state, name: name.state })
		);
	}

	public async sendRating(beer: string, rating: number) {
		(await this.ws).send(
			JSON.stringify({
				locked_in: this.locked_in,
				code: code.state,
				name: name.state,
				rating: {
					beer,
					rating
				}
			})
		);
	}
}

export const socket = new Socket();
