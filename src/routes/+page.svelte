<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import arrowDownloadIcon from '@fluentui/svg-icons/icons/arrow_download_24_filled.svg?raw';
	import arrowRightIcon from '@fluentui/svg-icons/icons/arrow_right_24_filled.svg?raw';
	import mailIcon from '@fluentui/svg-icons/icons/mail_24_filled.svg?raw';
	import githubIcon from '$lib/assets/icons/github.svg?raw';
	import linkedinIcon from '$lib/assets/icons/linkedin.svg?raw';
	import xIcon from '$lib/assets/icons/x.svg?raw';
	import BrandIcon from '$lib/components/icons/BrandIcon.svelte';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import ProjectVisual from '$lib/components/projects/ProjectVisual.svelte';
	import ProfilePortrait from '$lib/components/profile/ProfilePortrait.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';
	import { formatPostDate } from '$lib/content/blog/posts';
	import { featuredProjects } from '$lib/content/projects';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const description =
		'Petr Ivan is a machine learning engineer and Computer Science and Engineering student at TU Delft, with work across ML systems and creative software.';
	const recentPosts = $derived(data.recentPosts);
</script>

<PageMetadata title="Petr Ivan" {description} type="profile" />

<main>
	<section
		class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:grid md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-x-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-x-16 lg:px-10 lg:py-28"
	>
		<p
			class="flex items-center gap-3 text-sm font-medium text-accent md:col-start-1 md:row-start-1"
		>
			<span class="h-px w-8 bg-accent" aria-hidden="true"></span>
			Machine Learning Engineer · CS at TU Delft
		</p>
		<h1
			class="mt-7 max-w-3xl text-4xl leading-[1.06] font-medium tracking-[-0.045em] text-foreground sm:text-5xl md:col-start-1 md:row-start-2 lg:text-6xl"
		>
			I build machine learning systems and the products around them.
		</h1>
		<p class="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl md:col-start-1 md:row-start-3">
			My work has focused on music and creative software. I created ChordSeqAI and previously worked
			as Lead AI Engineer on Mozart AI.
		</p>
		<nav
			aria-label="Contact and profile links"
			class="mt-5 flex items-center gap-1 md:col-start-1 md:row-start-4"
		>
			<a
				href={asset('/petr-ivan-resume.pdf')}
				download
				class="inline-flex h-10 items-center gap-2 rounded-md text-sm font-medium text-foreground transition-[color] hover:text-accent"
			>
				Résumé
				<FluentIcon svg={arrowDownloadIcon} />
			</a>
			<span class="mx-2 h-5 w-px bg-border" aria-hidden="true"></span>
			<a
				href="mailto:hi@petrivan.com"
				aria-label="Email Petr Ivan"
				title="Email"
				class="group inline-flex size-10 items-center justify-center rounded-md"
			>
				<span class="inline-flex text-muted transition-[color] group-hover:text-accent">
					<FluentIcon svg={mailIcon} />
				</span>
			</a>
			<a
				href="https://github.com/PetrIvan"
				target="_blank"
				rel="me noreferrer"
				aria-label="GitHub (opens in a new tab)"
				title="GitHub"
				class="group inline-flex size-10 items-center justify-center rounded-md"
			>
				<span class="inline-flex text-muted transition-[color] group-hover:text-accent">
					<BrandIcon svg={githubIcon} />
				</span>
			</a>
			<a
				href="https://x.com/petrivanml"
				target="_blank"
				rel="me noreferrer"
				aria-label="X (opens in a new tab)"
				title="X"
				class="group inline-flex size-10 items-center justify-center rounded-md"
			>
				<span class="inline-flex text-muted transition-[color] group-hover:text-accent">
					<BrandIcon svg={xIcon} />
				</span>
			</a>
			<a
				href="https://www.linkedin.com/in/petr-ivan"
				target="_blank"
				rel="me noreferrer"
				aria-label="LinkedIn (opens in a new tab)"
				title="LinkedIn"
				class="group inline-flex size-10 items-center justify-center rounded-md"
			>
				<span class="inline-flex text-muted transition-[color] group-hover:text-accent">
					<BrandIcon svg={linkedinIcon} />
				</span>
			</a>
		</nav>
		<div
			class="mx-auto mt-8 w-72 sm:mt-10 md:col-start-2 md:row-start-1 md:row-end-5 md:mx-0 md:mt-0 md:w-full md:self-center"
		>
			<ProfilePortrait
				sizes="(min-width: 1024px) 304px, (min-width: 768px) 224px, 288px"
				priority
			/>
		</div>
	</section>

	<section class="border-t border-border">
		<div class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
			<div class="flex items-end justify-between gap-5">
				<div>
					<p class="text-sm font-medium text-accent">Selected work</p>
					<h2 class="mt-3 text-3xl font-medium tracking-[-0.035em] text-foreground sm:text-4xl">
						Projects
					</h2>
				</div>
				<a
					href={resolve('/projects/')}
					class="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition-[color] hover:text-foreground"
				>
					All projects
					<FluentIcon svg={arrowRightIcon} />
				</a>
			</div>

			<div class="mt-10 grid gap-5">
				{#each featuredProjects as project (project.id)}
					<a
						href={resolve(`/projects/${project.id}/`)}
						class="group rounded-[1.25rem] border border-border bg-surface p-5 transition-[border-color] hover:border-accent sm:p-7 lg:h-[15.25rem]"
					>
						<div
							class="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] md:items-center lg:h-full"
						>
							<div>
								<p class="text-sm font-medium text-accent">
									{project.label} · {project.period}
								</p>
								<h3
									class="mt-4 text-2xl font-medium tracking-[-0.03em] text-foreground sm:text-3xl"
								>
									{project.title}
								</h3>
								<p class="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
									{project.cardSummary}
								</p>
								<span
									class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-[color] group-hover:text-accent"
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
		</div>
	</section>

	{#if recentPosts.length > 0}
		<section class="border-t border-border">
			<div class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
				<div class="flex items-end justify-between gap-5">
					<div>
						<p class="text-sm font-medium text-accent">Notes and essays</p>
						<h2 class="mt-3 text-3xl font-medium tracking-[-0.035em] text-foreground sm:text-4xl">
							Blog
						</h2>
					</div>
					<a
						href={resolve('/blog/')}
						class="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition-[color] hover:text-foreground"
					>
						All posts
						<FluentIcon svg={arrowRightIcon} />
					</a>
				</div>

				<div class="mt-10 divide-y divide-border border-y border-border">
					{#each recentPosts as post (post.slug)}
						<article class="py-8 sm:py-10">
							<a href={resolve(`/blog/${post.slug}/`)} class="group block">
								<div>
									<div class="flex flex-wrap items-center gap-3 text-sm text-accent">
										<time datetime={post.metadata.date}>
											{formatPostDate(post.metadata.date)}
										</time>
									</div>
									<h3
										class="mt-3 max-w-3xl text-2xl font-medium tracking-[-0.03em] text-foreground transition-[color] group-hover:text-accent sm:text-3xl"
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
			</div>
		</section>
	{/if}
</main>
