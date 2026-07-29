import type { Component } from 'svelte';
import { render } from 'svelte/server';
import type { BlogPost, BlogPostMetadata } from './posts';

type BlogPostModule = {
	default: Component;
	metadata: unknown;
};

const postModules = import.meta.glob<BlogPostModule>('./*.svx', { eager: true });

function normalizePostDate(value: unknown): string {
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const parsed = new Date(`${value}T00:00:00Z`);
		if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value) {
			return value;
		}

		throw new TypeError(`Invalid blog post date: ${value}`);
	}

	const parsed = new Date(value as string | number | Date);

	if (Number.isNaN(parsed.getTime())) {
		throw new TypeError(`Invalid blog post date: ${String(value)}`);
	}

	return parsed.toISOString().slice(0, 10);
}

export function normalizePostMetadata(value: unknown, path = 'blog post'): BlogPostMetadata {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new TypeError(`Invalid metadata in ${path}: expected an object`);
	}

	const metadata = value as Record<string, unknown>;
	const title = typeof metadata.title === 'string' ? metadata.title.trim() : '';
	const description = typeof metadata.description === 'string' ? metadata.description.trim() : '';
	const socialDescription =
		typeof metadata.socialDescription === 'string' ? metadata.socialDescription.trim() : undefined;
	const socialImageAlt =
		typeof metadata.socialImageAlt === 'string' ? metadata.socialImageAlt.trim() : undefined;

	if (!title) throw new TypeError(`Invalid metadata in ${path}: title must be a non-empty string`);
	if (!description) {
		throw new TypeError(`Invalid metadata in ${path}: description must be a non-empty string`);
	}
	if (metadata.socialDescription !== undefined && !socialDescription) {
		throw new TypeError(
			`Invalid metadata in ${path}: socialDescription must be a non-empty string`
		);
	}
	if (metadata.socialImageAlt !== undefined && !socialImageAlt) {
		throw new TypeError(`Invalid metadata in ${path}: socialImageAlt must be a non-empty string`);
	}

	return {
		title,
		description,
		date: normalizePostDate(metadata.date),
		...(socialDescription ? { socialDescription } : {}),
		...(socialImageAlt ? { socialImageAlt } : {})
	};
}

const posts = Object.entries(postModules)
	.map(([path, postModule]) => ({
		slug:
			path
				.split('/')
				.at(-1)
				?.replace(/\.svx$/, '') ?? '',
		metadata: normalizePostMetadata(postModule.metadata, path)
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
