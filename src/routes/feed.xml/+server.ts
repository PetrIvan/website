import { getPosts } from '$lib/content/blog/posts.server';
import type { RequestHandler } from './$types';

const siteUrl = 'https://petrivan.com';
const feedUrl = `${siteUrl}/feed.xml`;

export const prerender = true;

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export const GET: RequestHandler = () => {
	const posts = getPosts();
	const latestPostDate = posts.at(0)?.metadata.date;
	const items = posts
		.map(({ slug, metadata }) => {
			const url = `${siteUrl}/blog/${slug}/`;
			const publishedAt = new Date(`${metadata.date}T00:00:00Z`).toUTCString();

			return `\t\t<item>
\t\t\t<title>${escapeXml(metadata.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<description>${escapeXml(metadata.description)}</description>
\t\t\t<pubDate>${publishedAt}</pubDate>
\t\t</item>`;
		})
		.join('\n');
	const lastBuildDate = latestPostDate
		? `\n\t\t<lastBuildDate>${new Date(`${latestPostDate}T00:00:00Z`).toUTCString()}</lastBuildDate>`
		: '';
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>Petr Ivan</title>
\t\t<link>${siteUrl}/blog/</link>
\t\t<description>Essays and notes by Petr Ivan on machine learning, creative software and other subjects.</description>
\t\t<language>en-gb</language>
\t\t<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />${lastBuildDate}
${items}
\t</channel>
</rss>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
