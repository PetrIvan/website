<script lang="ts">
	import portrait from '$lib/assets/images/petr-ivan-portrait.jpg?enhanced';
	import { profilePortraitBlobPath } from './profilePortraitShape.js';

	const id = $props.id();
	const clipPathId = `profile-portrait-${id}`;

	let { sizes, priority = false } = $props<{ sizes: string; priority?: boolean }>();
</script>

<div class="relative isolate aspect-square">
	<svg
		class="pointer-events-none absolute inset-0 size-full text-accent"
		viewBox="0 0 100 100"
		aria-hidden="true"
	>
		<defs>
			<clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
				<path d={profilePortraitBlobPath} transform="scale(0.01)" />
			</clipPath>
		</defs>
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
			<path
				d={profilePortraitBlobPath}
				vector-effect="non-scaling-stroke"
				stroke-width="4.5"
				opacity="0.2"
			/>
			<path
				d={profilePortraitBlobPath}
				transform="translate(5 5) scale(0.9)"
				vector-effect="non-scaling-stroke"
				stroke-width="3.5"
				opacity="0.4"
			/>
			<path
				d={profilePortraitBlobPath}
				transform="translate(9 9) scale(0.82)"
				vector-effect="non-scaling-stroke"
				stroke-width="2.5"
				opacity="0.7"
			/>
		</g>
	</svg>

	<div class="absolute inset-[13%] z-10 overflow-hidden" style:clip-path={`url(#${clipPathId})`}>
		<enhanced:img
			src={portrait}
			alt="Portrait of Petr Ivan"
			{sizes}
			fetchpriority={priority ? 'high' : 'auto'}
			class="profile-image absolute top-1/2 left-1/2 size-[108%] max-w-none object-cover"
		/>
	</div>
</div>

<style>
	.profile-image {
		width: 108%;
		height: 108%;
		max-width: none;
		object-fit: cover;
		transform: translate(-48.9432%, -51.7736%);
	}
</style>
