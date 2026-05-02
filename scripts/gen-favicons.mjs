// Generates the favicon set from public/logo-mark.svg.
// Run: `node scripts/gen-favicons.mjs`
// Outputs:
//   src/app/icon.svg        — copy of logo-mark.svg (Next.js file convention)
//   src/app/icon.png        — 32x32 (optional, complements icon.svg)
//   src/app/apple-icon.png  — 180x180 (Apple touch icon)
//   src/app/favicon.ico     — multi-size ICO (16, 32, 48)

import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const SRC_SVG = resolve(ROOT, 'public', 'logo-mark.svg');
const APP_DIR = resolve(ROOT, 'src', 'app');

const APPLE_ICON_BG = '#f8f6f1'; // brand cream — Apple flattens transparency, give it a warm bed

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function svgToPngBuffer(svg, size, { background } = {}) {
  let pipeline = sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain' });
  if (background) {
    pipeline = pipeline.flatten({ background });
  }
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  await ensureDir(APP_DIR);
  const svg = await readFile(SRC_SVG);

  // 1. icon.svg — file-convention auto-pickup; SVG scales perfectly.
  const iconSvgPath = resolve(APP_DIR, 'icon.svg');
  await copyFile(SRC_SVG, iconSvgPath);

  // 2. icon.png 32x32 — fallback for crawlers that don't sniff SVG.
  const icon32 = await svgToPngBuffer(svg, 32);
  await writeFile(resolve(APP_DIR, 'icon.png'), icon32);

  // 3. apple-icon.png 180x180 — flatten onto cream so iOS doesn't render on black.
  const apple = await svgToPngBuffer(svg, 180, { background: APPLE_ICON_BG });
  await writeFile(resolve(APP_DIR, 'apple-icon.png'), apple);

  // 4. favicon.ico — multi-size (16, 32, 48). png-to-ico packs the PNG buffers into one .ico.
  const ico16 = await svgToPngBuffer(svg, 16);
  const ico32 = await svgToPngBuffer(svg, 32);
  const ico48 = await svgToPngBuffer(svg, 48);
  const icoBuffer = await pngToIco([ico16, ico32, ico48]);
  await writeFile(resolve(APP_DIR, 'favicon.ico'), icoBuffer);

  // eslint-disable-next-line no-console
  console.log('[gen-favicons] wrote:');
  for (const f of ['icon.svg', 'icon.png', 'apple-icon.png', 'favicon.ico']) {
    // eslint-disable-next-line no-console
    console.log(`  src/app/${f}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[gen-favicons] failed:', err);
  process.exit(1);
});
