import path from 'node:path';
import { compile } from 'mdsvex';

export async function parseArticleCard(source, fileName) {
	const compiled = await compile(source, { filename: fileName });
	const metadata = compiled?.data?.fm;
	if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
		throw new Error(`Could not find frontmatter in ${fileName}`);
	}

	const title = typeof metadata.title === 'string' ? metadata.title.trim() : '';
	const descriptionValue = metadata.socialDescription ?? metadata.description;
	const description = typeof descriptionValue === 'string' ? descriptionValue.trim() : '';
	if (!title || !description) {
		throw new Error(`Could not find title and description in ${fileName}`);
	}

	return {
		slug: path.basename(fileName, path.extname(fileName)),
		title,
		description
	};
}
