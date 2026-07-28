import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const canonicalRoot = path.join(projectRoot, '.agents', 'skills');
const wrapperRoot = path.join(projectRoot, '.claude', 'skills');
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseFrontmatter(filePath, source) {
	const normalized = source.replaceAll('\r\n', '\n');
	const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);

	if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);

	const fields = new Map();
	for (const line of match[1].split('\n')) {
		if (!line.trim()) continue;

		const field = line.match(/^([a-z0-9-]+):\s*(.+)$/i);
		if (!field) throw new Error(`${filePath}: unsupported frontmatter line: ${line}`);
		if (fields.has(field[1])) throw new Error(`${filePath}: duplicate ${field[1]} field`);

		fields.set(field[1], field[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2').trim());
	}

	if (!fields.get('name')) throw new Error(`${filePath}: missing name`);
	if (!fields.get('description')) throw new Error(`${filePath}: missing description`);
	if (!normalized.slice(match[0].length).trim())
		throw new Error(`${filePath}: missing instructions`);

	return fields;
}

async function skillNames(root) {
	return (await readdir(root, { withFileTypes: true }))
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
}

const canonicalNames = await skillNames(canonicalRoot);
const wrapperNames = await skillNames(wrapperRoot);
const errors = [];

for (const name of canonicalNames) {
	const relativePath = path.join('.agents', 'skills', name, 'SKILL.md');
	const filePath = path.join(projectRoot, relativePath);

	try {
		const fields = parseFrontmatter(relativePath, await readFile(filePath, 'utf8'));
		if (!namePattern.test(name)) errors.push(`${relativePath}: invalid skill directory name`);
		if (fields.get('name') !== name) {
			errors.push(`${relativePath}: name must match its directory (${name})`);
		}
		for (const field of fields.keys()) {
			if (field !== 'name' && field !== 'description') {
				errors.push(`${relativePath}: canonical skills may not use frontmatter field ${field}`);
			}
		}
	} catch (error) {
		errors.push(error.message);
	}

	const wrapperRelativePath = path.join('.claude', 'skills', name, 'SKILL.md');
	const wrapperPath = path.join(projectRoot, wrapperRelativePath);
	try {
		await access(wrapperPath);
		const wrapperSource = await readFile(wrapperPath, 'utf8');
		const fields = parseFrontmatter(wrapperRelativePath, wrapperSource);
		if (fields.get('name') !== name) {
			errors.push(`${wrapperRelativePath}: name must match the canonical skill (${name})`);
		}
		const canonicalLink = `../../../.agents/skills/${name}/SKILL.md`;
		if (!wrapperSource.includes(canonicalLink)) {
			errors.push(`${wrapperRelativePath}: missing link to ${canonicalLink}`);
		}
	} catch (error) {
		errors.push(
			error.code === 'ENOENT' ? `${wrapperRelativePath}: missing wrapper` : error.message
		);
	}
}

for (const name of wrapperNames) {
	if (!canonicalNames.includes(name)) {
		errors.push(path.join('.claude', 'skills', name) + ': wrapper has no canonical skill');
	}
}

if (errors.length) {
	console.error(errors.map((error) => `- ${error}`).join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Validated ${canonicalNames.length} canonical skills and compatibility wrappers.`);
}
