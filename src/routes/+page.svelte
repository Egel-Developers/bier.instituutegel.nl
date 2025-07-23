<script lang="ts">
	import { ranking } from '$lib/ranking.svelte';
</script>

<div class="flex flex-col items-center gap-2">
	<h2>DE RANKING</h2>
	{#if ranking.state.length === 0}
		<p>Er is nog kinda niks... :(</p>
	{:else}
		<div class="grid grid-cols-3 gap-x-12">
			<p class="font-bold">Bier</p>
			<p class="font-bold">Rating</p>
			<p class="font-bold">Aantal ratings</p>
			{#each ranking.state as entry}
				<p>{entry.beer}</p>
				<p>{entry.rating}</p>
				<p>{entry.count}</p>
			{/each}
		</div>
	{/if}
</div>
