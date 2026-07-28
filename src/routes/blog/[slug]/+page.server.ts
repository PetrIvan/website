import { error } from '@sveltejs/kit';
import { getPost, getPosts, renderPost } from '$lib/content/blog/posts.server';
import type { PageServerLoad } from './$types';

export const entries = () =>
	getPosts().map((post) => ({
		slug: post.slug
	}));

export const load: PageServerLoad = ({ params }) => {
	const post = getPost(params.slug);
	const content = renderPost(params.slug);

	if (!post || content === undefined) {
		error(404, 'Post not found');
	}

	return {
		metadata: post.metadata,
		content
	};
};
