<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const isNotFound = $derived(page.status === 404);
	const heading = $derived(isNotFound ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		isNotFound
			? 'The address may be wrong, or the page may have moved.'
			: 'The page could not be loaded. Returning home is the safest place to continue.'
	);
</script>

<svelte:head>
	<title>{page.status} · Petr Ivan</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-[calc(100svh-4.5rem)] items-center">
	<section
		aria-labelledby="error-heading"
		class="mx-auto w-full max-w-2xl px-6 py-20 text-center sm:px-8 sm:py-24"
	>
		<p class="text-sm font-medium text-accent">{page.status}</p>
		<h1
			id="error-heading"
			class="mt-4 text-4xl leading-tight font-medium tracking-[-0.04em] text-foreground sm:text-5xl"
		>
			{heading}
		</h1>
		<p class="mx-auto mt-5 max-w-lg text-lg leading-8 text-muted">{description}</p>

		<nav
			class="mt-8 flex flex-wrap items-center justify-center gap-3"
			aria-label="Error page links"
		>
			<a
				href={resolve('/')}
				style="color: var(--background)"
				class="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium transition-[color,background-color] hover:bg-accent"
			>
				Return home
			</a>
			<a
				href={resolve('/blog/')}
				class="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-[color,border-color] hover:border-accent hover:text-accent"
			>
				Browse writing
			</a>
		</nav>
	</section>
</main>
