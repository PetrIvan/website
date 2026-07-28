import { defineConfig, devices } from '@playwright/test';
import { sharedConfig } from './playwright.config';

export default defineConfig({
	...sharedConfig,
	testDir: './tests/visual',
	outputDir: 'test-results/visual-review',
	retries: 0,
	projects: [
		{
			name: 'desktop-light',
			use: { ...devices['Desktop Chrome'], colorScheme: 'light' }
		},
		{
			name: 'desktop-dark',
			use: { ...devices['Desktop Chrome'], colorScheme: 'dark' }
		},
		{
			name: 'mobile-light',
			use: { ...devices['Pixel 7'], colorScheme: 'light' }
		},
		{
			name: 'mobile-dark',
			use: { ...devices['Pixel 7'], colorScheme: 'dark' }
		}
	]
});
