import type { Metadata } from 'next';
import type { Product } from './catalogue';

// Public identity is deliberately independent of preview/request hosts.
export const SITE_URL = 'https://tejbricks.com';
export const PUBLIC_PATHS = ['/', '/products', '/enquiry'] as const;
export const HOME_TITLE = 'TEJ इट्टा';
export const HOME_DESCRIPTION = 'Explore TEJ kiln-fired red clay bricks in Nepal. Compare brick grades, specifications and prices, and enquire about construction-site delivery.';
export const productImages: Record<string, string> = {
  first: '/brickimage.jpeg', picket: '/pricket.webp', second: '/Bricks/no2.jpeg',
  godiya: '/Bricks/Godiya.jpeg', tukra: '/tukra1.jpeg',
};
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = path === '/' ? title : `${title} | TEJ इट्टा`;
  const url = `${SITE_URL}${path}`;
  return {
    title: { absolute: fullTitle }, description, alternates: { canonical: url },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: { title: fullTitle, description, url, siteName: 'TEJ इट्टा', type: 'website', locale: 'en_NP', images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'TEJ embossed red clay brick — manufactured in Nepal' }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [`${SITE_URL}/opengraph-image`] },
  };
}
export const businessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'TEJ Bricks', url: SITE_URL, logo: `${SITE_URL}/icon.png`, description: 'TEJ kiln-fired red clay bricks manufactured by Shivasakti Etta Udyog in Nepal, supplied in grades for masonry and site preparation.' },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'TEJ Bricks', url: SITE_URL, inLanguage: 'en', publisher: { '@id': `${SITE_URL}/#organization` } },
  ],
};
export function catalogueSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'TEJ red clay brick grades',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: {
        '@type': 'Product', '@id': `${SITE_URL}/products#product-${product.id}`, url: `${SITE_URL}/products#product-${product.id}`,
        name: `${product.name} (${product.grade})`, description: product.description,
        image: `${SITE_URL}${productImages[product.id]}`, material: 'Kiln-fired clay', brand: { '@type': 'Brand', name: 'TEJ Bricks' },
        ...(product.price !== null ? { offers: {
          '@type': 'Offer', url: `${SITE_URL}/enquiry?grade=${product.id}`, price: product.price.toFixed(2), priceCurrency: 'NPR',
          description: `Indicative price per ${product.unit === 'tractor' ? 'full loaded tractor' : 'piece'}. Final price and delivery subject to confirmation.`,
          priceSpecification: { '@type': 'UnitPriceSpecification', price: product.price.toFixed(2), priceCurrency: 'NPR', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: product.unit === 'tractor' ? 'full loaded tractor' : 'piece' } },
        } } : {}),
      },
    })),
  };
}
