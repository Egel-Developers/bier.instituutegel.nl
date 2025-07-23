<script lang="ts">
	import '../app.css';
	import { code } from '$lib/code.svelte';
	import { error } from '$lib/error.svelte';
	import { name } from '$lib/name.svelte';
	import { socket } from '$lib/socket.svelte';
	import { ranking } from '$lib/ranking.svelte';

	let { children } = $props();

	let adding = $state(false);
</script>

<div class="flex h-[100svh] w-screen flex-col bg-zinc-900 text-zinc-200">
	<header class="flex w-screen items-center justify-between gap-4 bg-zinc-800 px-8 py-2">
		<h1 class="text-xl font-bold">
			<span class="text-fuchsia-300">BIER</span>.<span class="text-sky-300">instituutegel</span
			>.<span class="text-emerald-300">nl</span>
		</h1>
		{#if name.state !== ''}
			<p class="text-md overflow-hidden font-semibold text-ellipsis"><u>{name.state}</u></p>
		{/if}
	</header>
	<div class="relative flex flex-grow flex-col items-center overflow-y-auto">
		{#if socket.joever}
			<p>It's SO Joever</p>
		{:else}
			<div class="flex h-full flex-col items-center gap-2 px-8 py-2">
				{@render children()}
			</div>

			{#if socket.askCode || socket.askName || adding}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute flex h-full w-full items-center justify-center bg-black/70"
					onclick={(e) => {
						if (adding && e.target === e.currentTarget) adding = false;
					}}
				>
					{#if socket.askCode}
						<form
							onsubmit={async (e) => {
								e.preventDefault();
								const form = new FormData(e.currentTarget);
								const code_ = form.get('code');
								if (code_ === null) return error.set('Nuh uh');
								const code__ = code_.toString();
								if (code_ === '') return error.set('Nuh uh');
								code.setCode(code__);
								socket.sendCredentials();
							}}
							class="flex flex-col gap-4 rounded-md border border-zinc-700 bg-zinc-800 p-4"
						>
							<h2 class="text-2xl font-semibold">Wat is de code?</h2>
							<input
								class="rounded-md border border-zinc-600/70 bg-zinc-700 px-4 py-1 duration-300 outline-none focus:border-zinc-500"
								type="text"
								name="code"
								placeholder="De code?"
								autofocus
								required
							/>
							<div class="rounded-md bg-fuchsia-700 p-px">
								<button
									type="submit"
									class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-fuchsia-400/60 duration-300 outline-none hover:bg-zinc-700/90"
								>
									Bevestig
								</button>
							</div>
						</form>
					{:else if socket.askName}
						<form
							onsubmit={async (e) => {
								e.preventDefault();
								const form = new FormData(e.currentTarget);
								const name_ = form.get('name');
								if (name_ === null) return error.set('Nuh uh');
								const name__ = name_.toString();
								if (name_ === '') return error.set('Nuh uh');
								name.setName(name__);
								socket.sendCredentials();
							}}
							class="flex flex-col gap-4 rounded-md border border-zinc-700 bg-zinc-800 p-4"
						>
							<h2 class="text-2xl font-semibold">En uw naam?</h2>
							<input
								class="rounded-md border border-zinc-600/70 bg-zinc-700 px-4 py-1 duration-300 outline-none focus:border-zinc-500"
								type="text"
								name="name"
								placeholder="Joep v.d. TV show"
								required
								minlength="3"
								maxlength="32"
								autofocus
							/>
							<div class="rounded-md bg-fuchsia-700 p-px">
								<button
									type="submit"
									class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-fuchsia-400/60 duration-300 outline-none hover:bg-zinc-700/90"
									>Bevestig</button
								>
							</div>
						</form>
					{:else if adding}
						<form
							onsubmit={(e) => {
								e.preventDefault();
								const form = new FormData(e.currentTarget);
								const beer_ = form.get('beer');
								if (beer_ === null) return error.set('Nuh uh');
								const beer__ = beer_.toString();
								if (beer__ === '') return error.set('Nuh uh');

								const rating_ = form.get('rating');
								if (rating_ === null) return error.set('Nuh uh');
								const rating__ = parseInt(rating_.toString());
								if (Number.isNaN(rating__)) return error.set('Nuh uh');

								socket.sendRating(beer__, rating__);
								adding = false;
							}}
							class="flex rounded-md bg-zinc-700 p-px"
						>
							<div
								class="flex w-full flex-col items-center gap-2 rounded-md bg-zinc-800/80 p-2 font-semibold text-zinc-200/80"
							>
								<h3 class="text-xl font-semibold">Verse rating:</h3>
								<input
									class="w-full rounded-md border border-zinc-600/70 bg-zinc-700 px-2 py-1 duration-300 outline-none focus:border-zinc-500"
									type="text"
									name="beer"
									placeholder="Naam van het bier"
									list="beers"
									required
									autofocus
									minlength="3"
									maxlength="32"
								/>
								<datalist id="beers">
									{#each ranking.beers as beer}
										<option value={beer}>{beer}</option>
									{/each}
								</datalist>
								<input
									class="w-full rounded-md border border-zinc-600/70 bg-zinc-700 px-2 py-1 duration-300 outline-none focus:border-zinc-500"
									type="number"
									min="0"
									max="100"
									size="1"
									name="rating"
									placeholder="Rating"
									required
								/>
								<div class="w-full rounded-md bg-sky-700/70 p-px">
									<button
										type="submit"
										class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-sky-500/50 duration-300 outline-none hover:bg-zinc-700/90"
										>Bevestig</button
									>
								</div>
							</div>
						</form>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
	{#if !adding}
		<footer class="flex w-screen flex-col items-center bg-zinc-800 px-8 py-2">
			{#if error.state !== ''}
				<div class="rounded-md bg-rose-700 p-px">
					<p class="w-full rounded-md bg-zinc-700 px-4 py-1 font-semibold text-rose-400/60">
						{error.state}
					</p>
				</div>
			{:else}
				<div class="rounded-md bg-sky-700 p-px">
					<button
						onclick={() => (adding = true)}
						type="button"
						class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-sky-400/60 duration-300 outline-none hover:bg-zinc-700/90"
						>Verse rating</button
					>
				</div>
			{/if}
		</footer>
	{/if}
</div>

<!-- <form
				onsubmit={(e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const beer_ = form.get('beer');
					if (beer_ === null) return error.set('Nuh uh');
					const beer__ = beer_.toString();
					if (beer__ === '') return error.set('Nuh uh');

					const rating_ = form.get('rating');
					if (rating_ === null) return error.set('Nuh uh');
					const rating__ = parseInt(rating_.toString());
					if (Number.isNaN(rating__)) return error.set('Nuh uh');

					socket.sendRating(beer__, rating__);
				}}
				class="flex w-full rounded-md bg-zinc-700 p-px"
			>
				<div
					class="flex w-full flex-col items-center gap-2 rounded-md bg-zinc-800/80 p-2 font-semibold text-zinc-200/80"
				>
					<h3 class="text-xl font-semibold">Verse rating:</h3>
					<input
						class="w-full rounded-md border border-zinc-600/70 bg-zinc-700 px-2 py-1 duration-300 outline-none focus:border-zinc-500"
						type="text"
						name="beer"
						placeholder="Naam van het bier"
						required
						autofocus
					/>
					<input
						class="w-full rounded-md border border-zinc-600/70 bg-zinc-700 px-2 py-1 duration-300 outline-none focus:border-zinc-500"
						type="number"
						min="0"
						max="100"
						size="1"
						name="rating"
						placeholder="Rating"
						required
					/>
					<div class="w-full rounded-md bg-sky-700/70 p-px">
						<button
							type="submit"
							class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-sky-500/50 duration-300 outline-none hover:bg-zinc-700/90"
							>Bevestig</button
						>
					</div>
				</div>
			</form> -->
