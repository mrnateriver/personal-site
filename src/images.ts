import * as fs from 'fs/promises';

import type { Color } from './colors';

/**
 * Parses a BMP image file and returns the pixel colors.
 *
 * The image must be a bottom-up 24-bit BMP file.
 *
 * @param imagePath Path to the image file.
 * @returns {Color[][]} Rows and columns of pixel colors.
 */
export async function readBmpImage(imagePath: string): Promise<Color[][]> {
  const data = await fs.readFile(imagePath);

  const pixelDataOffset = data.readUInt32LE(10);
  const width = data.readUInt32LE(18);
  const height = data.readUInt32LE(22);

  const rowSize = Math.floor((width * 3 + 3) / 4) * 4;

  const result = new Array(height) as Color[][];

  // Iterate over pixel data
  for (let y = 0; y < height; y++) {
    const row = new Array(width) as Color[];
    for (let x = 0; x < width; x++) {
      const index = pixelDataOffset + y * rowSize + x * 3;

      const blue = data[index];
      const green = data[index + 1];
      const red = data[index + 2];

      row[x] = ((red << 24) | (green << 16) | (blue << 8) | 0xff) >>> 0;
    }
    result[height - y - 1] = row;
  }

  return result;
}
