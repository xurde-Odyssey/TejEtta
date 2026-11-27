'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
function Photo() {
  return <div className="brick-photo-fallback"><Image src="/reference/tej-brick.png" alt="TEJ red clay brick with embossed TEJ branding" fill priority sizes="(max-width: 700px) 88vw, 40vw" /></div>;
}
const Brick = dynamic(() => import('./brick'), { ssr: false, loading: Photo });
export default function BrickViewer({ color }: { color: string }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || device.connection?.saveData || (device.deviceMemory !== undefined && device.deviceMemory <= 2)) return;
    // Give HTML and the hero photograph the first rendering opportunity.
    const timer = window.setTimeout(() => setEnabled(true), 250);
    return () => clearTimeout(timer);
  }, []);
  return enabled ? <Brick color={color} showControls={false}/> : <>
    <Photo/><button className="button small brick-load-button" type="button" onClick={() => setEnabled(true)}>Explore in 3D</button>
    <noscript><style>{`.brick-load-button{display:none}`}</style></noscript>
  </>;
}
