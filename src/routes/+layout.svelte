<script lang="ts">
	import '../app.css';
	import { code } from '$lib/code.svelte';
	import { error } from '$lib/error.svelte';
	import { name } from '$lib/name.svelte';
	import { socket } from '$lib/socket.svelte';

	let { children } = $props();
</script>

<div class="relative flex min-h-screen w-screen flex-col">
	{#if socket.joever}
		<p>It's SO Joever</p>
	{:else}
		<header>
			<p>
				{#if name.state !== ''}
					Welkom {name.state}!
				{:else}
					Goedendag
				{/if}
			</p>
		</header>

		{@render children()}

		<div class="absolute h-screen w-screen">
			<div class="relative flex h-screen w-screen flex-col items-center justify-center">
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
						class="absolute flex flex-col bg-lime-200"
					>
						<p>Wat is de code?</p>
						<input type="text" name="code" placeholder="De code?" />
						<button type="submit">Bevestig</button>
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
						class="absolute flex flex-col bg-lime-200"
					>
						<p>En uw naam?</p>
						<input type="text" name="name" placeholder="Joep v.d. TV show" />
						<button type="submit">Bevestig</button>
					</form>
				{/if}

				{#if error.state !== ''}
					<div class="absolute bottom-4 bg-red-200">{error.state}</div>
				{:else if socket.locked_in}
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
						}}
						class="absolute bottom-4 flex gap-2 bg-sky-200"
					>
						<p>VERSE RANKING:</p>
						<input type="text" name="beer" placeholder="Naam van het bier" required />
						<input
							type="number"
							min="0"
							max="100"
							size="1"
							name="rating"
							placeholder="69"
							required
						/>
						<button type="submit">Bevestig</button>
					</form>
				{/if}
			</div>
		</div>
	{/if}
</div>
