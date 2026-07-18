<script lang="ts">
	import '@fontsource-variable/figtree/wght.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#f4efe6" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#211c18" media="(prefers-color-scheme: dark)" />
</svelte:head>

{@render children()}
