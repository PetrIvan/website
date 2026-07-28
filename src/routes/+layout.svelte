<script lang="ts">
	import '@fontsource-variable/figtree/wght.css';
	import '@fontsource-variable/figtree/wght-italic.css';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { clearDeploymentAssetRecovery } from '$lib/client/deploymentAssetRecovery';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';

	const socialImageAlt =
		'Petr Ivan, machine learning engineer, with the text: I build machine learning systems and the products around them.';

	let { children } = $props();

	onMount(clearDeploymentAssetRecovery);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Petr Ivan"
		href="https://petrivan.com/feed.xml"
	/>
	<meta name="author" content="Petr Ivan" />
	<meta property="og:site_name" content="Petr Ivan" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:image" content="https://petrivan.com/social-card.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={socialImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://petrivan.com/social-card.png" />
	<meta name="twitter:image:alt" content={socialImageAlt} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
	>
		Skip to content
	</a>
	<SiteHeader />
	<div id="main-content" class="flex-1" tabindex="-1">
		{@render children()}
	</div>
	<SiteFooter />
</div>
