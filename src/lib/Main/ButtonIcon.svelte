<script lang="ts">
	import Icon, { loadIcon } from '@iconify/svelte';
	import ComputeIcon from '$lib/Components/ComputeIcon.svelte';

	export let icon: string | undefined;
	export let entity_id: string | undefined;
	export let color: string | undefined;
	export let attributes: any;
	export let template: any;
	export let loading: boolean | undefined;
	export let stateOn: boolean | undefined;

	// icon is image if extension, e.g. test.png
	$: image = icon?.includes('.');

	$: iconColor = color
		? color
		: attributes?.hs_color
			? `hsl(${attributes?.hs_color}%, 50%)`
			: 'rgb(75, 166, 237)';

	$: backgroundColor = template?.color && template?.color?.output
		? template?.color?.output
		: undefined;

	$: backgroundImage =
		!icon && attributes?.entity_picture
			? `url(${attributes?.entity_picture})`
			: image && icon
				? `url(${icon})`
				: 'none';
</script>

<div
	class="icon"
	data-state={stateOn}
	style:--icon-color={iconColor}
	style:background-color={backgroundColor}
	style:background-image={backgroundImage}
	class:image
>
	{#if loading}
		<img src="loader.svg" alt="loading" style="margin:0 auto" />
	{:else if image || (!icon && attributes?.entity_picture)}
		&nbsp;
	{:else if icon}
		{#await loadIcon(icon)}
			<!-- loading -->
			<Icon icon="ooui:help-ltr" height="none" width="100%" />
		{:then resolvedIcon}
			<!-- exists -->
			<Icon icon={resolvedIcon} height="none" width="100%" />
		{:catch}
			<!-- doesn't exist -->
			<Icon icon="ooui:help-ltr" height="none" width="100%" />
		{/await}
	{:else if entity_id}
		<ComputeIcon {entity_id} />
	{:else}
		<Icon icon="ooui:help-ltr" height="none" width="100%" />
	{/if}
</div>

<style>
	.icon {
		--icon-size: 2.4rem;
		grid-area: icon;
		height: var(--icon-size);
		width: var(--icon-size);
		color: rgb(200 200 200);
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 50%;
		align-items: center;
		display: flex;
		padding: 0.5rem;
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.icon[data-state='true'] {
		color: white;
		background-color: var(--icon-color);
	}

	.image {
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
