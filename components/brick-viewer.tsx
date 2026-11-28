'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useLanguage } from './language-provider';
function Loading() {
  const { language } = useLanguage();
  return <div className="brick-photo-fallback" role="status">{language === 'ne' ? 'थ्रीडी इट्टा लोड हुँदैछ…' : 'Loading 3D brick…'}</div>;
}
const Brick = dynamic(() => import('./brick'), { ssr: false, loading: Loading });
export default function BrickViewer({ color }: { color: string }) {
  const { language } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || device.connection?.saveData || (device.deviceMemory !== undefined && device.deviceMemory <= 2)) return;
    // Give HTML and the hero photograph the first rendering opportunity.
    const timer = window.setTimeout(() => setEnabled(true), 250);
    return () => clearTimeout(timer);
  }, []);
  return enabled ? <Brick color={color} showControls={false}/> : <>
    <button className="button small brick-load-button" type="button" onClick={() => setEnabled(true)}>{language === 'ne' ? 'थ्रीडीमा हेर्नुहोस्' : 'Explore in 3D'}</button>
    <noscript><style>{`.brick-load-button{display:none}`}</style></noscript>
  </>;
}
