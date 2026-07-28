<script lang="ts">
	import { resolve } from '$app/paths';
	import arrowRightIcon from '@fluentui/svg-icons/icons/arrow_right_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';
	import { formatPostDate } from '$lib/content/blog/posts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const posts = $derived(data.posts);
	const description =
		'Essays and notes by Petr Ivan on machine learning, creative software and other subjects.';
</script>

<PageMetadata title="Blog · Petr Ivan" {description} />

<main class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
	<header class="max-w-3xl">
		<h1 class="text-4xl font-medium tracking-[-0.045em] text-foreground sm:text-6xl">Blog</h1>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
			Essays and notes on machine learning, creative software and other subjects.
		</p>
	</header>

	<section class="mt-14 sm:mt-18" aria-labelledby="posts-heading">
		<h2 id="posts-heading" class="sr-only">Posts</h2>

		{#if posts.length > 0}
			<div class="divide-y divide-border border-y border-border">
				{#each posts as post (post.slug)}
					<article class="py-8 sm:py-10">
						<a href={resolve(`/blog/${post.slug}/`)} class="group block">
							<div>
								<div class="flex flex-wrap items-center gap-3 text-sm text-accent">
									<time datetime={post.metadata.date}>{formatPostDate(post.metadata.date)}</time>
								</div>
								<h3
									class="mt-3 text-2xl font-medium tracking-[-0.03em] text-foreground transition-[color] group-hover:text-accent sm:text-3xl"
								>
									{post.metadata.title}
								</h3>
								<p class="mt-3 max-w-2xl leading-7 text-muted">{post.metadata.description}</p>
								<span
									class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-[color] group-hover:text-accent"
								>
									Read
									<FluentIcon svg={arrowRightIcon} />
								</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		{:else}
			<p class="border-y border-border py-10 text-muted">No posts published yet.</p>
		{/if}
	</section>
</main>
