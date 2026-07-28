<script lang="ts">
	import { asset } from '$app/paths';
	import type { ProjectVisual } from '$lib/content/projects';
	import ProjectMedia from './ProjectMedia.svelte';

	let {
		visual,
		mode = 'section',
		priority = false
	}: {
		visual: ProjectVisual;
		mode?: 'card' | 'hero' | 'section';
		priority?: boolean;
	} = $props();
</script>

{#if visual.kind === 'image'}
	<ProjectMedia media={visual.media} {mode} {priority} />
{:else}
	<figure>
		<div class="overflow-hidden rounded-2xl border border-border bg-surface">
			<video
				class="block aspect-video w-full bg-foreground object-contain"
				controls
				preload="none"
				playsinline
				width="1280"
				height="720"
				poster={asset(visual.video.poster)}
				aria-label={visual.video.alt}
			>
				<source src={asset(visual.video.src)} type="video/mp4" />
				<a href={asset(visual.video.src)}>Download the gameplay video</a>
			</video>
		</div>
		{#if visual.video.caption}
			<figcaption class="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-muted">
				{visual.video.caption}
			</figcaption>
		{/if}
	</figure>
{/if}
