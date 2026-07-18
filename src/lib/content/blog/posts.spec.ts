import { describe, expect, it } from 'vitest';

import { isVisiblePost, type BlogPostMetadata } from './posts';

const publishedPost: BlogPostMetadata = {
	title: 'Published',
	description: 'A published post',
	date: '2026-07-18',
	draft: false
};

const draftPost: BlogPostMetadata = {
	title: 'Draft',
	description: 'A development-only post',
	date: '2026-07-18',
	draft: true
};

describe('isVisiblePost', () => {
	it('includes published posts in production listings', () => {
		expect(isVisiblePost(publishedPost, { includeDrafts: false })).toBe(true);
	});

	it('excludes draft posts from production listings', () => {
		expect(isVisiblePost(draftPost, { includeDrafts: false })).toBe(false);
	});

	it('allows draft posts in development listings', () => {
		expect(isVisiblePost(draftPost, { includeDrafts: true })).toBe(true);
	});
});
