import { describe, expect, it } from 'vitest';

import { getPosts, normalizePostMetadata } from './posts.server';
import { formatPostDate } from './posts';

describe('formatPostDate', () => {
	it('formats ISO dates for display', () => {
		expect(formatPostDate('2026-07-21')).toBe('21 July 2026');
	});

	it('keeps listing data limited to the slug and metadata', () => {
		const post = getPosts().find((candidate) => candidate.slug === 'token-boundaries');

		expect(post).toEqual({
			slug: 'token-boundaries',
			metadata: {
				title: 'What Should Count as a Transformer Token?',
				description: 'Choosing which information deserves independent global computation.',
				date: '2026-07-27'
			}
		});
		expect(post).not.toHaveProperty('component');
	});

	it('validates parsed frontmatter at runtime', () => {
		expect(
			normalizePostMetadata(
				{ title: '  Title  ', description: '  Description  ', date: '2026-07-27' },
				'test.svx'
			)
		).toEqual({ title: 'Title', description: 'Description', date: '2026-07-27' });
		expect(() =>
			normalizePostMetadata({ title: '', description: 'Description', date: '2026-07-27' })
		).toThrow(/title must be a non-empty string/);
		expect(() =>
			normalizePostMetadata({ title: 'Title', description: 'Description', date: '2026-02-30' })
		).toThrow(/Invalid blog post date/);
	});
});
