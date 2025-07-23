import type { Ranking } from './types';

class RankingState {
	state = $state<Ranking>([]);
}

export const ranking = new RankingState();
