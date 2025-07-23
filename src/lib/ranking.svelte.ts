import type { Ranking } from './types';

class RankingState {
	state = $state<Ranking>([]);
	beers = $derived(this.state.map((r) => r.beer));
}

export const ranking = new RankingState();
