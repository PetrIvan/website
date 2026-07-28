import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { profilePortraitBlobPath } from '../src/lib/components/profile/profilePortraitShape.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portraitPath = path.join(projectRoot, 'src/lib/assets/images/petr-ivan-portrait.jpg');
const fontDirectory = path.join(projectRoot, 'src/lib/assets/fonts');
const mediumFontPath = path.join(fontDirectory, 'Figtree-Medium.ttf');
const layoutCssPath = path.join(projectRoot, 'src/routes/layout.css');
const outputPath = path.join(projectRoot, 'static/social-card.png');
const publicPortraitPath = path.join(projectRoot, 'static/petr-ivan-portrait.jpg');

const [portrait, layoutCss] = await Promise.all([
	readFile(portraitPath),
	readFile(layoutCssPath, 'utf8')
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
	accent: readColorToken('accent')
};

const svg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      text {
        font-family: Figtree;
      }
    </style>
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

  <image
    href="${portraitDataUri}"
    x="838"
    y="148"
    width="300"
    height="300"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#portrait-clip)"
  />

  <rect x="76" y="92" width="34" height="4" rx="2" fill="${palette.accent}" />
  <text x="124" y="101" fill="${palette.accent}" font-size="21" font-weight="500">Petr Ivan · Machine Learning Engineer</text>

  <text x="76" y="218" fill="${palette.foreground}" font-size="54" font-weight="500" letter-spacing="-1.9">
    <tspan x="76" dy="0">I build machine learning</tspan>
    <tspan x="76" dy="64">systems and the products</tspan>
    <tspan x="76" dy="64">around them.</tspan>
  </text>

  <text x="76" y="548" fill="${palette.muted}" font-size="24" font-weight="500">petrivan.com</text>
</svg>`;

const renderer = new Resvg(svg, {
	font: {
		fontFiles: [mediumFontPath],
		loadSystemFonts: false,
		defaultFontFamily: 'Figtree'
	},
	textRendering: 2,
	imageRendering: 0
});
const png = renderer.render().asPng();

await Promise.all([writeFile(outputPath, png), writeFile(publicPortraitPath, portrait)]);
console.log(
	`Generated ${path.relative(projectRoot, outputPath)} (${png.length} bytes) and ${path.relative(projectRoot, publicPortraitPath)}`
);
