import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, SmoothScroll } from '@/components/shell';
const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = { metadataBase: new URL(url), title: 'TEJ', description: 'Explore TEJ kiln-fired clay bricks manufactured by Shivasakti Etta Udyog, Nepal. Compare grades, estimate VAT-inclusive pricing, and request a quotation for your project.', openGraph: { title: 'TEJ', description: 'TEJ kiln-fired clay bricks by Shivasakti Etta Udyog. Built for Nepal.', type: 'website', locale: 'en_NP' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><SmoothScroll/><Header/>{children}<Footer/></body></html> }
