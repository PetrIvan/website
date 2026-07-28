<script lang="ts">
	import { onMount } from 'svelte';
	import sunnyIcon from '@fluentui/svg-icons/icons/weather_sunny_24_filled.svg?raw';
	import moonIcon from '@fluentui/svg-icons/icons/weather_moon_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';

	type Theme = 'light' | 'dark';

	const themeTransitionDuration = 180;
	const themeTransitionCleanupDelay = themeTransitionDuration + 60;

	let transitionTimeout: ReturnType<typeof setTimeout> | undefined;
	let followsSystemTheme = true;

	function applyTheme(nextTheme: Theme, animate = false) {
		const root = document.documentElement;
		const shouldAnimate = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (transitionTimeout !== undefined) {
			clearTimeout(transitionTimeout);
		}

		if (shouldAnimate) {
			root.dataset.themeTransitioning = '';
			transitionTimeout = setTimeout(() => {
				delete root.dataset.themeTransitioning;
				transitionTimeout = undefined;
			}, themeTransitionCleanupDelay);
		} else {
			delete root.dataset.themeTransitioning;
			transitionTimeout = undefined;
		}

		root.dataset.theme = nextTheme;
		root.style.colorScheme = nextTheme;
		document
			.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
			?.setAttribute('content', nextTheme === 'dark' ? '#211c18' : '#f4efe6');
	}

	function toggleTheme() {
		const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
		followsSystemTheme = false;
		applyTheme(nextTheme, true);

		try {
			localStorage.setItem('theme', nextTheme);
		} catch {
			// The selected theme still applies for this page when storage is unavailable.
		}
	}

	onMount(() => {
		let preference: string | null = null;

		try {
			preference = localStorage.getItem('theme');
		} catch {
			// Storage may be unavailable; continue following the system preference.
		}

		followsSystemTheme = preference !== 'light' && preference !== 'dark';
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemThemeChange = (event: MediaQueryListEvent) => {
			if (followsSystemTheme) {
				applyTheme(event.matches ? 'dark' : 'light', true);
			}
		};

		systemTheme.addEventListener('change', handleSystemThemeChange);

		return () => {
			systemTheme.removeEventListener('change', handleSystemThemeChange);

			if (transitionTimeout !== undefined) {
				clearTimeout(transitionTimeout);
			}

			delete document.documentElement.dataset.themeTransitioning;
		};
	});
</script>

<button
	type="button"
	class="inline-flex size-11 items-center justify-center text-foreground transition-[color] hover:text-accent"
	onclick={toggleTheme}
>
	<span class="theme-when-dark" aria-hidden="true">
		<FluentIcon svg={sunnyIcon} />
	</span>
	<span class="theme-when-light" aria-hidden="true">
		<FluentIcon svg={moonIcon} />
	</span>
	<span class="theme-when-dark sr-only">Switch to light theme</span>
	<span class="theme-when-light sr-only">Switch to dark theme</span>
</button>

<style>
	.theme-when-dark {
		display: none;
	}

	:global(:root[data-theme='dark']) .theme-when-light {
		display: none;
	}

	:global(:root[data-theme='dark']) .theme-when-dark {
		display: inline-flex;
	}
</style>
