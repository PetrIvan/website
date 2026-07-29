import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const routes = [
	'/',
	'/about/',
	'/projects/',
	'/projects/ai-cup-2026/',
	'/projects/chordseqai/',
	'/projects/entitatis-mundus/',
	'/blog/',
	'/blog/token-boundaries/'
] as const;

async function clickHeaderLink(page: Page, isMobile: boolean, name: string) {
	if (name === 'Petr Ivan') {
		await page.getByRole('banner').getByRole('link', { name, exact: true }).click();
		return;
	}

	if (isMobile) {
		await page.getByRole('button', { name: 'Open navigation menu' }).click();
		await page.getByRole('dialog').getByRole('link', { name, exact: true }).click();
		return;
	}

	await page
		.getByRole('navigation', { name: 'Primary navigation' })
		.getByRole('link', { name, exact: true })
		.click();
}

for (const route of routes) {
	test(`${route} renders without browser errors or horizontal overflow`, async ({
		page
	}, testInfo) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push(message.text());
		});
		page.on('pageerror', (error) => errors.push(error.message));

		const response = await page.goto(route);

		expect(response?.ok()).toBe(true);
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('h1')).toHaveCount(1);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
			)
		).toBe(true);
		expect(errors).toEqual([]);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`https://petrivan.com${route}`
		);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
		await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			'content',
			/^https:\/\/petrivan\.com\/.+\.png$/
		);
		await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /\S/);
		await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
		await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
			'content',
			'@petrivanml'
		);
		await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
			'href',
			'https://petrivan.com/feed.xml'
		);

		if (testInfo.project.name === 'chromium-desktop') {
			const accessibilityScan = await new AxeBuilder({ page }).analyze();
			expect(accessibilityScan.violations).toEqual([]);
		}
	});
}

test('blog articles include their prerendered body', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	await expect(page.locator('.article-prose')).toContainText(
		'A token is primarily a unit of global computation'
	);
});

test('profile links follow the intended exposure order', async ({ page }) => {
	await page.goto('/');

	const profileNavigation = page.getByRole('navigation', { name: 'Contact and profile links' });
	const footerNavigation = page.getByRole('navigation', { name: 'Contact and social links' });

	expect(
		await profileNavigation
			.locator('a')
			.evaluateAll((links) => links.slice(1).map((link) => link.getAttribute('href')))
	).toEqual([
		'mailto:hi@petrivan.com',
		'https://github.com/PetrIvan',
		'https://x.com/petrivanml',
		'https://www.linkedin.com/in/petr-ivan'
	]);
	expect(
		await footerNavigation
			.locator('a')
			.evaluateAll((links) => links.slice(1).map((link) => link.getAttribute('href')))
	).toEqual([
		'mailto:hi@petrivan.com',
		'https://github.com/PetrIvan',
		'https://x.com/petrivanml',
		'https://www.linkedin.com/in/petr-ivan'
	]);
	await expect(
		profileNavigation.getByRole('link', {
			name: 'X (opens in a new tab)'
		})
	).toHaveAttribute('href', 'https://x.com/petrivanml');
	await expect(
		footerNavigation.getByRole('link', {
			name: 'X (opens in a new tab)'
		})
	).toHaveAttribute('href', 'https://x.com/petrivanml');
});

test('blog articles expose BlogPosting structured data', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	const structuredData = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')));
	const article = structuredData.find((entry) => entry['@type'] === 'BlogPosting');

	expect(article).toMatchObject({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: 'What Should Count as a Transformer Token?',
		datePublished: '2026-07-27',
		url: 'https://petrivan.com/blog/token-boundaries/',
		image: 'https://petrivan.com/social/blog/token-boundaries.png'
	});
});

test('blog articles expose article-specific social metadata', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
		'content',
		'What Should Count as a Transformer Token?'
	);
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		'Finer tokens spend more compute on the global sequence. Larger tokens move more work into local encoding.'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://petrivan.com/social/blog/token-boundaries.png'
	);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
		'content',
		'https://petrivan.com/social/blog/token-boundaries.png'
	);
});

test('project pages expose their existing visuals as social images', async ({ page }) => {
	const projectCards = [
		{
			path: '/projects/chordseqai/',
			title: 'ChordSeqAI',
			image: 'https://petrivan.com/social/projects/chordseqai.png',
			type: 'image/png',
			width: '1200',
			height: '630'
		},
		{
			path: '/projects/ai-cup-2026/',
			title: 'AI Cup 2026',
			image: 'https://petrivan.com/social/projects/ai-cup-2026.png',
			type: 'image/png',
			width: '1919',
			height: '1079'
		},
		{
			path: '/projects/entitatis-mundus/',
			title: 'Entitatis Mundus',
			image: 'https://petrivan.com/social/projects/entitatis-mundus.png',
			type: 'image/png',
			width: '1200',
			height: '630'
		}
	] as const;

	for (const project of projectCards) {
		await page.goto(project.path);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			'content',
			project.title
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			'content',
			project.image
		);
		await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
			'content',
			project.image
		);
		await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
			'content',
			project.type
		);
		await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
			'content',
			project.width
		);
		await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
			'content',
			project.height
		);
	}
});

test('primary navigation works after opening a blog article from the home page', async ({
	page,
	isMobile
}) => {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));

	await page.goto('/');
	await page.getByRole('link', { name: /What Should Count as a Transformer Token/ }).click();
	await expect(page).toHaveURL('/blog/token-boundaries/');

	await clickHeaderLink(page, isMobile, 'Projects');

	await expect(page).toHaveURL('/projects/');
	await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
	expect(errors).toEqual([]);
});

test('primary navigation works across every route type', async ({ page, isMobile }, testInfo) => {
	test.skip(testInfo.project.name !== 'chromium-desktop', 'Covered once in Chromium');
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	const transitions = [
		{
			from: '/projects/',
			link: 'Blog',
			to: '/blog/',
			heading: 'Blog'
		},
		{
			from: '/projects/ai-cup-2026/',
			link: 'About',
			to: '/about/',
			heading: 'About'
		},
		{
			from: '/blog/',
			link: 'Projects',
			to: '/projects/',
			heading: 'Projects'
		},
		{
			from: '/about/',
			link: 'Petr Ivan',
			to: '/',
			heading: 'I build machine learning systems and the products around them.'
		}
	] as const;

	for (const transition of transitions) {
		await page.goto(transition.from);
		await clickHeaderLink(page, isMobile, transition.link);
		await expect(page).toHaveURL(transition.to);
		await expect(page.getByRole('heading', { level: 1, name: transition.heading })).toBeVisible();
	}

	expect(errors).toEqual([]);
});

test('client navigation recovers when a deployment replaced a route asset', async ({
	page,
	isMobile
}) => {
	let blockedRouteAsset = false;
	const documentRequests: string[] = [];
	page.on('request', (request) => {
		if (request.resourceType() === 'document') {
			documentRequests.push(new URL(request.url()).pathname);
		}
	});

	await page.goto('/');
	await page.getByRole('link', { name: /What Should Count as a Transformer Token/ }).click();
	await expect(page).toHaveURL('/blog/token-boundaries/');
	await page.route(/\/_app\/immutable\/nodes\/\d+\.[^/]+\.js$/, async (route) => {
		if (blockedRouteAsset) {
			await route.continue();
			return;
		}

		blockedRouteAsset = true;
		await route.abort('failed');
	});

	await clickHeaderLink(page, isMobile, 'Projects');

	await expect(page).toHaveURL('/projects/');
	await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
	await page.waitForLoadState('load');
	expect(blockedRouteAsset).toBe(true);
	expect(documentRequests).toEqual(['/', '/projects/']);
	await expect
		.poll(() => page.evaluate(() => sessionStorage.getItem('petrivan:deployment-asset-recovery')))
		.toBeNull();
});

test('footnote previews follow keyboard focus', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	const reference = page.locator('a.footnote-ref, a[data-footnote-ref]').first();
	const preview = page.locator('.footnote-preview').first();
	await reference.focus();

	await expect(preview).toBeVisible();

	await page.getByRole('link', { name: 'All posts' }).focus();

	await expect(preview).toBeHidden();
});

test('sitemap contains every public route', async ({ request }, testInfo) => {
	test.skip(testInfo.project.name !== 'chromium-desktop', 'Covered once in Chromium');
	const response = await request.get('/sitemap.xml');
	expect(response.ok()).toBe(true);
	const sitemap = await response.text();

	for (const route of routes) {
		expect(sitemap).toContain(`<loc>https://petrivan.com${route}</loc>`);
	}
});

test('RSS feed advertises every blog post', async ({ request }, testInfo) => {
	test.skip(testInfo.project.name !== 'chromium-desktop', 'Covered once in Chromium');
	const response = await request.get('/feed.xml');
	expect(response.ok()).toBe(true);
	expect(response.headers()['content-type']).toMatch(/\b(?:application\/rss\+xml|text\/xml)\b/);
	const feed = await response.text();

	expect(feed).toContain('<atom:link href="https://petrivan.com/feed.xml"');
	expect(feed).toContain('<link>https://petrivan.com/blog/token-boundaries/</link>');
	expect(feed).toContain('<title>What Should Count as a Transformer Token?</title>');
});

test('internal links resolve', async ({ page, request }, testInfo) => {
	test.skip(testInfo.project.name !== 'chromium-desktop', 'Covered once in Chromium');
	const paths = new Set<string>();

	for (const route of routes) {
		await page.goto(route);
		const routePaths = await page.locator('a[href]').evaluateAll((links) =>
			links.flatMap((link) => {
				const url = new URL((link as HTMLAnchorElement).href);
				return url.origin === location.origin ? [url.pathname] : [];
			})
		);
		for (const path of routePaths) paths.add(path);
	}

	for (const path of paths) {
		const response = await request.get(path);
		expect(response.ok(), `${path} should resolve`).toBe(true);
	}
});

test('the theme toggle updates the document theme', async ({ page }) => {
	await page.goto('/');
	const toggle = page.getByRole('button', { name: /Switch to (light|dark) theme/ });
	const initialTheme = await page.locator('html').getAttribute('data-theme');

	await toggle.click();

	await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme ?? '');
});

test('the theme toggle matches a stored dark theme before hydration', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
	await page.route(/\/_app\/.*\.js(?:\?.*)?$/, (route) => route.abort());

	await page.goto('/');

	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});

test('analytics does not load outside the production hostname', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('script[data-cloudflare-web-analytics-bootstrap]')).toHaveCount(1);
	await expect(page.locator('script[src][data-cf-beacon]')).toHaveCount(0);
});

test('configured analytics loads only on the production hostname', async ({ page }) => {
	test.skip(
		!process.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN,
		'Requires a configured deployment build'
	);

	const builtPage = await readFile('build/index.html', 'utf8');
	let beaconRequested = false;

	await page.route('**/*', async (route) => {
		const url = new URL(route.request().url());

		if (url.hostname === 'petrivan.com' && url.pathname === '/') {
			await route.fulfill({ body: builtPage, contentType: 'text/html' });
		} else if (url.href === 'https://static.cloudflareinsights.com/beacon.min.js') {
			beaconRequested = true;
			await route.fulfill({ body: '', contentType: 'text/javascript' });
		} else {
			await route.abort();
		}
	});

	await page.goto('https://petrivan.com/');

	const beacon = page.locator(
		'script[src="https://static.cloudflareinsights.com/beacon.min.js"][data-cf-beacon]'
	);
	await expect(beacon).toHaveAttribute('type', 'module');
	expect(JSON.parse((await beacon.getAttribute('data-cf-beacon')) ?? '{}')).toEqual({
		token: process.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
	});
	expect(beaconRequested).toBe(true);
});

test('the mobile navigation traps and restores focus', async ({ page, isMobile }) => {
	test.skip(!isMobile, 'Mobile-only navigation behavior');
	await page.goto('/');

	const openButton = page.getByRole('button', { name: 'Open navigation menu' });
	await openButton.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole('button', { name: 'Close navigation menu' })).toBeFocused();

	await page.keyboard.press('Escape');

	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(openButton).toBeFocused();
});
