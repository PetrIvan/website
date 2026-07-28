<script lang="ts">
	import { resolve } from '$app/paths';
	import arrowLeftIcon from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw';
	import FluentIcon from '$lib/components/icons/FluentIcon.svelte';
	import PageMetadata from '$lib/components/site/PageMetadata.svelte';
	import { formatPostDate } from '$lib/content/blog/posts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let proseRoot = $state<HTMLDivElement>();

	$effect(() => {
		const root = proseRoot;
		if (!root) return;

		const enhancedReferences: Array<{
			container: HTMLElement;
			preview: HTMLElement;
			reference: HTMLAnchorElement;
			destroy: () => void;
		}> = [];
		const previewCloseDelay = 250;
		const positionPreview = (container: HTMLElement, preview: HTMLElement) => {
			const viewportPadding = 16;
			const rootFontSize = Number.parseFloat(
				window.getComputedStyle(document.documentElement).fontSize
			);
			const gap = rootFontSize * 0.65;
			const anchorRect = container.getBoundingClientRect();

			preview.style.setProperty('--footnote-preview-max-height', 'none');
			const naturalHeight = preview.scrollHeight + 2;
			const maximumAvailableHeight = Math.max(0, window.innerHeight - viewportPadding * 2);
			const availableAbove = Math.min(
				maximumAvailableHeight,
				Math.max(0, anchorRect.top - viewportPadding - gap)
			);
			const availableBelow = Math.min(
				maximumAvailableHeight,
				Math.max(0, window.innerHeight - anchorRect.bottom - viewportPadding - gap)
			);
			const placement =
				naturalHeight <= availableBelow
					? 'below'
					: naturalHeight <= availableAbove
						? 'above'
						: availableBelow >= availableAbove
							? 'below'
							: 'above';
			const availableHeight = placement === 'above' ? availableAbove : availableBelow;

			preview.dataset.placement = placement;
			preview.style.setProperty(
				'--footnote-preview-max-height',
				`${Math.floor(availableHeight)}px`
			);

			if (window.matchMedia('(max-width: 640px)').matches) {
				preview.style.removeProperty('--footnote-preview-left');
				if (placement === 'above') {
					preview.style.removeProperty('top');
					preview.style.bottom = `${window.innerHeight - anchorRect.top + gap}px`;
				} else {
					preview.style.top = `${anchorRect.bottom + gap}px`;
					preview.style.removeProperty('bottom');
				}
				return;
			}

			preview.style.removeProperty('top');
			preview.style.removeProperty('bottom');
			const previewWidth = preview.getBoundingClientRect().width;
			const desiredLeft = anchorRect.left + anchorRect.width / 2 - previewWidth / 2;
			const boundedLeft = Math.min(
				window.innerWidth - previewWidth - viewportPadding,
				Math.max(viewportPadding, desiredLeft)
			);
			preview.style.setProperty('--footnote-preview-left', `${boundedLeft - anchorRect.left}px`);
		};
		const positionAllPreviews = () => {
			for (const { container, preview } of enhancedReferences) {
				positionPreview(container, preview);
			}
		};
		const positionVisiblePreviews = () => {
			for (const { container, preview } of enhancedReferences) {
				if (container.dataset.previewOpen === 'true') {
					positionPreview(container, preview);
				}
			}
		};
		const enhanceExternalLinks = () => {
			for (const link of root.querySelectorAll<HTMLAnchorElement>(
				'a[href^="https://"], a[href^="http://"]'
			)) {
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
			}
		};

		const enhanceReferences = () => {
			enhanceExternalLinks();
			for (const reference of root.querySelectorAll<HTMLAnchorElement>(
				'a.footnote-ref:not([aria-describedby])'
			)) {
				const target = reference.getAttribute('href');
				const container = reference.parentElement;
				if (!target?.startsWith('#') || !container) continue;

				const note = root.querySelector<HTMLElement>(target);
				if (!note) continue;

				const copy = note.cloneNode(true) as HTMLElement;
				copy.querySelectorAll('.footnote-backref').forEach((backlink) => backlink.remove());

				const preview = document.createElement('span');
				const previewId = `${container.id}-preview`;
				preview.id = previewId;
				preview.className = 'footnote-preview';
				preview.setAttribute('role', 'note');
				preview.innerHTML = copy.innerHTML;

				container.classList.add('footnote-anchor');
				reference.setAttribute('aria-describedby', previewId);
				container.append(preview);

				let closeTimer: number | undefined;
				const cancelClose = () => {
					if (closeTimer === undefined) return;
					window.clearTimeout(closeTimer);
					closeTimer = undefined;
				};
				const openPreview = () => {
					cancelClose();
					positionPreview(container, preview);
					container.dataset.previewOpen = 'true';
				};
				const scheduleClose = () => {
					cancelClose();
					closeTimer = window.setTimeout(() => {
						closeTimer = undefined;
						if (container.matches(':hover') || container.matches(':focus-within')) return;
						delete container.dataset.previewOpen;
					}, previewCloseDelay);
				};
				container.addEventListener('pointerenter', openPreview);
				container.addEventListener('pointerleave', scheduleClose);
				container.addEventListener('focusin', openPreview);
				container.addEventListener('focusout', scheduleClose);
				preview.addEventListener('pointerenter', openPreview);
				preview.addEventListener('pointerleave', scheduleClose);

				const destroy = () => {
					cancelClose();
					container.removeEventListener('pointerenter', openPreview);
					container.removeEventListener('pointerleave', scheduleClose);
					container.removeEventListener('focusin', openPreview);
					container.removeEventListener('focusout', scheduleClose);
					preview.removeEventListener('pointerenter', openPreview);
					preview.removeEventListener('pointerleave', scheduleClose);
					delete container.dataset.previewOpen;
				};

				enhancedReferences.push({ container, preview, reference, destroy });
				positionPreview(container, preview);
			}
		};

		const observer = new MutationObserver(enhanceReferences);
		observer.observe(root, { childList: true, subtree: true });
		window.addEventListener('resize', positionAllPreviews);
		window.addEventListener('scroll', positionVisiblePreviews, { passive: true });
		enhanceReferences();

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', positionAllPreviews);
			window.removeEventListener('scroll', positionVisiblePreviews);
			for (const { container, preview, reference, destroy } of enhancedReferences) {
				destroy();
				preview.remove();
				container.classList.remove('footnote-anchor');
				reference.removeAttribute('aria-describedby');
			}
		};
	});
</script>

<PageMetadata
	title={`${data.metadata.title} · Petr Ivan`}
	description={data.metadata.description}
	type="article"
	publishedTime={data.metadata.date}
/>

<main class="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
	<article class="mx-auto max-w-3xl">
		<header>
			<a
				href={resolve('/blog/')}
				class="inline-flex items-center gap-2 text-sm font-medium text-muted transition-[color] hover:text-foreground"
			>
				<FluentIcon svg={arrowLeftIcon} />
				All posts
			</a>
			<div class="mt-10 flex flex-wrap items-center gap-3 text-sm text-accent">
				<time datetime={data.metadata.date}>{formatPostDate(data.metadata.date)}</time>
			</div>
			<h1
				class="mt-4 text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-foreground sm:text-6xl"
			>
				{data.metadata.title}
			</h1>
			<p class="mt-6 text-xl leading-9 text-muted">{data.metadata.description}</p>
		</header>

		<div
			bind:this={proseRoot}
			class="article-prose prose-content mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12"
		>
			<!-- Blog HTML is rendered from trusted local mdsvex source in the server load. -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</article>
</main>

<style>
	.article-prose {
		color: var(--color-muted);
		font-size: 1.0625rem;
		line-height: 1.85;
	}

	.article-prose :global(h2) {
		margin-block: 2.75rem 1rem;
		color: var(--color-foreground);
		font-size: 1.75rem;
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.2;
	}

	.article-prose :global(h3) {
		margin-block: 2.25rem 0.75rem;
		color: var(--color-foreground);
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.3;
	}

	.article-prose :global(p),
	.article-prose :global(ul),
	.article-prose :global(ol),
	.article-prose :global(table),
	.article-prose :global(blockquote) {
		margin-block: 1.25rem;
	}

	.article-prose :global(ul),
	.article-prose :global(ol) {
		padding-left: 1.35rem;
	}

	.article-prose :global(ul) {
		list-style: disc;
	}

	.article-prose :global(ol) {
		list-style: decimal;
	}

	.article-prose :global(li + li) {
		margin-top: 0.4rem;
	}

	.article-prose :global(blockquote) {
		border-left: 2px solid var(--color-accent);
		padding-left: 1.25rem;
		color: var(--color-foreground);
	}

	.article-prose :global(code) {
		border-radius: 0.3rem;
		background: var(--color-surface);
		padding: 0.12em 0.35em;
		color: var(--color-foreground);
		font-size: 0.92em;
	}

	.article-prose :global(table) {
		display: block;
		width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
		font-size: 0.95em;
		line-height: 1.6;
	}

	.article-prose :global(th),
	.article-prose :global(td) {
		border-bottom: 1px solid var(--color-border);
		padding: 0.65rem 1rem 0.65rem 0;
		text-align: left;
		vertical-align: top;
	}

	.article-prose :global(th) {
		color: var(--color-foreground);
		font-weight: 500;
	}

	.article-prose :global(sup[id^='fnref-']) {
		position: relative;
		top: -0.4em;
		font-size: 0.72em;
		line-height: 0;
		vertical-align: baseline;
	}

	.article-prose :global(a.footnote-ref) {
		margin-left: 0.08em;
		padding: 0;
		color: inherit;
		font-size: 1em;
		font-weight: inherit;
		text-decoration: none;
	}

	.article-prose :global(a.footnote-ref:hover),
	.article-prose :global(a.footnote-ref:focus-visible) {
		color: inherit;
	}

	.article-prose :global(.footnote-preview) {
		position: absolute;
		z-index: 20;
		left: var(--footnote-preview-left, 0);
		width: min(26rem, calc(100vw - 2rem));
		max-height: var(--footnote-preview-max-height, calc(100vh - 2rem));
		visibility: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		border: 1px solid var(--color-border);
		border-radius: 0.4rem;
		background: var(--color-background);
		padding: 0.75rem 0.85rem;
		color: var(--color-muted);
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: normal;
		line-height: 1.5;
		opacity: 0;
		pointer-events: none;
		scrollbar-color: color-mix(in srgb, var(--color-muted) 55%, transparent) transparent;
		scrollbar-width: thin;
		text-align: left;
		text-transform: none;
		transition:
			opacity 120ms ease,
			visibility 120ms ease;
	}

	.article-prose :global(.footnote-preview[data-placement='above']) {
		top: auto;
		bottom: calc(100% + 0.65rem);
	}

	.article-prose :global(.footnote-preview[data-placement='below']) {
		top: calc(100% + 0.65rem);
		bottom: auto;
	}

	.article-prose :global(.footnote-preview::-webkit-scrollbar) {
		width: 0.45rem;
	}

	.article-prose :global(.footnote-preview::-webkit-scrollbar-track) {
		background: transparent;
	}

	.article-prose :global(.footnote-preview::-webkit-scrollbar-thumb) {
		border: 0.12rem solid transparent;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-muted) 55%, transparent);
		background-clip: padding-box;
	}

	.article-prose :global(.footnote-preview a) {
		color: inherit;
		font-weight: inherit;
	}

	.article-prose :global(.footnote-preview a:hover),
	.article-prose :global(.footnote-preview a:focus-visible) {
		color: var(--color-accent);
	}

	.article-prose :global(.footnote-anchor[data-preview-open='true'] > .footnote-preview),
	.article-prose :global(.footnote-anchor:focus-within > .footnote-preview) {
		visibility: visible;
		opacity: 1;
		pointer-events: auto;
	}

	.article-prose :global(.footnotes hr) {
		margin-block: 3.25rem 0;
		border: 0;
		border-top: 1px solid var(--color-border);
	}

	.article-prose :global(.footnotes .footnotes-heading) {
		margin-block: 1.5rem 0.75rem;
		font-size: 1.25rem;
		letter-spacing: -0.02em;
		line-height: 1.3;
	}

	.article-prose :global(.footnotes ol) {
		margin-top: 0;
		font-size: 0.9em;
		line-height: 1.65;
	}

	.article-prose :global(.footnotes li) {
		padding-left: 0.25rem;
		scroll-margin-top: 2rem;
	}

	.article-prose :global(.footnotes a) {
		color: inherit;
		font-weight: inherit;
	}

	.article-prose :global(.footnotes a:hover),
	.article-prose :global(.footnotes a:focus-visible) {
		color: var(--color-accent);
	}

	.article-prose :global(.footnote-backref) {
		margin-left: 0.35rem;
		text-decoration: none;
	}

	@media (max-width: 640px) {
		.article-prose :global(.footnote-preview) {
			position: fixed;
			right: 1rem;
			left: 1rem;
			width: auto;
		}

		.article-prose :global(.footnote-preview[data-placement='above']),
		.article-prose :global(.footnote-preview[data-placement='below']) {
			bottom: auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.article-prose :global(.footnote-preview) {
			transition: none;
		}
	}
</style>
