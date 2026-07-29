import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { readRasterMetadata } from './raster-metadata.mjs';

describe('readRasterMetadata', () => {
	it.each([
		['src/lib/assets/images/projects/chordseqai-editor.jpg', 'image/jpeg', 1920, 914],
		['src/lib/assets/images/projects/ai-cup-dashboard.png', 'image/png', 1919, 1079],
		['src/lib/assets/images/projects/entitatis-mundus-gameplay.png', 'image/png', 1920, 1080]
	])('reads %s from the source bytes', async (fileName, mimeType, width, height) => {
		const buffer = await readFile(fileName);
		expect(readRasterMetadata(buffer, fileName)).toEqual({ mimeType, width, height });
	});

	it('rejects unsupported image data', () => {
		expect(() => readRasterMetadata(Buffer.from('not an image'), 'invalid.bin')).toThrow(
			/Unsupported raster image format/
		);
	});
});
