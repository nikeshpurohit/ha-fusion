<script lang="ts">
	import { connection, states, lang } from '$lib/Stores';
	import Modal from '$lib/Modal/Index.svelte';
	import Camera from '$lib/Main/Camera.svelte';
	import Icon from '@iconify/svelte';
	import { callService } from 'home-assistant-js-websocket';
	import { getDomain } from '$lib/Utils';
	import { onMount, onDestroy } from 'svelte';
	import type { DoorbellItem } from '$lib/Types';

	export let isOpen: boolean;
	export let sel: DoorbellItem;
	export let autoClose = false;

	$: actionEntity = sel?.action_entity ? $states?.[sel.action_entity] : undefined;
	$: actionDomain = getDomain(sel?.action_entity);

	let countdown: number | null = null;
	let countdownTimer: ReturnType<typeof setInterval> | null = null;

	function startCountdown() {
		if (!sel?.trigger_timeout || sel.trigger_timeout <= 0) return;
		countdown = sel.trigger_timeout;
		countdownTimer = setInterval(() => {
			if (countdown === null) return;
			countdown--;
			if (countdown <= 0) {
				isOpen = false;
			}
		}, 1000);
	}

	function stopCountdown() {
		if (countdownTimer) {
			clearInterval(countdownTimer);
			countdownTimer = null;
		}
		countdown = null;
	}

	onMount(() => {
		if (autoClose) startCountdown();
	});

	onDestroy(() => stopCountdown());

	$: if (!isOpen) stopCountdown();

	function getActionLabel(): string {
		switch (actionDomain) {
			case 'lock': return $lang('open_door');
			case 'button':
			case 'input_button': return $lang('press');
			case 'cover': return $lang('open_cover');
			default: return $lang('open_door');
		}
	}

	function getActionIcon(): string {
		switch (actionDomain) {
			case 'lock': return 'mdi:lock-open-outline';
			case 'cover': return 'mdi:garage-open';
			default: return 'mdi:door-open';
		}
	}

	async function handleAction() {
		if (!$connection || !sel?.action_entity) return;
		const domain = actionDomain;
		if (!domain) return;

		let service: string;
		switch (domain) {
			case 'lock': service = 'unlock'; break;
			case 'button':
			case 'input_button': service = 'press'; break;
			case 'cover': service = 'open_cover'; break;
			case 'switch':
			case 'input_boolean': service = 'turn_on'; break;
			default: service = 'turn_on';
		}

		await callService($connection, domain, service, { entity_id: sel.action_entity });
	}
</script>

{#if isOpen}
	<Modal size="large">
		<svelte:fragment slot="title">
			<span class="title-row">
				<Icon icon="mdi:doorbell" height="1.1em" />
				{sel?.name || $lang('doorbell') || 'Doorbell'}
			</span>
			{#if countdown !== null}
				<span class="countdown">{countdown}s</span>
			{/if}
		</svelte:fragment>

		<div class="camera-wrap">
			<Camera
				sel={{ ...sel, entity_id: sel?.camera_entity }}
				responsive={true}
				muted={false}
				controls={true}
			/>
		</div>

		{#if sel?.action_entity}
			<button class="action-btn" on:click={handleAction}>
				<Icon icon={getActionIcon()} height="1.6em" />
				{getActionLabel()}
			</button>
		{/if}
	</Modal>
{/if}

<style>
	.title-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex: 1;
	}

	.countdown {
		font-size: 0.85rem;
		opacity: 0.5;
		font-weight: 400;
		margin-left: auto;
		padding-right: 0.5rem;
	}

	.camera-wrap {
		position: relative;
		margin-top: 0.75rem;
		border-radius: 0.5rem;
		overflow: hidden;
		min-height: 12rem;
	}

	.action-btn {
		margin-top: 1rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.95rem;
		border-radius: 0.75rem;
		border: none;
		background: var(--theme-navigate-background-color, rgba(255, 255, 255, 0.15));
		color: inherit;
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 150ms ease;
		letter-spacing: 0.02em;
	}

	.action-btn:hover {
		opacity: 0.8;
	}

	.action-btn:active {
		opacity: 0.6;
	}
</style>
