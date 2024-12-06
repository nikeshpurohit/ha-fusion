<script lang="ts">
	import { lang } from '$lib/Stores';
	import StateLogic from '$lib/Components/StateLogic.svelte';

	export let sel: any;
	export let template: any;
	export let entity_id: string | undefined;
	export let marquee: boolean | undefined;
	export let stateOn: boolean | undefined;

	let contentWidth: number | undefined;

	$: stateContent =
		sel?.state ||
		(template?.state && template?.state?.output) ||
		(sel?.template?.set_state &&
			template?.set_state?.output &&
			$lang(template?.set_state?.output));
</script>

<div class="state" data-state={stateOn}>
	{#if marquee}
		<div style="width: min-content;" bind:clientWidth={contentWidth}>
			{#if stateContent}
				{@html stateContent}
			{:else}
				<StateLogic {entity_id} selected={sel} {contentWidth} />
			{/if}
		</div>
	{:else}
		<div style="overflow: hidden; text-overflow: ellipsis;">
			{#if stateContent}
				{@html stateContent}
			{:else}
				<StateLogic {entity_id} selected={sel} {contentWidth} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.state {
		grid-area: state;
		font-weight: 400;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--theme-button-state-color-off);
		font-size: 0.925rem;
		margin-top: 1px;
	}

	.state[data-state='true'] {
		color: var(--theme-button-state-color-on);
	}
</style>
