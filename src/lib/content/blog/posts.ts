export interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	socialDescription?: string;
	socialImageAlt?: string;
}

export interface BlogPost {
	slug: string;
	metadata: BlogPostMetadata;
}

export function formatPostDate(date: string): string {
	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(`${date}T00:00:00Z`));
}
