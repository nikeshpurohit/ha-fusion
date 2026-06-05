<script lang="ts">
	import { dashboard, lang, record, ripple, connection } from '$lib/Stores';
	import Modal from '$lib/Modal/Index.svelte';
	import ConfigButtons from '$lib/Modal/ConfigButtons.svelte';
	import AiAssistant from '$lib/Sidebar/AiAssistant.svelte';
	import Select from '$lib/Components/Select.svelte';
	import InputClear from '$lib/Components/InputClear.svelte';
	import Icon from '@iconify/svelte';
	import Ripple from 'svelte-ripple';
	import { updateObj } from '$lib/Utils';
	import { onDestroy } from 'svelte';
	import type { AiAssistantItem } from '$lib/Types';

	export let isOpen: boolean;
	export let sel: AiAssistantItem;

	let name: string | undefined = sel?.name;
	let icon: string | undefined = sel?.icon;
	let wake_word: string | undefined = sel?.wake_word;
	let tts_voice: string | undefined = sel?.tts_voice;

	let ttsVoices: { id: string; label: string }[] = [];

	function loadTtsVoices() {
		if (typeof window === 'undefined' || !window.speechSynthesis) return;
		const tryLoad = () => {
			const all = window.speechSynthesis.getVoices();
			if (all.length) ttsVoices = buildVoiceList(all);
		};
		window.speechSynthesis.onvoiceschanged = tryLoad;
		tryLoad();
	}

	function buildVoiceList(voices: SpeechSynthesisVoice[]): { id: string; label: string }[] {
		return voices
			.slice()
			.sort((a, b) => {
				const q = (v: SpeechSynthesisVoice) => (/natural|neural|enhanced/i.test(v.name) ? 0 : 1);
				return q(a) - q(b) || a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name);
			})
			.map((v) => ({ id: v.name, label: `${v.name} (${v.lang})` }));
	}

	loadTtsVoices();

	interface Agent {
		id: string;
		name: string;
	}

	let agents: { id: string; label: string }[] = [];

	async function loadAgents() {
		try {
			const response: any = await $connection.sendMessagePromise({
				type: 'conversation/agent/list',
				language: 'en'
			});
			agents = (response?.agents as Agent[])?.map((a) => ({ id: a.id, label: a.name })) ?? [];
		} catch {
			agents = [];
		}
	}

	loadAgents();

	function set(key: string, event?: any) {
		sel = updateObj(sel, key, event);
		$dashboard = $dashboard;
	}

	onDestroy(() => $record());
</script>

{#if isOpen}
	<Modal>
		<h1 slot="title">{$lang('ai_assistant')}</h1>

		<h2>{$lang('preview')}</h2>

		<div class="preview">
			<AiAssistant {sel} />
		</div>

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
				autocomplete="off"
				spellcheck="false"
				placeholder={$lang('ai_assistant')}
				bind:value={name}
				on:change={(event) => set('name', event)}
				style:padding
			/>
		</InputClear>

		<h2>{$lang('icon')}</h2>

		<div class="icon-gallery-container">
			<InputClear
				condition={icon}
				on:clear={() => {
					icon = undefined;
					set('icon');
				}}
				let:padding
			>
				<input
					class="input"
					type="text"
					placeholder="fluent:bot-24-filled"
					autocomplete="off"
					spellcheck="false"
					bind:value={icon}
					on:change={(event) => set('icon', event)}
					style:padding
				/>
			</InputClear>

			<button
				class="icon-gallery"
				title={$lang('icon')}
				on:click={() => window.open('https://icon-sets.iconify.design/', '_blank')}
				style:padding="0.84rem"
			>
				<Icon icon="majesticons:open-line" height="none" />
			</button>
		</div>

		<h2>{$lang('ai_agent')}</h2>

		{#if agents.length > 0}
			<Select
				options={agents}
				placeholder={$lang('ai_agent')}
				value={sel?.agent_id}
				clearable={true}
				on:change={(event) => set('agent_id', event)}
			/>
		{:else}
			<p class="no-agents">{$lang('loading')}</p>
		{/if}

		<h2>{$lang('ai_wake_word')}</h2>

		<InputClear
			condition={wake_word}
			on:clear={() => {
				wake_word = undefined;
				set('wake_word');
			}}
			let:padding
		>
			<input
				class="input"
				type="text"
				autocomplete="off"
				spellcheck="false"
				placeholder={$lang('ai_wake_word_placeholder')}
				bind:value={wake_word}
				on:change={(event) => set('wake_word', event)}
				style:padding
			/>
		</InputClear>

		<h2>{$lang('ai_tts')}</h2>

		<div class="button-container">
			<button
				class:selected={sel?.tts_enabled !== false}
				on:click={() => set('tts_enabled')}
				use:Ripple={$ripple}
			>
				{$lang('visible')}
			</button>

			<button
				class:selected={sel?.tts_enabled === false}
				on:click={() => set('tts_enabled', false)}
				use:Ripple={$ripple}
			>
				{$lang('hidden')}
			</button>
		</div>

		{#if sel?.tts_enabled !== false}
			<h2>{$lang('ai_tts_voice')}</h2>

			{#if ttsVoices.length > 0}
				<Select
					options={ttsVoices}
					placeholder={$lang('ai_tts_auto')}
					value={sel?.tts_voice}
					clearable={true}
					on:change={(event) => {
						tts_voice = event.detail || undefined;
						if (event.detail) {
							set('tts_voice', event);
						} else {
							set('tts_voice');
						}
					}}
				/>
			{:else}
				<p class="no-agents">{$lang('loading')}</p>
			{/if}
		{/if}

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
	.preview {
		background-color: rgb(0 0 0 / 0.15);
		border-radius: 0.6rem;
		padding: 0.25rem 1rem;
		pointer-events: none;
	}

	.no-agents {
		opacity: 0.5;
		font-size: 0.9rem;
		margin: 0;
	}
</style>
