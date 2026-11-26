import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, SmoothScroll } from '@/components/shell';
import StructuredData from '@/components/structured-data';
import { SITE_URL, HOME_TITLE, HOME_DESCRIPTION, businessSchema } from '@/lib/seo';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), title: { default: HOME_TITLE, template: '%s | TEJ इट्टा' }, description: HOME_DESCRIPTION,
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/seo/favicon-32.png', sizes: '32x32', type: 'image/png' }], apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><StructuredData data={businessSchema}/><a className="skip-link" href="#main">Skip to content</a><SmoothScroll/><Header/>{children}<Footer/></body></html>;
}
