class ErrorState {
	state = $state('');
	private errorTimeout: number | undefined;

	public set = (msg: string) => {
		this.clear();
		this.state = msg;
		this.errorTimeout = setTimeout(() => {
			this.state = '';
			this.errorTimeout = undefined;
		}, 3000);
	};

	public clear = () => {
		this.state = '';
		if (this.errorTimeout !== undefined) {
			clearTimeout(this.errorTimeout);
			this.errorTimeout = undefined;
		}
	};
}

export const error = new ErrorState();
