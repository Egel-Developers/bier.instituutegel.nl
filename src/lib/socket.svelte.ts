import { browser, dev } from '$app/environment';
import { code } from './code.svelte';
import { Decoder } from './decoder';
import { Encoder } from './encoder';
import { error } from './error.svelte';
import { name } from './name.svelte';
import { serverState } from './ranking.svelte';

class Socket {
	private ws!: Promise<WebSocket>;

	public askCode = $state(false);
	public askName = $state(false);
	public joever = $state('');

	// private confirmedCode = false;
	private confirmedName = false;

	private userID: number | undefined;

	public constructor() {
		if (!browser) return;

		const { promise: ws, resolve: res } = Promise.withResolvers<WebSocket>();
		this.ws = ws;

		const ws_ = new WebSocket(dev ? 'http://localhost:3000' : 'https://api.bier.instituutegel.nl');
		ws_.binaryType = 'arraybuffer';
		ws_.onerror = () => (this.joever = "C'est joever...");
		ws_.onopen = () => {
			res(ws_);
			if (code.state !== '' && name.state !== '')
				ws_.send(Encoder.encode({ messageType: 1, code: code.state, username: name.state }));
			else ws_.send(Encoder.encode({ messageType: 0, code: code.state }));
			// ws_.send(JSON.stringify({ code: code.state, name: name.state }));
		};
		ws_.onmessage = (e) => {
			const msg = Decoder.decode(e.data as ArrayBuffer);

			console.log(msg);

			switch (msg.messageType) {
				case 0: {
					serverState.init(msg);
					return;
				}
				case 1: {
					if (code.state !== '') error.set('Nuh uh');
					this.askCode = true;
					return;
				}
				case 2: {
					error.clear();
					this.askCode = false;

					if (!this.confirmedName) this.askName = true;
					// this.confirmedCode = true;
					return;
				}
				case 3: {
					if (name.state !== '') error.set('Nuh uh');
					this.askName = true;
					return;
				}
				case 4: {
					error.clear();
					this.askCode = false;
					this.askName = false;
					this.confirmedName = true;
					this.userID = msg.user_id;
					return;
				}
				case 5: {
					serverState.onRating(msg);
					return;
				}
			}
		};
	}

	public async sendCredentials() {
		if (code.state !== '' && name.state !== '')
			(await this.ws).send(
				Encoder.encode({ messageType: 1, code: code.state, username: name.state })
			);
		else (await this.ws).send(Encoder.encode({ messageType: 0, code: code.state }));
	}

	public async sendRatingNew(beer: string, rating: number) {
		if (this.userID === undefined) {
			this.askName = true;
			return;
		}

		(await this.ws).send(
			Encoder.encode({ messageType: 2, code: code.state, user_id: this.userID, rating, beer })
		);
	}

	public async sendRatingExisting(beer_id: number, rating: number) {
		if (this.userID === undefined) {
			this.askName = true;
			return;
		}

		(await this.ws).send(
			Encoder.encode({ messageType: 3, code: code.state, user_id: this.userID, rating, beer_id })
		);
	}

	// public async sendRating(beer: string, rating: number) {
	// 	// (await this.ws).send(
	// 	// 	JSON.stringify({
	// 	// 		locked_in: this.locked_in,
	// 	// 		code: code.state,
	// 	// 		name: name.state,
	// 	// 		rating: {
	// 	// 			beer,
	// 	// 			rating
	// 	// 		}
	// 	// 	})
	// 	// );
	// }
}

export const socket = new Socket();
