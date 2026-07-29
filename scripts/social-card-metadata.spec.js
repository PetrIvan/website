import { describe, expect, it } from 'vitest';
import { parseArticleCard } from './social-card-metadata.mjs';

describe('parseArticleCard', () => {
	it('reads multiline YAML strings without retaining quotes or truncating text', async () => {
		const article = await parseArticleCard(
			`---
title: 'What Should Count as a Transformer Token?'
description: 'Fallback description.'
socialDescription:
  'Finer tokens spend more compute on the global sequence. Larger tokens move more work into local
  encoding.'
---
`,
			'token-boundaries.svx'
		);

		expect(article).toEqual({
			slug: 'token-boundaries',
			title: 'What Should Count as a Transformer Token?',
			description:
				'Finer tokens spend more compute on the global sequence. Larger tokens move more work into local encoding.'
		});
	});
});
