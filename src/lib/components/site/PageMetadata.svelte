<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';

	let {
		title,
		description,
		type = 'website',
		publishedTime,
		socialTitle = title,
		socialDescription = description,
		socialImage = '/social-card.png',
		socialImageType = 'image/png',
		socialImageWidth = 1200,
		socialImageHeight = 630,
		socialImageAlt = 'Petr Ivan, machine learning engineer, with the text: I build machine learning systems and the products around them.'
	}: {
		title: string;
		description: string;
		type?: 'website' | 'profile' | 'article';
		publishedTime?: string;
		socialTitle?: string;
		socialDescription?: string;
		socialImage?: string;
		socialImageType?: string;
		socialImageWidth?: number;
		socialImageHeight?: number;
		socialImageAlt?: string;
	} = $props();

	const canonicalUrl = $derived(`https://petrivan.com${page.url.pathname}`);
	const socialImageUrl = $derived(
		new URL(socialImage, dev ? page.url.origin : 'https://petrivan.com').href
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={socialImageUrl} />
	<meta property="og:image:type" content={socialImageType} />
	<meta property="og:image:width" content={String(socialImageWidth)} />
	<meta property="og:image:height" content={String(socialImageHeight)} />
	<meta property="og:image:alt" content={socialImageAlt} />
	{#if type === 'profile'}
		<meta property="profile:first_name" content="Petr" />
		<meta property="profile:last_name" content="Ivan" />
	{:else if type === 'article'}
		<meta property="article:author" content="https://petrivan.com/" />
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta name="twitter:image" content={socialImageUrl} />
	<meta name="twitter:image:alt" content={socialImageAlt} />
</svelte:head>
