<script lang="ts">
	import aiCupDashboard from '$lib/assets/images/projects/ai-cup-dashboard.png?enhanced&w=480;960;1920';
	import chordseqaiEditor from '$lib/assets/images/projects/chordseqai-editor.jpg?enhanced&w=480;960;1920';
	import chordseqaiSuggestions from '$lib/assets/images/projects/chordseqai-suggestions.png?enhanced&w=480;960;1920';
	import chordseqaiTimeline from '$lib/assets/images/projects/chordseqai-timeline.png?enhanced&w=480;960;1920';
	import entitatisMundusGameplay from '$lib/assets/images/projects/entitatis-mundus-gameplay.png?enhanced&w=480;960;1920';
	import type { ProjectImageId, ProjectMedia } from '$lib/content/projects';

	const images = {
		'ai-cup-dashboard': aiCupDashboard,
		'chordseqai-editor': chordseqaiEditor,
		'chordseqai-timeline': chordseqaiTimeline,
		'chordseqai-suggestions': chordseqaiSuggestions,
		'entitatis-mundus-gameplay': entitatisMundusGameplay
	} satisfies Record<ProjectImageId, unknown>;

	let {
		media,
		mode = 'section',
		priority = false
	}: {
		media: ProjectMedia;
		mode?: 'card' | 'hero' | 'section';
		priority?: boolean;
	} = $props();

	const sizes = $derived(
		mode === 'card'
			? '(min-width: 1024px) 328px, (min-width: 768px) calc(40vw - 60px), (min-width: 640px) calc(100vw - 120px), calc(100vw - 88px)'
			: '(min-width: 1152px) 1088px, (min-width: 640px) 92vw, 100vw'
	);
</script>

<figure
	class={mode === 'card'
		? 'lg:flex lg:h-full lg:min-h-0 lg:items-center lg:justify-end'
		: undefined}
>
	<div
		class={[
			'overflow-hidden border border-border',
			mode === 'card' ? 'rounded-xl lg:w-[20.5rem] lg:max-w-full' : 'rounded-2xl'
		]}
	>
		<enhanced:img
			src={images[media.image]}
			alt={media.alt}
			{sizes}
			fetchpriority={priority ? 'high' : 'auto'}
			loading={priority ? 'eager' : 'lazy'}
			style:object-position={media.position ?? 'center'}
			class="block h-auto w-full"
		/>
	</div>

	{#if mode !== 'card' && (media.caption || media.credit)}
		<figcaption class="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-muted">
			{media.caption}
			{#if media.credit}
				<span> · {media.credit}.</span>
			{/if}
		</figcaption>
	{/if}
</figure>
