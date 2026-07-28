import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4176';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'list',
	use: {
		baseURL,
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'pnpm preview --host 127.0.0.1 --port 4176 --strictPort',
		url: baseURL,
		reuseExistingServer: false,
		timeout: 30_000
	},
	projects: [
		{ name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
		{ name: 'webkit-mobile', use: { ...devices['iPhone 13'] } }
	]
});
