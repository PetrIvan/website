<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import arrowDownloadIcon from '@fluentui/svg-icons/icons/arrow_download_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import ProfilePortrait from '$lib/components/profile/ProfilePortrait.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';

	const description =
		"Petr Ivan's background, experience and education across machine learning, product engineering and music technology.";
</script>

<PageMetadata title="About · Petr Ivan" {description} />

<main class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
	<section
		class="md:grid md:grid-cols-[minmax(0,1fr)_14rem] md:items-start md:gap-x-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-x-16"
	>
		<h1
			class="max-w-3xl text-4xl font-medium tracking-[-0.045em] text-foreground sm:text-6xl md:col-start-1 md:row-start-1"
		>
			About
		</h1>
		<div class="mt-7 max-w-2xl text-lg leading-8 text-muted md:col-start-1 md:row-start-2">
			<p>
				I’m Petr, a machine learning engineer and Computer Science and Engineering student at TU
				Delft. My work usually spans data and model development, inference, interfaces and
				deployment.
			</p>
			<p class="mt-5">
				I played piano for twelve years. That background led to ChordSeqAI and later to my work on
				Mozart AI.
			</p>
			<p class="mt-5">I’m interested in consciousness and philosophy of mind.</p>
			<a
				href={asset('/petr-ivan-resume.pdf')}
				download
				class="mt-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition-[color] hover:text-accent"
			>
				Download résumé
				<FluentIcon svg={arrowDownloadIcon} />
			</a>
		</div>
		<div
			class="mx-auto mt-8 w-72 sm:mt-10 md:col-start-2 md:row-start-1 md:row-end-3 md:mx-0 md:mt-0 md:w-full"
		>
			<ProfilePortrait sizes="(min-width: 1024px) 304px, (min-width: 768px) 224px, 288px" />
		</div>
	</section>

	<section
		class="mt-16 grid gap-8 border-t border-border pt-12 sm:mt-20 md:grid-cols-[0.7fr_1.3fr] md:gap-12"
	>
		<div>
			<h2 class="text-2xl font-medium tracking-[-0.03em] text-foreground">Experience</h2>
		</div>
		<div>
			<article>
				<div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
					<div>
						<h3 class="text-lg font-medium text-foreground">Lead AI Engineer</h3>
						<p class="mt-1 text-sm font-medium text-accent">Arthos · Mozart AI</p>
					</div>
					<p class="shrink-0 text-sm text-muted">May 2025 – June 2026</p>
				</div>
				<p class="prose-content mt-4 max-w-xl leading-7 text-muted">
					Joined Arthos as its first non-founding engineer before the launch of Mozart AI. Built and
					shipped machine learning systems for MIDI generation and audio-to-MIDI transcription,
					spanning model training, evaluation, production inference, GCP deployment, and product
					integration. Also contributed to Vibe Sessions, social features, infrastructure and CI/CD,
					and co-authored
					<a href="https://openreview.net/forum?id=7lB2t6tDpW" target="_blank" rel="noreferrer"
						>Mozart AI demo paper</a
					>
					for the NeurIPS 2025 AI4Music workshop.
				</p>
			</article>

			<article class="mt-8 border-t border-border pt-8">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
					<div>
						<h3 class="text-lg font-medium text-foreground">Trainee</h3>
						<p class="mt-1 text-sm font-medium text-accent">Student Trainee Center</p>
					</div>
					<p class="shrink-0 text-sm text-muted">January 2022 – December 2023</p>
				</div>
				<p class="prose-content mt-4 max-w-xl leading-7 text-muted">
					Completed a selective two-year apprenticeship supported by Microsoft, focused on modern
					technologies and soft skills. Built
					<a href={resolve('/projects/chordseqai/')}>ChordSeqAI</a>
					as the final project and graduated with distinction.
				</p>
			</article>
		</div>
	</section>

	<section
		class="mt-16 grid gap-8 border-t border-border pt-12 sm:mt-20 md:grid-cols-[0.7fr_1.3fr] md:gap-12"
	>
		<div>
			<h2 class="text-2xl font-medium tracking-[-0.03em] text-foreground">Education</h2>
		</div>
		<div>
			<article>
				<div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
					<div>
						<h3 class="text-lg font-medium text-foreground">Delft University of Technology</h3>
						<p class="mt-1 text-sm font-medium text-accent">BSc Computer Science and Engineering</p>
					</div>
					<p class="shrink-0 text-sm text-muted">2025 – 2028</p>
				</div>
			</article>
		</div>
	</section>
</main>
