const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegStartOfFrameMarkers = new Set([
	0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf
]);

function readPngMetadata(buffer, fileName) {
	if (buffer.length < 24 || !buffer.subarray(0, pngSignature.length).equals(pngSignature)) {
		return undefined;
	}
	if (buffer.toString('ascii', 12, 16) !== 'IHDR') {
		throw new Error(`Invalid PNG in ${fileName}: IHDR must be the first chunk`);
	}

	return {
		mimeType: 'image/png',
		width: buffer.readUInt32BE(16),
		height: buffer.readUInt32BE(20)
	};
}

function readJpegMetadata(buffer, fileName) {
	if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return undefined;

	let offset = 2;
	while (offset < buffer.length) {
		while (offset < buffer.length && buffer[offset] === 0xff) offset += 1;
		if (offset >= buffer.length) break;

		const marker = buffer[offset];
		offset += 1;
		if (
			marker === 0xd8 ||
			marker === 0xd9 ||
			marker === 0x01 ||
			(marker >= 0xd0 && marker <= 0xd7)
		) {
			continue;
		}
		if (offset + 2 > buffer.length) break;

		const segmentLength = buffer.readUInt16BE(offset);
		if (segmentLength < 2 || offset + segmentLength > buffer.length) {
			throw new Error(`Invalid JPEG segment in ${fileName}`);
		}
		if (jpegStartOfFrameMarkers.has(marker)) {
			if (segmentLength < 7) throw new Error(`Invalid JPEG frame in ${fileName}`);
			return {
				mimeType: 'image/jpeg',
				width: buffer.readUInt16BE(offset + 5),
				height: buffer.readUInt16BE(offset + 3)
			};
		}

		offset += segmentLength;
	}

	throw new Error(`Could not find JPEG dimensions in ${fileName}`);
}

export function readRasterMetadata(buffer, fileName) {
	const metadata = readPngMetadata(buffer, fileName) ?? readJpegMetadata(buffer, fileName);
	if (!metadata) throw new Error(`Unsupported raster image format in ${fileName}`);
	if (metadata.width < 1 || metadata.height < 1) {
		throw new Error(`Invalid raster dimensions in ${fileName}`);
	}
	return metadata;
}
