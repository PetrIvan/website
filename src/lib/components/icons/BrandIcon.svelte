<script lang="ts">
	let { svg } = $props<{ svg: string }>();
</script>

<span class="brand-icon" aria-hidden="true">
	<!-- The SVG is a trusted local asset, never user-provided content. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</span>

<style>
	.brand-icon {
		display: inline-flex;
		width: 1.25rem;
		height: 1.25rem;
		flex: none;
	}

	.brand-icon :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
		fill: currentColor;
	}
</style>
