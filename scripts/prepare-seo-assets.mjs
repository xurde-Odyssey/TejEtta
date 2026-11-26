import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/optimized', { recursive: true });
await mkdir('public/seo', { recursive: true });
const images = {
  'Molding.jpeg': 'brick-molding', 'beforefire.jpeg': 'bricks-before-firing', 'firing.png': 'brick-kiln-firing',
  'unloading.jpeg': 'unloading-fired-bricks', 'storage.jpeg': 'brick-yard-storage', 'no1.jpeg': 'first-class-bricks',
  'no2.jpeg': 'second-class-bricks', 'tukra.jpeg': 'broken-bricks-tukra', 'Godiya.jpeg': 'godiya-bricks', 'Delivery.jpeg': 'brick-delivery',
};
for (const [source, name] of Object.entries(images)) {
  await sharp(`public/Bricks/${source}`).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/optimized/${name}.webp`);
}
await sharp('app/icon.png').resize(180,180).png().toFile('public/apple-touch-icon.png');
await sharp('app/icon.png').resize(32,32).png().toFile('public/seo/favicon-32.png');
// ICO supports PNG entries. Retain the existing branded icon, at three sizes.
const sizes = [16,32,48];
const pngs = await Promise.all(sizes.map(size => sharp('app/icon.png').resize(size,size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1,2); header.writeUInt16LE(sizes.length,4);
let offset = header.length;
pngs.forEach((png,i) => {
  const start=6+i*16; header[start]=sizes[i]; header[start+1]=sizes[i];
  header.writeUInt16LE(1,start+4); header.writeUInt16LE(32,start+6);
  header.writeUInt32LE(png.length,start+8); header.writeUInt32LE(offset,start+12); offset+=png.length;
});
await writeFile('public/favicon.ico',Buffer.concat([header,...pngs]));
console.log('Optimized journey images and branded favicon variants generated.');
