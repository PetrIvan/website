<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import dismissIcon from '@fluentui/svg-icons/icons/dismiss_24_filled.svg?raw';
	import navigationIcon from '@fluentui/svg-icons/icons/navigation_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const navigation = [
		{ href: '/projects/', label: 'Projects' },
		{ href: '/blog/', label: 'Blog' },
		{ href: '/about/', label: 'About' }
	] as const;

	let menuOpen = $state(false);
	let currentPath = $derived(page.url.pathname);
	let menuButton = $state<HTMLButtonElement>();
	let closeButton = $state<HTMLButtonElement>();
	let menuDialog = $state<HTMLDivElement>();
	let menuScrollOffset = 0;

	function isActive(href: string) {
		return currentPath === href || currentPath.startsWith(href);
	}

	async function openMenu() {
		menuScrollOffset = window.scrollY;
		menuOpen = true;
		await tick();
		closeButton?.focus();
	}

	async function closeMenu(returnFocus = false) {
		menuOpen = false;

		if (returnFocus) {
			await tick();
			menuButton?.focus();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			void closeMenu(true);
			return;
		}

		if (event.key !== 'Tab' || !menuOpen || !menuDialog) {
			return;
		}

		const focusableElements = Array.from(
			menuDialog.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements.at(-1);

		if (!firstElement || !lastElement) {
			return;
		}

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	}

	function handleResize() {
		if (window.innerWidth >= 768 && menuOpen) {
			menuOpen = false;
		}
	}

	$effect(() => {
		if (currentPath) {
			menuOpen = false;
		}
	});

	$effect(() => {
		if (!menuOpen) {
			return;
		}

		const root = document.documentElement;
		const body = document.body;
		const scrollOffset = menuScrollOffset;
		const previousRootOverflow = root.style.overflow;
		const previousBodyPosition = body.style.position;
		const previousBodyTop = body.style.top;
		const previousBodyRight = body.style.right;
		const previousBodyLeft = body.style.left;
		const previousBodyWidth = body.style.width;

		body.style.position = 'fixed';
		body.style.top = `-${scrollOffset}px`;
		body.style.right = '0';
		body.style.left = '0';
		body.style.width = '100%';
		root.style.overflow = 'hidden';

		return () => {
			root.style.overflow = previousRootOverflow;
			body.style.position = previousBodyPosition;
			body.style.top = previousBodyTop;
			body.style.right = previousBodyRight;
			body.style.left = previousBodyLeft;
			body.style.width = previousBodyWidth;
			window.scrollTo(0, scrollOffset);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} onresize={handleResize} />

<header class="border-b border-border">
	<div class="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-10">
		<a
			href={resolve('/')}
			class="rounded-md text-lg font-medium tracking-[-0.025em] text-foreground transition-[color] hover:text-accent"
		>
			Petr Ivan
		</a>

		<div class="flex items-center gap-2 md:gap-8">
			<nav class="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
				{#each navigation as item (item.href)}
					<a
						href={resolve(item.href)}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class:text-accent={isActive(item.href)}
						class="rounded-md text-sm font-medium text-muted transition-[color] hover:text-foreground"
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<ThemeToggle />
			<button
				bind:this={menuButton}
				type="button"
				class="inline-flex size-11 items-center justify-center text-foreground transition-[color] hover:text-accent md:hidden"
				aria-label="Open navigation menu"
				aria-expanded={menuOpen}
				aria-controls="mobile-navigation"
				onclick={openMenu}
			>
				<FluentIcon svg={navigationIcon} />
			</button>
		</div>
	</div>

	<div
		class:mobile-navigation-open={menuOpen}
		class="mobile-navigation-layer fixed inset-0 z-50 md:hidden"
		aria-hidden={!menuOpen}
	>
		<button
			type="button"
			tabindex="-1"
			aria-label="Close navigation menu"
			class="absolute inset-0 size-full bg-foreground/20 backdrop-blur-[2px]"
			onclick={() => void closeMenu(true)}
		></button>

		<div
			bind:this={menuDialog}
			id="mobile-navigation"
			role="dialog"
			aria-modal={menuOpen ? 'true' : undefined}
			aria-labelledby="mobile-navigation-title"
			class="mobile-navigation-drawer absolute top-0 right-0 flex h-dvh w-80 max-w-[calc(100vw-3rem)] flex-col border-l border-border bg-background"
		>
			<p id="mobile-navigation-title" class="sr-only">Navigation</p>
			<div class="flex h-18 flex-none items-center justify-between border-b border-border px-6">
				<a
					href={resolve('/')}
					class="rounded-md text-lg font-medium tracking-[-0.025em] text-foreground"
				>
					Petr Ivan
				</a>
				<button
					bind:this={closeButton}
					type="button"
					class="inline-flex size-11 items-center justify-center text-foreground"
					aria-label="Close navigation menu"
					onclick={() => void closeMenu(true)}
				>
					<FluentIcon svg={dismissIcon} />
				</button>
			</div>

			<nav class="grid px-6 py-4" aria-label="Mobile navigation">
				{#each navigation as item (item.href)}
					<a
						href={resolve(item.href)}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class="group border-b border-border py-5 text-lg font-medium"
					>
						<span
							class:text-accent={isActive(item.href)}
							class:text-foreground={!isActive(item.href)}
							class="transition-[color] group-hover:text-accent"
						>
							{item.label}
						</span>
					</a>
				{/each}
			</nav>
		</div>
	</div>
</header>

<style>
	.mobile-navigation-layer {
		visibility: hidden;
		pointer-events: none;
		transition: visibility 0s linear 400ms;
	}

	.mobile-navigation-layer.mobile-navigation-open {
		visibility: visible;
		pointer-events: auto;
		transition-delay: 0s;
	}

	.mobile-navigation-drawer {
		transform: translateX(100%);
		transition: transform 400ms ease-in-out;
	}

	.mobile-navigation-open .mobile-navigation-drawer {
		transform: translateX(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-navigation-layer {
			transition-delay: 0s;
		}

		.mobile-navigation-drawer {
			transition: none;
		}
	}
</style>
