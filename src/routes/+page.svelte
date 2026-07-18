<script lang="ts">
	import portrait from '$lib/assets/images/petr-ivan-portrait.jpg?enhanced';
</script>

<svelte:head>
	<title>Petr Ivan</title>
	<meta
		name="description"
		content="The personal website of Petr Ivan. Projects, writing, and things worth exploring."
	/>
</svelte:head>

<main
	class="mx-auto grid min-h-screen max-w-5xl content-center gap-12 px-6 py-16 md:grid-cols-[1fr_auto] md:items-center md:px-10"
>
	<section class="max-w-2xl">
		<p class="mb-5 text-sm font-semibold tracking-[0.16em] text-accent uppercase">
			Website in progress
		</p>
		<h1 class="text-5xl font-semibold tracking-[-0.045em] text-foreground sm:text-7xl">
			Petr Ivan
		</h1>
		<p class="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
			A personal home for projects, writing, and ideas I want to explore properly.
		</p>
	</section>

	<div class="w-40 overflow-hidden rounded-[2rem] border border-border bg-surface sm:w-52">
		<enhanced:img
			src={portrait}
			alt="Portrait of Petr Ivan"
			sizes="(min-width: 640px) 208px, 160px"
			fetchpriority="high"
			class="aspect-square h-auto w-full object-cover"
		/>
	</div>
</main>
