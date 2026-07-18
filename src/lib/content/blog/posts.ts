export interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	draft: boolean;
	tags?: string[];
}

export function isVisiblePost(
	metadata: BlogPostMetadata,
	{ includeDrafts = import.meta.env.DEV }: { includeDrafts?: boolean } = {}
): boolean {
	return includeDrafts || !metadata.draft;
}
