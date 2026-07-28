<script lang="ts">
	import { resolve } from '$app/paths';
	import arrowLeftIcon from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw';
	import arrowRightIcon from '@fluentui/svg-icons/icons/arrow_right_24_filled.svg?raw';
	import openIcon from '@fluentui/svg-icons/icons/open_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import ProjectMedia from '$lib/components/projects/ProjectMedia.svelte';
	import ProjectVisual from '$lib/components/projects/ProjectVisual.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
</script>

<PageMetadata title={`${project.title} · Petr Ivan`} description={project.summary} />

<main>
	<article>
		<header class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
			<a
				href={resolve('/projects/')}
				class="inline-flex items-center gap-2 text-sm font-medium text-muted transition-[color] hover:text-foreground"
			>
				<FluentIcon svg={arrowLeftIcon} />
				All projects
			</a>

			<div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
				<div>
					<p class="text-sm font-medium text-accent">{project.label} · {project.period}</p>
					<h1
						class="mt-4 max-w-4xl text-4xl leading-[1.04] font-medium tracking-[-0.045em] text-foreground sm:text-6xl"
					>
						{project.title}
					</h1>
					<p class="mt-7 max-w-3xl text-xl leading-9 text-muted sm:text-2xl sm:leading-10">
						{project.summary}
					</p>
					<!-- Primary project actions are trusted absolute external URLs from local content data. -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={project.primaryAction.href}
						target="_blank"
						rel="noreferrer"
						class="mt-7 inline-flex items-center gap-2 rounded-md font-medium text-foreground hover:text-accent"
					>
						{project.primaryAction.label}
						<FluentIcon svg={openIcon} />
						<span class="sr-only"> (opens in a new tab)</span>
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</div>

				<dl class="mt-2 divide-y divide-border border-y border-border sm:mt-4 lg:mt-0 lg:self-end">
					{#each project.facts as fact (fact.label)}
						<div class="py-5">
							<dt class="text-xs font-medium tracking-[0.08em] text-accent uppercase">
								{fact.label}
							</dt>
							<dd class="mt-1.5 leading-6 text-foreground">{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</header>

		{#if project.heroVisual}
			<div class="mx-auto max-w-6xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
				<ProjectVisual visual={project.heroVisual} mode="hero" priority />
			</div>
		{/if}

		{#if project.metrics.length > 0}
			<div class="border-y border-border">
				<dl
					class={[
						'mx-auto grid max-w-6xl divide-y divide-border px-6 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10',
						project.metrics.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
					]}
				>
					{#each project.metrics as metric (metric.label)}
						<div class="flex flex-col py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0 lg:py-9">
							<dt class="order-2 mt-2 text-sm leading-6 text-muted">{metric.label}</dt>
							<dd
								class="order-1 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl"
							>
								{metric.value}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}

		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
			{#each project.sections as section, index (section.title)}
				<section
					class="grid gap-8 border-b border-border py-14 sm:py-18 md:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1.45fr)] md:gap-14 lg:py-22"
				>
					<div>
						<p class="text-sm font-medium text-accent" aria-hidden="true">
							{String(index + 1).padStart(2, '0')}
						</p>
						<h2
							class="mt-3 max-w-sm text-2xl font-medium tracking-[-0.03em] text-foreground sm:text-3xl"
						>
							{section.title}
						</h2>
					</div>

					<div class="max-w-3xl">
						<div class="prose-content grid gap-5 text-lg leading-8 text-muted">
							{#each section.paragraphs as paragraph (paragraph)}
								<p>
									{#if typeof paragraph === 'string'}
										{paragraph}
									{:else}
										{#each paragraph as part, partIndex (partIndex)}
											{#if typeof part === 'string'}
												{part}
											{:else}
												<!-- Inline project links are trusted absolute URLs from local content data. -->
												<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
												<a
													href={part.href}
													target="_blank"
													rel="noreferrer"
													aria-label={`${part.label} (opens in a new tab)`}
													class="whitespace-nowrap"
												>
													{part.label}
												</a>
											{/if}
										{/each}
									{/if}
								</p>
							{/each}
						</div>

						{#if section.highlights}
							<div class="mt-9 divide-y divide-border border-y border-border">
								{#each section.highlights as highlight (highlight.title)}
									<div class="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-7">
										<h3 class="font-medium text-foreground">{highlight.title}</h3>
										<p class="leading-7 text-muted">{highlight.body}</p>
									</div>
								{/each}
							</div>
						{/if}

						{#if section.media}
							<div class="mt-9 grid gap-8">
								{#each section.media as media (media.image)}
									<ProjectMedia {media} />
								{/each}
							</div>
						{/if}
					</div>
				</section>
			{/each}

			<section
				class="grid gap-8 border-b border-border py-14 sm:py-18 md:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1.45fr)] md:gap-14 lg:py-22"
			>
				<div>
					<h2 class="text-2xl font-medium tracking-[-0.03em] text-foreground">Resources</h2>
				</div>

				<!-- Project resources are trusted absolute external URLs from local content data. -->
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<div class="divide-y divide-border border-y border-border">
					{#each project.resources as resource (resource.href)}
						<a
							href={resource.href}
							target="_blank"
							rel="noreferrer"
							class="flex items-center justify-between gap-6 py-4 font-medium text-foreground hover:text-accent"
						>
							{resource.label}
							<FluentIcon svg={openIcon} />
							<span class="sr-only"> (opens in a new tab)</span>
						</a>
					{/each}
				</div>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</section>

			<nav aria-label="Project navigation">
				<a
					href={resolve(`/projects/${data.nextProject.id}/`)}
					class="group grid gap-4 py-14 sm:grid-cols-[1fr_auto] sm:items-end sm:py-18 lg:py-22"
				>
					<div>
						<p class="text-sm font-medium text-accent">Next project · {data.nextProject.label}</p>
						<h2
							class="mt-3 max-w-3xl text-3xl font-medium tracking-[-0.035em] text-foreground transition-[color] group-hover:text-accent sm:text-4xl"
						>
							{data.nextProject.title}
						</h2>
					</div>
					<span class="inline-flex items-center gap-2 text-sm font-medium text-muted">
						Read project
						<FluentIcon svg={arrowRightIcon} />
					</span>
				</a>
			</nav>
		</div>
	</article>
</main>
