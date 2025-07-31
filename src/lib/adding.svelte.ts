class AddingState {
	state = $state(false);

	beer = $state('');
	rating = $state<number>();
}

export const adding = new AddingState();
