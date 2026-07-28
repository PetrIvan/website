<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10"
	>
		<div class="max-w-md">
			<p class="font-medium text-foreground">Petr Ivan</p>
			<p class="mt-2 leading-6">
				© {year}. Code under MIT; original writing and images under CC BY 4.0. Source on
				<a
					class="rounded-sm underline transition-[color] hover:text-accent focus-visible:text-accent"
					href="https://github.com/PetrIvan/website"
					target="_blank"
					rel="noreferrer"
				>
					GitHub<span class="sr-only"> (opens in a new tab)</span>
				</a>.
			</p>
		</div>

		<nav class="flex flex-wrap gap-x-5 gap-y-3" aria-label="Contact and social links">
			<a class="rounded-sm transition-[color] hover:text-foreground" href="mailto:hi@petrivan.com">
				Email
			</a>
			<a
				class="rounded-sm transition-[color] hover:text-foreground"
				href="https://github.com/PetrIvan"
				target="_blank"
				rel="me noreferrer"
			>
				GitHub
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
			<a
				class="rounded-sm transition-[color] hover:text-foreground"
				href="https://www.linkedin.com/in/petr-ivan"
				target="_blank"
				rel="me noreferrer"
			>
				LinkedIn
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
		</nav>
	</div>
</footer>
