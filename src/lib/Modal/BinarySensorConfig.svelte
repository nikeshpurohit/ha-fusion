<script lang="ts">
	import { dashboard, entityList, lang, record, ripple } from '$lib/Stores';
	import { onDestroy } from 'svelte';
	import BinarySensor from '$lib/Sidebar/BinarySensor.svelte';
	import Select from '$lib/Components/Select.svelte';
	import InputClear from '$lib/Components/InputClear.svelte';
	import ConfigButtons from '$lib/Modal/ConfigButtons.svelte';
	import Modal from '$lib/Modal/Index.svelte';
	import Ripple from 'svelte-ripple';
	import { updateObj } from '$lib/Utils';
	import type { BinarySensorItem } from '$lib/Types';

	export let isOpen: boolean;
	export let sel: BinarySensorItem;

	let name: string | undefined = sel?.name;
	let prefix: string | undefined = sel?.prefix;
	let suffix: string | undefined = sel?.suffix;
	let on_value: string | undefined = sel?.on_value;
	let off_value: string | undefined = sel?.off_value;
	let icon_on: string | undefined = sel?.icon_on;
	let icon_off: string | undefined = sel?.icon_off;
	let color_on: string | undefined = sel?.color_on;
	let color_off: string | undefined = sel?.color_off;

	$: entity_id = sel?.entity_id;

	$: options = $entityList('binary_sensor');

	function set(key: string, event?: any) {
		sel = updateObj(sel, key, event);
		$dashboard = $dashboard;
	}

	onDestroy(() => $record());
</script>

{#if isOpen}
	<Modal>
		<h1 slot="title">{$lang('binary_sensor')}</h1>

		<h2>{$lang('preview')}</h2>

		<div class="preview">
			<BinarySensor
				{entity_id}
				{name}
				{prefix}
				{suffix}
				{on_value}
				{off_value}
				{icon_on}
				{icon_off}
				{color_on}
				{color_off}
			/>
		</div>

		<h2>{$lang('entity')}</h2>

		{#if options}
			<Select
				computeIcons={true}
				{options}
				placeholder={$lang('binary_sensor')}
				value={entity_id}
				on:change={(event) => set('entity_id', event)}
			/>
		{/if}

		<h2>{$lang('name')}</h2>

		<InputClear
			condition={name}
			on:clear={() => {
				name = undefined;
				set('name');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={name}
				placeholder={$lang('name')}
				on:change={(event) => set('name', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('before')}</h2>

		<InputClear
			condition={prefix}
			on:clear={() => {
				prefix = undefined;
				set('prefix');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={prefix}
				placeholder="Prefix"
				on:change={(event) => set('prefix', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('after')}</h2>

		<InputClear
			condition={suffix}
			on:clear={() => {
				suffix = undefined;
				set('suffix');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={suffix}
				placeholder="Suffix"
				on:change={(event) => set('suffix', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('on')}</h2>

		<InputClear
			condition={on_value}
			on:clear={() => {
				on_value = undefined;
				set('on_value');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={on_value}
				placeholder={$lang('on')}
				on:change={(event) => set('on_value', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('off')}</h2>

		<InputClear
			condition={off_value}
			on:clear={() => {
				off_value = undefined;
				set('off_value');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={off_value}
				placeholder={$lang('off')}
				on:change={(event) => set('off_value', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('icon')} – {$lang('on')}</h2>

		<InputClear
			condition={icon_on}
			on:clear={() => {
				icon_on = undefined;
				set('icon_on');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={icon_on}
				placeholder="mdi:door-open"
				on:change={(event) => set('icon_on', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('icon')} – {$lang('off')}</h2>

		<InputClear
			condition={icon_off}
			on:clear={() => {
				icon_off = undefined;
				set('icon_off');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				bind:value={icon_off}
				placeholder="mdi:door-closed"
				on:change={(event) => set('icon_off', event)}
				style:padding
				autocomplete="off"
				spellcheck="false"
			/>
		</InputClear>

		<h2>{$lang('color')} – {$lang('on')}</h2>

		<div class="color-row">
			<InputClear
				condition={color_on}
				on:clear={() => {
					color_on = undefined;
					set('color_on');
				}}
				let:padding
			>
				<input
					class="input"
					type="text"
					bind:value={color_on}
					placeholder="#4fc3f7"
					on:change={(event) => set('color_on', event)}
					style:padding
					autocomplete="off"
					spellcheck="false"
				/>
			</InputClear>

			<input
				type="color"
				bind:value={color_on}
				on:click={() => {
					if (!color_on) color_on = '#4fc3f7';
				}}
				on:change={(event) => set('color_on', event)}
				title={$lang('color')}
			/>
		</div>

		<h2>{$lang('color')} – {$lang('off')}</h2>

		<div class="color-row">
			<InputClear
				condition={color_off}
				on:clear={() => {
					color_off = undefined;
					set('color_off');
				}}
				let:padding
			>
				<input
					class="input"
					type="text"
					bind:value={color_off}
					placeholder="#888888"
					on:change={(event) => set('color_off', event)}
					style:padding
					autocomplete="off"
					spellcheck="false"
				/>
			</InputClear>

			<input
				type="color"
				bind:value={color_off}
				on:click={() => {
					if (!color_off) color_off = '#888888';
				}}
				on:change={(event) => set('color_off', event)}
				title={$lang('color')}
			/>
		</div>

		<h2>{$lang('mobile')}</h2>

		<div class="button-container">
			<button
				class:selected={sel?.hide_mobile !== true}
				on:click={() => set('hide_mobile')}
				use:Ripple={$ripple}
			>
				{$lang('visible')}
			</button>

			<button
				class:selected={sel?.hide_mobile === true}
				on:click={() => set('hide_mobile', true)}
				use:Ripple={$ripple}
			>
				{$lang('hidden')}
			</button>
		</div>

		<ConfigButtons {sel} />
	</Modal>
{/if}

<style>
	.color-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-row :global(.input-clear) {
		flex: 1;
	}

	input[type='color'] {
		width: 2.8rem;
		height: 2.8rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		padding: 0.2rem;
		background: none;
		flex-shrink: 0;
	}
</style>
