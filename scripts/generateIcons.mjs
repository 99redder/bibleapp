import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Primary color from the app (#4f46e5 - indigo-600)
const primaryColor = '#4f46e5';
const white = '#ffffff';

// Create SVG icon - Bible/book with cross
function createIconSVG(size) {
  const padding = Math.round(size * 0.1);
  const iconSize = size - padding * 2;
  const cornerRadius = Math.round(size * 0.18);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${primaryColor}"/>

  <!-- Book shape -->
  <g transform="translate(${padding}, ${padding})">
    <!-- Book cover -->
    <rect x="${iconSize * 0.15}" y="${iconSize * 0.1}"
          width="${iconSize * 0.7}" height="${iconSize * 0.8}"
          rx="${iconSize * 0.05}"
          fill="${white}"
          opacity="0.95"/>

    <!-- Book spine shadow -->
    <rect x="${iconSize * 0.15}" y="${iconSize * 0.1}"
          width="${iconSize * 0.08}" height="${iconSize * 0.8}"
          rx="${iconSize * 0.02}"
          fill="${primaryColor}"
          opacity="0.2"/>

    <!-- Cross on book -->
    <rect x="${iconSize * 0.46}" y="${iconSize * 0.22}"
          width="${iconSize * 0.08}" height="${iconSize * 0.4}"
          fill="${primaryColor}"/>
    <rect x="${iconSize * 0.36}" y="${iconSize * 0.32}"
          width="${iconSize * 0.28}" height="${iconSize * 0.08}"
          fill="${primaryColor}"/>

    <!-- Text lines on book -->
    <rect x="${iconSize * 0.28}" y="${iconSize * 0.68}"
          width="${iconSize * 0.44}" height="${iconSize * 0.04}"
          rx="${iconSize * 0.02}"
          fill="${primaryColor}"
          opacity="0.4"/>
    <rect x="${iconSize * 0.32}" y="${iconSize * 0.76}"
          width="${iconSize * 0.36}" height="${iconSize * 0.04}"
          rx="${iconSize * 0.02}"
          fill="${primaryColor}"
          opacity="0.3"/>
  </g>
</svg>`;
}

async function generateIcons() {
  console.log('Generating PWA icons...');

  const sizes = [192, 512];

  for (const size of sizes) {
    const svg = createIconSVG(size);
    const outputPath = join(publicDir, `pwa-${size}x${size}.png`);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`Created: pwa-${size}x${size}.png`);
  }

  // Also create apple-touch-icon (180x180)
  const appleSvg = createIconSVG(180);
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Created: apple-touch-icon.png');

  // Create favicon (32x32 and 16x16)
  const favicon32Svg = createIconSVG(32);
  await sharp(Buffer.from(favicon32Svg))
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('Created: favicon-32x32.png');

  const favicon16Svg = createIconSVG(16);
  await sharp(Buffer.from(favicon16Svg))
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('Created: favicon-16x16.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
