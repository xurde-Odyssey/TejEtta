import { test, expect } from '@playwright/test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import catalogue from '../../data/catalogue.json';
const origin = 'https://tejbricks.com';
const routes = ['/', '/products', '/enquiry'];

test('public pages expose unique metadata, semantic content and working local links without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const documents = new Map<string, Set<string>>();
  const links: URL[] = [];
  const assets = new Set<string>();
  for (const route of routes) {
    const page = await context.newPage();
    const response = await page.goto(`http://127.0.0.1:3100${route}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex/i);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toHaveCount(1);
    const title = await page.title();
    if (route === '/') expect(title).toBe('TEJ इट्टा');
    expect(title.length).toBeGreaterThan(0); expect(title.length).toBeLessThan(75);
    titles.add(title);
    await expect(page.locator('head title')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    descriptions.add((await page.locator('meta[name="description"]').getAttribute('content'))!);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).href).toBe(`${origin}${route}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute('content'))!).href).toBe(`${origin}${route}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/tejbricks.com\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schemas.length).toBeGreaterThan(0);
    for (const schema of schemas) expect(JSON.parse(schema)['@context']).toBe('https://schema.org');
    if (route !== '/enquiry') {
      for (const product of catalogue) {
        const panel = page.locator(`#product-${product.id}`);
        await expect(panel).toBeVisible();
        await expect(panel).toContainText(product.description);
        await expect(panel).toContainText(product.unit === 'tractor' ? 'full loaded tractor' : 'per brick');
      }
      await expect(page.locator('#product-tukra')).toContainText('14,500');
    }
    documents.set(route, new Set(await page.locator('[id]').evaluateAll(els => els.map(el => el.id))));
    for (const href of await page.locator('a[href]').evaluateAll(els => els.map(el => el.getAttribute('href')!))) {
      const url = new URL(href, `http://127.0.0.1:3100${route}`);
      if (url.origin === 'http://127.0.0.1:3100') links.push(url);
    }
    for (const src of await page.locator('img[src]').evaluateAll(els => els.map(el => el.getAttribute('src')!))) assets.add(src);
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    await page.close();
  }
  expect(titles.size).toBe(3); expect(descriptions.size).toBe(3);
  for (const link of links) {
    expect(routes, `Internal route ${link.pathname}`).toContain(link.pathname);
    if (link.hash) expect(documents.get(link.pathname)?.has(decodeURIComponent(link.hash.slice(1))), link.href).toBe(true);
  }
  for (const asset of assets) expect((await request.get(asset)).status(), asset).toBe(200);
  await context.close();
});

test('sitemap XML, robots, redirects, errors and social assets', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toContain('Allow: /'); expect(text).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(text).not.toMatch(/Disallow: \/(?:\s|$)/);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text(); expect(XMLValidator.validate(xml)).toBe(true);
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
  expect(parsed.urlset['@_xmlns']).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  expect(parsed.urlset.url.map((item: { loc: string }) => item.loc)).toEqual(routes.map(route => origin + route));
  expect(xml).not.toContain('<lastmod>');
  for (const asset of ['/icon.png', '/favicon.ico', '/seo/favicon-32.png', '/apple-touch-icon.png', '/opengraph-image']) expect((await request.get(asset)).status()).toBe(200);
  const social = await request.get('/opengraph-image');
  const png = await social.body();
  expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  const slash = await request.get('/products/', { maxRedirects: 0 });
  expect(slash.status()).toBe(308); expect(slash.headers().location).toBe('/products');
  const www = await request.get('/enquiry?grade=tukra&quantity=2', { headers: { host: 'www.tejbricks.com' }, maxRedirects: 0 });
  expect(www.status()).toBe(308);
  expect(www.headers().location).toBe(`${origin}/enquiry?grade=tukra&quantity=2`);
  const missing = await request.get('/seo-check-not-a-page');
  expect(missing.status()).toBe(404); expect(await missing.text()).toMatch(/name="robots" content="noindex"/);
});

test('catalogue schema agrees with the visible source prices and units', async ({ page }) => {
  await page.goto('/products');
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text));
  const list = schemas.find(schema => schema['@type'] === 'ItemList');
  expect(list.itemListElement).toHaveLength(catalogue.length);
  for (const [i, product] of catalogue.entries()) {
    const item = list.itemListElement[i].item;
    expect(item.offers.price).toBe(product.price.toFixed(2));
    expect(item.offers.priceCurrency).toBe('NPR');
    expect(item.offers.priceSpecification.referenceQuantity.unitText).toBe(product.unit === 'tractor' ? 'full loaded tractor' : 'piece');
    expect(item).not.toHaveProperty('aggregateRating'); expect(item.offers).not.toHaveProperty('availability');
  }
});

for (const mobile of [false, true]) {
  test(`tabs, query canonical and interactive content (${mobile ? 'mobile' : 'desktop'})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:3100/products');
    for (const product of catalogue) {
      await page.getByRole('tab', { name: product.grade, exact: true }).click();
      await expect(page.locator(`#product-${product.id}`)).toBeVisible();
      await expect(page.locator('.product-panel:visible')).toHaveCount(1);
    }
    await page.getByRole('tab', { name: catalogue[4].grade, exact: true }).press('Home');
    await expect(page.getByRole('tab', { name: catalogue[0].grade, exact: true })).toBeFocused();
    await page.selectOption('#brick-category', 'tukra');
    await expect(page.locator('#quantity')).toHaveValue('1');
    await expect(page.locator('.estimate')).toContainText('14,500');
    await page.goto('http://127.0.0.1:3100/enquiry?grade=tukra&quantity=2');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}/enquiry`);
    await expect(page.locator('form')).toBeVisible();
    await page.goto('http://127.0.0.1:3100/');
    await expect(page.locator('.brick-photo-fallback')).toBeVisible();
    await expect.poll(() => page.locator('.brick-photo-fallback img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect.poll(() => page.locator('.hero-photo img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.locator('.brick-photo-fallback img, .hero-photo img').evaluateAll(async images => {
      await Promise.all(images.map(img => (img as HTMLImageElement).decode()));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await page.screenshot({ path: `test-results/seo-home-${mobile ? 'mobile' : 'desktop'}.png`, fullPage: false });
    await page.getByRole('button', { name: 'Explore in 3D' }).click();
    await expect(page.locator('canvas')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await context.close();
  });
}
