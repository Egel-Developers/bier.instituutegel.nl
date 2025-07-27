import { socket } from './socket.svelte';
import type { InitialServerMessage, Ranking, RatingServerMessage } from './types';

class ServerState {
	users = new Map<number, string>();
	beers = new Map<number, string>();

	ranking = $state<Ranking>([]);

	public init(initial: InitialServerMessage) {
		this.users.clear();
		for (const user of initial.users) this.users.set(user.id, user.name);

		this.beers.clear();
		for (const beer of initial.beers) this.beers.set(beer.id, beer.name);

		const tempRanking: Ranking = new Array(initial.beers.length);

		for (let i = 0; i < initial.beers.length; i++) {
			const beer = initial.beers[i];

			let totalRating = 0;
			let ratingCount = 0;
			const ratings: { user_id: number; rating: number }[] = [];
			for (const rating of initial.ratings) {
				if (rating.beer_id !== beer.id) continue;
				totalRating += rating.rating;
				ratingCount++;
				ratings.push({
					user_id: rating.user_id,
					rating: rating.rating
				});
			}

			tempRanking[i] = {
				beer_id: beer.id,
				rating: totalRating / ratingCount,
				ratings
			};
		}

		// tempRanking.sort((a, b) => b.rating - a.rating);
		this.ranking = tempRanking;
	}

	public onRating(rating: RatingServerMessage) {
		let username = this.users.get(rating.user_id);
		if (username === undefined) {
			if (rating.username === undefined) {
				socket.joever = "Schrödinger's gebruikersnaam";
				return;
			}

			username = rating.username;
			this.users.set(rating.user_id, username);
		}

		let beer = this.beers.get(rating.beer_id);
		if (beer === undefined) {
			if (rating.beer === undefined) {
				socket.joever = "Schrödinger's bier";
				return;
			}

			beer = rating.beer;
			this.beers.set(rating.beer_id, beer);
		}

		const entry = this.ranking.find((r) => r.beer_id === rating.beer_id);

		// if new beer
		if (entry === undefined) {
			this.ranking.push({
				beer_id: rating.beer_id,
				rating: rating.rating,
				ratings: [{ user_id: rating.user_id, rating: rating.rating }]
			});
			return;
		}

		const existingRating = entry.ratings.find((r) => r.user_id === rating.user_id);
		// if update
		if (existingRating !== undefined) existingRating.rating = rating.rating;
		// if new rating
		else entry.ratings.push({ user_id: rating.user_id, rating: rating.rating });

		entry.rating = entry.ratings.reduce((acc, v) => acc + v.rating, 0) / entry.ratings.length;
	}

	// beers = $derived(this.state.map((r) => r.beer));

	// public fromRatings(ratings: Rating[]) {
	// 	for (const rating of ratings) {

	// 	}
	// }
}

export const serverState = new ServerState();
