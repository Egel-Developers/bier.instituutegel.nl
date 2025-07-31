<script lang="ts">
	import { adding } from '$lib/adding.svelte';
	import { serverState } from '$lib/ranking.svelte';
	import { socket } from '$lib/socket.svelte';

	let thingy = $state<number>();

	// $inspect(serverState.users);
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
		{#each serverState.ranking.toSorted((a, b) => b.rating - a.rating) as entry, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex items-center gap-2"
				onclick={(e) => {
					e.stopPropagation();
					if (thingy !== entry.beer_id) thingy = entry.beer_id;
					else thingy = undefined;
				}}
			>
				<p class="w-12 shrink-0">#{i + 1}</p>
				<p class=" w-full overflow-hidden font-bold text-ellipsis whitespace-nowrap">
					{serverState.beers.get(entry.beer_id)}
				</p>
				<p class="w-12 shrink-0">{entry.rating.toFixed(2).replace(/\.?0+$/, '')}</p>
			</div>
			{#if thingy === entry.beer_id}
				<div class="my-2 flex w-full flex-col gap-1 rounded-md bg-zinc-800 px-4 py-2">
					<div class="flex items-center gap-2 font-bold">
						<p class="w-full">Sjiggel</p>
						<p class="w-12 shrink-0">Rating</p>
					</div>
					{#each entry.ratings.toSorted((a, b) => b.rating - a.rating) as rating}
						<div class="flex items-center gap-2">
							<p class="w-full">{serverState.users.get(rating.user_id)}</p>
							<p class="w-12 shrink-0">{rating.rating.toFixed(2).replace(/\.?0+$/, '')}</p>
						</div>
					{/each}
					<div class="rounded-md bg-fuchsia-700 p-px">
						<button
							type="button"
							onclick={() => {
								adding.state = true;
								adding.beer = serverState.beers.get(entry.beer_id)!;

								const yours = entry.ratings.find((r) => r.user_id === socket.userID);
								if (yours !== undefined) adding.rating = yours.rating;
							}}
							class="w-full cursor-pointer rounded-md bg-zinc-700 px-4 py-1 font-semibold text-fuchsia-400/60 duration-300 outline-none hover:bg-zinc-700/90"
						>
							Rating geven
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}
