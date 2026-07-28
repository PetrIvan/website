import { expect, test } from '@playwright/test';

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

for (const route of routes) {
	test(`${route} renders without browser errors or horizontal overflow`, async ({ page }) => {
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
	});
}

test('blog articles include their prerendered body', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	await expect(page.locator('.article-prose')).toContainText(
		'A token is primarily a unit of global computation'
	);
});

test('footnote previews follow keyboard focus', async ({ page }) => {
	await page.goto('/blog/token-boundaries/');

	const reference = page.locator('a.footnote-ref').first();
	const preview = page.locator('.footnote-preview').first();
	await reference.focus();

	await expect(preview).toBeVisible();

	await page.getByRole('link', { name: 'All posts' }).focus();

	await expect(preview).toBeHidden();
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
