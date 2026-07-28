<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		description,
		type = 'website',
		publishedTime
	}: {
		title: string;
		description: string;
		type?: 'website' | 'profile' | 'article';
		publishedTime?: string;
	} = $props();

	const canonicalUrl = $derived(`https://petrivan.com${page.url.pathname}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	{#if type === 'profile'}
		<meta property="profile:first_name" content="Petr" />
		<meta property="profile:last_name" content="Ivan" />
	{:else if type === 'article'}
		<meta property="article:author" content="https://petrivan.com/" />
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
	{/if}
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
