import { expect, test } from '@playwright/test';

const routes = [
	{ name: 'home', path: '/' },
	{ name: 'project', path: '/projects/ai-cup-2026/' },
	{ name: 'article', path: '/blog/token-boundaries/' }
] as const;

for (const route of routes) {
	test(`${route.name} visual review`, async ({ page }, testInfo) => {
		const response = await page.goto(route.path, { waitUntil: 'networkidle' });
		expect(response?.ok()).toBe(true);
		await expect(page.locator('main')).toBeVisible();

		await page.evaluate(async () => {
			const wait = (duration: number) =>
				new Promise<void>((resolve) => window.setTimeout(resolve, duration));

			for (
				let position = 0;
				position < document.body.scrollHeight;
				position += window.innerHeight
			) {
				window.scrollTo(0, position);
				await wait(50);
			}

			await document.fonts.ready;
			await Promise.all(
				Array.from(document.images, (image) => {
					if (image.complete) return Promise.resolve();
					return new Promise<void>((resolve) => {
						image.addEventListener('load', () => resolve(), { once: true });
						image.addEventListener('error', () => resolve(), { once: true });
					});
				})
			);
			window.scrollTo(0, 0);
		});

		await page.screenshot({
			animations: 'disabled',
			fullPage: true,
			path: testInfo.outputPath(`${route.name}.png`)
		});
	});
}
