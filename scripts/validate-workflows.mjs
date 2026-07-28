import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const workflowsRoot = path.join(process.cwd(), '.github', 'workflows');
const workflowFiles = (await readdir(workflowsRoot))
	.filter((fileName) => /\.ya?ml$/i.test(fileName))
	.sort();
const errors = [];

for (const fileName of workflowFiles) {
	const relativePath = path.join('.github', 'workflows', fileName);
	const source = await readFile(path.join(workflowsRoot, fileName), 'utf8');

	for (const [index, line] of source.split(/\r?\n/).entries()) {
		const action = line.match(/^\s*-?\s*uses:\s*([^\s#]+)/)?.[1];
		if (!action || action.startsWith('./') || action.startsWith('docker://')) continue;

		if (!/^[^@]+@[0-9a-f]{40}$/i.test(action)) {
			errors.push(`${relativePath}:${index + 1}: external action must use a full commit SHA`);
		}
	}
}

if (errors.length) {
	console.error(errors.map((error) => `- ${error}`).join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Validated full-SHA pins in ${workflowFiles.length} workflow files.`);
}
