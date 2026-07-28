import type { Component } from 'svelte';
import { render } from 'svelte/server';
import type { BlogPost, BlogPostMetadata } from './posts';

type BlogPostFrontmatter = Omit<BlogPostMetadata, 'date'> & { date: unknown };
type BlogPostModule = {
	default: Component;
	metadata: BlogPostFrontmatter;
};

const postModules = import.meta.glob<BlogPostModule>('./*.svx', { eager: true });

function normalizePostDate(value: unknown): string {
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}

	const parsed = new Date(value as string | number | Date);

	if (Number.isNaN(parsed.getTime())) {
		throw new TypeError(`Invalid blog post date: ${String(value)}`);
	}

	return parsed.toISOString().slice(0, 10);
}

const posts = Object.entries(postModules)
	.map(([path, postModule]) => ({
		slug:
			path
				.split('/')
				.at(-1)
				?.replace(/\.svx$/, '') ?? '',
		metadata: {
			...postModule.metadata,
			date: normalizePostDate(postModule.metadata.date)
		}
	}))
	.filter((post) => post.slug)
	.sort((left, right) => right.metadata.date.localeCompare(left.metadata.date));

const postComponents = new Map(
	Object.entries(postModules).map(([path, postModule]) => [
		path
			.split('/')
			.at(-1)
			?.replace(/\.svx$/, '') ?? '',
		postModule.default
	])
);

export function getPosts(): BlogPost[] {
	return posts;
}

export function getPost(slug: string): BlogPost | undefined {
	return posts.find((post) => post.slug === slug);
}

export function renderPost(slug: string): string | undefined {
	const component = postComponents.get(slug);
	return component ? render(component).body : undefined;
}
