import { getPosts } from '$lib/content/blog/posts.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	posts: getPosts()
});
