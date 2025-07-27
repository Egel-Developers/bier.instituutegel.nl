<script lang="ts">
	import { serverState } from '$lib/ranking.svelte';
</script>

{#if serverState.ranking.length === 0}
	<p>Er is nog kinda niks... :(</p>
{:else}
	<div class="flex w-full flex-col">
		<div class="flex items-center gap-2 font-bold">
			<p class="w-12 shrink-0">#XX</p>
			<p class="w-full font-bold">Bier</p>
			<p class="w-12 shrink-0">Rating</p>
		</div>
		{#each serverState.ranking.sort((a, b) => b.rating - a.rating) as entry, i}
			<div class="flex items-center gap-2">
				<p class="w-12 shrink-0">#{i + 1}</p>
				<p class=" w-full overflow-hidden font-bold text-ellipsis whitespace-nowrap">
					{entry.beer_id}
				</p>
				<p class="w-12 shrink-0">{entry.rating}</p>
			</div>
		{/each}
	</div>
{/if}
