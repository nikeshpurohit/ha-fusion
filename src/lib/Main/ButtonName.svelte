<script lang="ts">
	import { lang } from '$lib/Stores';
	import { getName } from '$lib/Utils';

	export let sel: any;
	export let template: any;
	export let sectionName: string | undefined;
	export let entity: any;
	export let stateOn: boolean | undefined;

	$: nameContent =
		(sel?.template?.name && template?.name?.output) ||
		getName(sel, entity, sectionName) ||
		$lang('unknown');
</script>

<div class="name" data-state={stateOn}>
	{@html nameContent}
</div>

<style>
	.name {
		grid-area: name;
		font-weight: 500;
		color: inherit;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--theme-button-name-color-off);
		font-size: 0.95rem;
		margin-top: -1px;
	}

	.name[data-state='true'] {
		color: var(--theme-button-name-color-on);
	}
</style>
