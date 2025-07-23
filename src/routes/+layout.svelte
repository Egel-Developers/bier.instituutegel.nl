<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { code } from '$lib/code.svelte';
	import { error } from '$lib/error.svelte';
	import { name } from '$lib/name.svelte';

	let { children } = $props();

	let askCode = $state(false);
	let askName = $state(false);

	const { promise: ws, resolve: res } = Promise.withResolvers<WebSocket>();

	onMount(() => {
		const ws = new WebSocket('http://localhost:3000');
		ws.onopen = () => {
			res(ws);
			ws.send(JSON.stringify({ code: code.state, name: name.state }));
		};
		ws.onmessage = (e) => {
			console.log(e.data);

			switch (e.data) {
				case 'nuh uh':
					if (code.state !== '') error.set('Nuh uh');
					return (askCode = true);
				case 'juh uh':
					error.clear();
					return (askCode = false);
				case 'name up':
					if (name.state !== '') error.set('Nuh uh');
					return (askName = true);
				case 'name down':
					error.clear();
					return (askName = false);
				default:
					console.error('Huh?');
			}
		};
	});
</script>

<div class="relative flex min-h-screen w-screen flex-col">
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
			{#if askCode}
				<form
					onsubmit={async (e) => {
						e.preventDefault();
						const form = new FormData(e.currentTarget);
						const code_ = form.get('code');
						if (code_ === null) return error.set('Nuh uh');
						const code__ = code_.toString();
						if (code_ === '') return error.set('Nuh uh');
						code.setCode(code__);
						(await ws).send(JSON.stringify({ code: code.state, name: name.state }));
					}}
					class="absolute flex flex-col bg-lime-200"
				>
					<p>Wat is de code?</p>
					<input type="text" name="code" placeholder="De code?" />
				</form>
			{:else if askName}
				<form
					onsubmit={async (e) => {
						e.preventDefault();
						const form = new FormData(e.currentTarget);
						const name_ = form.get('name');
						if (name_ === null) return error.set('Nuh uh');
						const name__ = name_.toString();
						if (name_ === '') return error.set('Nuh uh');
						name.setName(name__);
						(await ws).send(JSON.stringify({ code: code.state, name: name.state }));
					}}
					class="absolute flex flex-col bg-lime-200"
				>
					<p>En uw naam?</p>
					<input type="text" name="name" placeholder="Joep v.d. TV show" />
				</form>
			{/if}

			{#if error.state !== ''}
				<div class="absolute bottom-4 bg-red-200">{error.state}</div>
			{/if}
		</div>
	</div>
</div>
