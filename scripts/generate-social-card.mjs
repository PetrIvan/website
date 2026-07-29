import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { profilePortraitBlobPath } from '../src/lib/components/profile/profilePortraitShape.js';
import { projectSocialImages } from '../src/lib/content/projects/socialImages.js';
import { readRasterMetadata } from './raster-metadata.mjs';
import { parseArticleCard } from './social-card-metadata.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portraitPath = path.join(projectRoot, 'src/lib/assets/images/petr-ivan-portrait.jpg');
const blogDirectory = path.join(projectRoot, 'src/lib/content/blog');
const projectImageDirectory = path.join(projectRoot, 'src/lib/assets/images/projects');
const fontDirectory = path.join(projectRoot, 'src/lib/assets/fonts');
const mediumFontPath = path.join(fontDirectory, 'Figtree-Medium.ttf');
const layoutCssPath = path.join(projectRoot, 'src/routes/layout.css');
const outputPath = path.join(projectRoot, 'static/social-card.png');
const blogOutputDirectory = path.join(projectRoot, 'static/social/blog');
const projectOutputDirectory = path.join(projectRoot, 'static/social/projects');
const publicPortraitPath = path.join(projectRoot, 'static/petr-ivan-portrait.jpg');

const [portrait, layoutCss, blogFileNames, projectCardImages] = await Promise.all([
	readFile(portraitPath),
	readFile(layoutCssPath, 'utf8'),
	readdir(blogDirectory),
	Promise.all(
		Object.entries(projectSocialImages).map(async ([slug, project]) => {
			const image = await readFile(path.join(projectImageDirectory, project.sourceFile));
			return {
				slug,
				...project,
				image,
				sourceMetadata: readRasterMetadata(image, project.sourceFile)
			};
		})
	)
]);
const portraitDataUri = `data:image/jpeg;base64,${portrait.toString('base64')}`;

const lightTheme = layoutCss.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
if (!lightTheme) throw new Error('Could not find the light theme tokens in src/routes/layout.css');

const readColorToken = (name) => {
	const value = lightTheme.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
	if (!value) throw new Error(`Could not find --${name} in the light theme tokens`);
	return value;
};

const palette = {
	background: readColorToken('background'),
	foreground: readColorToken('foreground'),
	muted: readColorToken('muted'),
	accent: readColorToken('accent'),
	surface: readColorToken('surface'),
	border: readColorToken('border')
};

const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const readArticleCard = async (fileName) => {
	const sourcePath = path.join(blogDirectory, fileName);
	const source = await readFile(sourcePath, 'utf8');
	return parseArticleCard(source, sourcePath);
};

const wrapText = (value, maximumCharacters) => {
	const lines = [];
	let currentLine = '';

	for (const word of value.split(/\s+/)) {
		const candidate = currentLine ? `${currentLine} ${word}` : word;
		if (candidate.length <= maximumCharacters || !currentLine) {
			currentLine = candidate;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	if (currentLine) lines.push(currentLine);
	return lines;
};

const renderTextLines = ({ lines, x, y, lineHeight, ...attributes }) => {
	const serializedAttributes = Object.entries(attributes)
		.map(([name, value]) => `${name}="${value}"`)
		.join(' ');
	return `<text x="${x}" y="${y}" ${serializedAttributes}>${lines
		.map(
			(line, index) =>
				`<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
		)
		.join('')}</text>`;
};

const tokenBoundaryDiagram = String.raw`
  <g transform="translate(734 145)">
    <text x="0" y="0" fill="${palette.foreground}" font-size="22" font-weight="500">Finer tokens</text>
    ${Array.from(
			{ length: 12 },
			(_, index) =>
				`<rect x="${index * 30}" y="27" width="21" height="34" rx="6" fill="${palette.accent}" opacity="${0.74 + (index % 3) * 0.1}" />`
		).join('')}
    <text x="0" y="94" fill="${palette.muted}" font-size="20" font-weight="500">more global positions</text>

    <path d="M0 142 H360" stroke="${palette.border}" stroke-width="2" />

    <text x="0" y="190" fill="${palette.foreground}" font-size="22" font-weight="500">Larger tokens</text>
    ${Array.from(
			{ length: 4 },
			(_, groupIndex) => String.raw`
      <g transform="translate(${groupIndex * 91} 217)">
        <rect width="72" height="44" rx="8" fill="${palette.surface}" stroke="${palette.accent}" stroke-width="2" />
        <path d="M24 1 V43 M48 1 V43" stroke="${palette.accent}" stroke-width="1.5" opacity="0.55" />
        <path d="M36 55 V76" stroke="${palette.muted}" stroke-width="2" stroke-linecap="round" />
        <path d="M30 70 L36 77 L42 70" fill="none" stroke="${palette.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="13" y="88" width="46" height="44" rx="9" fill="${palette.accent}" />
      </g>`
		).join('')}
    <text x="0" y="386" fill="${palette.muted}" font-size="20" font-weight="500">more local compression</text>
  </g>`;

const fallbackArticleDiagram = String.raw`
  <g transform="translate(785 150)" fill="none" stroke="${palette.accent}" stroke-width="2">
    ${Array.from({ length: 4 }, (_, row) =>
			Array.from(
				{ length: 4 },
				(_, column) =>
					`<rect x="${column * 72 + row * 9}" y="${row * 72}" width="54" height="54" rx="13" opacity="${0.28 + (row + column) * 0.09}" />`
			).join('')
		).join('')}
  </g>`;

const renderSvg = (svg, label) => {
	const renderer = new Resvg(svg, {
		font: {
			fontFiles: [mediumFontPath],
			loadSystemFonts: false,
			defaultFontFamily: 'Figtree'
		},
		textRendering: 2,
		imageRendering: 0
	});
	const rendered = renderer.render();
	const pixels = rendered.pixels;
	for (let index = 3; index < pixels.length; index += 4) {
		if (pixels[index] !== 255) {
			throw new Error(`${label} contains transparent or translucent pixels`);
		}
	}
	return rendered.asPng();
};

const renderContainedProjectCard = (project) => {
	if (!project.fit) return project.image;

	const sourceAspectRatio = project.sourceMetadata.width / project.sourceMetadata.height;
	const targetAspectRatio = project.width / project.height;
	const imageDataUri = `data:${project.sourceMetadata.mimeType};base64,${project.image.toString('base64')}`;
	let edgeRects;

	if (sourceAspectRatio > targetAspectRatio) {
		const imageHeight = project.width / sourceAspectRatio;
		const barHeight = (project.height - imageHeight) / 2;
		edgeRects = String.raw`
  <rect width="${project.width}" height="${barHeight}" fill="${project.fit.startColor}" />
  <rect y="${project.height - barHeight}" width="${project.width}" height="${barHeight}" fill="${project.fit.endColor}" />`;
	} else {
		const imageWidth = project.height * sourceAspectRatio;
		const barWidth = (project.width - imageWidth) / 2;
		edgeRects = String.raw`
  <rect width="${barWidth}" height="${project.height}" fill="${project.fit.startColor}" />
  <rect x="${project.width - barWidth}" width="${barWidth}" height="${project.height}" fill="${project.fit.endColor}" />`;
	}

	return renderSvg(
		String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="${project.width}" height="${project.height}" viewBox="0 0 ${project.width} ${project.height}">
  <rect width="${project.width}" height="${project.height}" fill="${project.fit.startColor}" />
  ${edgeRects}
  <image href="${imageDataUri}" width="${project.width}" height="${project.height}" preserveAspectRatio="xMidYMid meet" />
</svg>`,
		project.slug
	);
};

const validateProjectCardConfiguration = (project) => {
	const expectedMimeType = project.fit ? 'image/png' : project.sourceMetadata.mimeType;
	const expectedWidth = project.fit ? project.width : project.sourceMetadata.width;
	const expectedHeight = project.fit ? project.height : project.sourceMetadata.height;
	const expectedExtension = expectedMimeType === 'image/jpeg' ? '.jpg' : '.png';

	if (project.mimeType !== expectedMimeType) {
		throw new Error(
			`${project.slug} declares ${project.mimeType}, but its generated card is ${expectedMimeType}`
		);
	}
	if (project.width !== expectedWidth || project.height !== expectedHeight) {
		throw new Error(
			`${project.slug} declares ${project.width}x${project.height}, but its source is ${project.sourceMetadata.width}x${project.sourceMetadata.height}`
		);
	}
	if (path.extname(project.publicPath).toLowerCase() !== expectedExtension) {
		throw new Error(`${project.slug} must use the ${expectedExtension} extension`);
	}
};

const removeStaleGeneratedFiles = async (directory, expectedFileNames) => {
	await mkdir(directory, { recursive: true });
	const entries = await readdir(directory, { withFileTypes: true });
	const unexpectedDirectory = entries.find((entry) => !entry.isFile());
	if (unexpectedDirectory) {
		throw new Error(
			`Unexpected directory in generated social cards: ${path.join(directory, unexpectedDirectory.name)}`
		);
	}
	await Promise.all(
		entries
			.filter((entry) => !expectedFileNames.has(entry.name))
			.map((entry) => unlink(path.join(directory, entry.name)))
	);
};

const siteCardSvg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>text { font-family: Figtree; }</style>
    <clipPath id="portrait-clip" clipPathUnits="userSpaceOnUse">
      <path d="${profilePortraitBlobPath}" transform="translate(847 157) scale(2.82)" />
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="${palette.background}" />

  <g fill="none" stroke="${palette.accent}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${profilePortraitBlobPath}" transform="translate(798 108) scale(3.8)" stroke-width="1.184" opacity="0.2" />
    <path d="${profilePortraitBlobPath}" transform="translate(817 127) scale(3.42)" stroke-width="1.023" opacity="0.4" />
    <path d="${profilePortraitBlobPath}" transform="translate(832 142) scale(3.12)" stroke-width="0.801" opacity="0.7" />
  </g>

  <image href="${portraitDataUri}" x="838" y="148" width="300" height="300" preserveAspectRatio="xMidYMid slice" clip-path="url(#portrait-clip)" />

  <rect x="76" y="92" width="34" height="4" rx="2" fill="${palette.accent}" />
  <text x="124" y="101" fill="${palette.accent}" font-size="21" font-weight="500">Petr Ivan &#183; Machine Learning Engineer</text>

  <text x="76" y="218" fill="${palette.foreground}" font-size="54" font-weight="500" letter-spacing="-1.9">
    <tspan x="76" dy="0">I build machine learning</tspan>
    <tspan x="76" dy="64">systems and the products</tspan>
    <tspan x="76" dy="64">around them.</tspan>
  </text>

  <text x="76" y="548" fill="${palette.muted}" font-size="24" font-weight="500">petrivan.com</text>
</svg>`;

const articleCardSvg = ({ slug, title, description }) => {
	const titleLines = wrapText(title, 25);
	const descriptionLines = wrapText(description, 47);
	if (titleLines.length > 3) {
		throw new Error(`Social card title is too long for ${slug}; keep it to three lines`);
	}
	if (descriptionLines.length > 3) {
		throw new Error(
			`Social card description is too long for ${slug}; add a shorter socialDescription`
		);
	}
	const diagram = slug === 'token-boundaries' ? tokenBoundaryDiagram : fallbackArticleDiagram;

	return String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>text { font-family: Figtree; }</style>
  <rect width="1200" height="630" fill="${palette.background}" />

  <rect x="76" y="92" width="34" height="4" rx="2" fill="${palette.accent}" />
  <text x="124" y="101" fill="${palette.accent}" font-size="21" font-weight="500">Petr Ivan &#183; Notes</text>

  ${renderTextLines({
		lines: titleLines,
		x: 76,
		y: 190,
		lineHeight: 62,
		fill: palette.foreground,
		'font-size': 52,
		'font-weight': 500,
		'letter-spacing': -1.6
	})}

  ${renderTextLines({
		lines: descriptionLines,
		x: 76,
		y: 352,
		lineHeight: 34,
		fill: palette.muted,
		'font-size': 25,
		'font-weight': 500
	})}

  ${diagram}

  <text x="76" y="548" fill="${palette.muted}" font-size="24" font-weight="500">petrivan.com</text>
</svg>`;
};

const articleCards = await Promise.all(
	blogFileNames.filter((fileName) => fileName.endsWith('.svx')).map(readArticleCard)
);
const siteCard = renderSvg(siteCardSvg, 'site social card');
const renderedArticleCards = articleCards.map((article) => ({
	...article,
	png: renderSvg(articleCardSvg(article), article.slug)
}));
const renderedProjectCards = projectCardImages.map((project) => {
	validateProjectCardConfiguration(project);
	return {
		...project,
		outputPath: path.join(projectRoot, 'static', project.publicPath),
		output: renderContainedProjectCard(project)
	};
});

await Promise.all([
	removeStaleGeneratedFiles(
		blogOutputDirectory,
		new Set(renderedArticleCards.map(({ slug }) => `${slug}.png`))
	),
	removeStaleGeneratedFiles(
		projectOutputDirectory,
		new Set(
			renderedProjectCards.map(({ outputPath: projectOutputPath }) =>
				path.basename(projectOutputPath)
			)
		)
	)
]);
await Promise.all([
	writeFile(outputPath, siteCard),
	writeFile(publicPortraitPath, portrait),
	...renderedArticleCards.map(({ slug, png }) =>
		writeFile(path.join(blogOutputDirectory, `${slug}.png`), png)
	),
	...renderedProjectCards.map(({ outputPath: projectOutputPath, output }) =>
		writeFile(projectOutputPath, output)
	)
]);

console.log(
	`Generated ${path.relative(projectRoot, outputPath)}, ${renderedArticleCards.length} article card${renderedArticleCards.length === 1 ? '' : 's'}, ${renderedProjectCards.length} project cards, and ${path.relative(projectRoot, publicPortraitPath)}`
);
