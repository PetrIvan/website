<script lang="ts">
	import { resolve } from '$app/paths';
	import arrowRightIcon from '@fluentui/svg-icons/icons/arrow_right_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import ProjectVisual from '$lib/components/projects/ProjectVisual.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';
	import { projects } from '$lib/content/projects';

	const description =
		'Selected machine learning, creative software and game projects by Petr Ivan.';
</script>

<PageMetadata title="Projects · Petr Ivan" {description} />

<main class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
	<header class="max-w-3xl">
		<h1 class="text-4xl font-medium tracking-[-0.045em] text-foreground sm:text-6xl">Projects</h1>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
			A selection of work in machine learning, creative software and game development.
		</p>
	</header>

	<div class="mt-14 grid gap-7 sm:mt-18">
		{#each projects as project (project.id)}
			<a
				href={resolve(`/projects/${project.id}/`)}
				id={project.id}
				class="group scroll-mt-6 rounded-[1.25rem] border border-border bg-surface p-5 transition-[border-color] hover:border-accent sm:p-7 lg:p-8"
			>
				<div class="grid gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-center">
					<div>
						<p class="text-sm font-medium text-accent">{project.label} · {project.period}</p>
						<h2 class="mt-4 text-3xl font-medium tracking-[-0.035em] text-foreground sm:text-4xl">
							{project.title}
						</h2>
						<p class="mt-5 max-w-2xl text-lg leading-8 text-muted">{project.cardSummary}</p>
						<span
							class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-[color] group-hover:text-accent"
						>
							Read project
							<FluentIcon svg={arrowRightIcon} />
						</span>
					</div>

					<ProjectVisual visual={project.cardVisual} mode="card" />
				</div>
			</a>
		{/each}
	</div>
</main>
