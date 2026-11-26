import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const alt = 'TEJ red clay bricks — manufactured in Nepal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';
export default async function SocialImage() {
  const image = await readFile(path.join(process.cwd(), 'app/icon.png'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f5f1e9', color: '#242321', padding: '64px', alignItems: 'center', borderBottom: '18px solid #a9472c' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, letterSpacing: -4 }}>TEJ BRICKS</div>
        <div style={{ display: 'flex', fontSize: 38, color: '#a9472c', marginTop: 28 }}>Red clay. Kiln fired.</div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 12 }}>Manufactured in Nepal.</div>
        <div style={{ display: 'flex', fontSize: 24, marginTop: 58 }}>tejbricks.com</div>
      </div>
      <img src={`data:image/png;base64,${image.toString('base64')}`} alt="" width={440} height={440}/>
    </div>, size,
  );
}
