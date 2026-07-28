import { getPosts } from '$lib/content/blog/posts.server';
import { projects } from '$lib/content/projects';
import type { RequestHandler } from './$types';

const siteUrl = 'https://petrivan.com';
const staticPaths = ['/', '/projects/', '/blog/', '/about/'];

export const prerender = true;

export const GET: RequestHandler = () => {
	const projectPaths = projects.map((project) => `/projects/${project.id}/`);
	const postPaths = getPosts().map((post) => `/blog/${post.slug}/`);
	const paths = [...staticPaths, ...projectPaths, ...postPaths];
	const urls = paths.map((path) => `\t<url><loc>${siteUrl}${path}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
