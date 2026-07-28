import { mdsvex } from 'mdsvex';
import remarkFootnotes from 'remark-footnotes';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

interface HastNode {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
	value?: string;
}

function addFootnoteHeading() {
	return (tree: HastNode) => {
		const visit = (node: HastNode) => {
			const classes = node.properties?.className;

			if (
				node.tagName === 'div' &&
				Array.isArray(classes) &&
				classes.includes('footnotes') &&
				node.children
			) {
				const dividerIndex = node.children.findIndex((child) => child.tagName === 'hr');
				node.children.splice(dividerIndex + 1, 0, {
					type: 'element',
					tagName: 'h2',
					properties: { className: ['footnotes-heading'] },
					children: [{ type: 'text', value: 'Footnotes' }]
				});
				return;
			}

			for (const child of node.children ?? []) visit(child);
		};

		visit(tree);
	};
}

export default defineConfig({
	server: {
		port: 1420,
		strictPort: true
	},
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					remarkPlugins: [remarkFootnotes],
					rehypePlugins: [addFootnoteHeading],
					smartypants: { dashes: 'oldschool' }
				})
			],
			extensions: ['.svelte', '.svx']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
