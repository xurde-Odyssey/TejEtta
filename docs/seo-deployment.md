# TEJ Bricks SEO implementation and deployment

## Scope and baseline (26 November 2026)

The existing application is Next.js 16 App Router with React 19 and TypeScript. The hosting files identify CloudLinux/Passenger on Himalayan Host; live HTTP headers identify LiteSpeed. This change retains the existing design, routes, calculator, enquiry workflow, Three.js model and animated manufacturing journey. No admin page was added. The unused `app/admin/layout.tsx` is not a routable page.

Before changes, live GET requests returned 200 for `/`, `/products`, `/enquiry`, `/robots.txt` and `/sitemap.xml`. Both HTTP apex and HTTPS www also returned 200, creating duplicate hosts/protocols. `/products/` returned 308; a nonexistent URL returned 404 with noindex. All three pages shared title/description, lacked canonicals and JSON-LD, and lacked a social image. `/products` had no H1. Public pages were server-rendered, but only the selected grade had full HTML details. The web browsing service could not fetch the site; direct HTTPS requests succeeded. This is not proof of verified Googlebot access or indexing.

## Changes

- `lib/seo.ts`: canonical domain, real public route list, unique metadata, organization/site schema and catalogue Product/Offer data.
- `app/layout.tsx`, `app/page.tsx`, `app/products/page.tsx`, `app/enquiry/page.tsx`: per-page SEO and JSON-LD. Homepage and products now prerender at build time. Enquiry retains runtime query handling and webhook configuration.
- `app/robots.ts`, `app/sitemap.ts`: HTTPS canonical URLs without environment-dependent localhost fallbacks; no invented modification dates. `/api/` remains excluded from crawling, independent of existing API validation. There is no public administrative route to block.
- `next.config.mjs`: permanent www-to-apex redirect preserving paths/query strings. HTTPS enforcement must also be configured at the TLS-terminating host; see below.
- `components/experience.tsx`, `app/globals.css`: all grade panels render as semantic HTML, accessible tabs show one panel at a time, and a noscript rule shows the full collection without JavaScript. Product fragment links select the corresponding panel. Products has one H1 with the same typography. Hero content is visible without JS. Prices remain indicative, with Tukra sold per full loaded tractor. `data/catalogue.json` identifies Picket/Jhama.
- `components/structured-data.tsx`: JSON-LD serialization escapes `<` to avoid script injection from content.
- `components/brick-viewer.tsx`, `components/brick.tsx`: real brick photo during 3D loading; opt-in 3D for reduced motion, data saver and reported low-memory devices. Manual 3D remains available. Demand rendering wakes for pointer movement, controls and rotation, and pauses offscreen; DPR remains capped at 1.5. No GLB exists to compress.
- `components/journey.tsx`, `public/optimized/`, `scripts/prepare-seo-assets.mjs`: responsive optimized WebP journey images, retaining originals. Ten images total 2,843,524 bytes versus 14,310,725 original bytes, an 80.1% source-asset reduction. This is not a measured page-load or Core Web Vitals improvement. Next.js additionally selects responsive delivery sizes. Hero image priority remains intact.
- `app/opengraph-image.tsx`: 1200 × 630 social image composed with the existing embossed TEJ icon, with no invented branding. Existing `app/icon.png` is retained. `public/favicon.ico`, `public/seo/favicon-32.png`, `public/apple-touch-icon.png` derive from it.
- `.env.example`: optional real Search Console verification token. GA4 remains inactive; no measurement ID was invented.
- `playwright.config.ts`, `tests/seo/public-pages.spec.ts`, `package.json`, `package-lock.json`, `.gitignore`: production-server SEO/browser checks and test-only dependencies.

Existing local contact/README edits and the unattached brick artwork were preserved.

## Content and structured data

The catalogue is the single price source: first-class NPR 30/piece, Picket/Jhama NPR 29.50/piece, second-class NPR 28/piece, Godiya NPR 22/piece, Tukra NPR 14,500/full loaded tractor. Product offers use NPR and explicit reference quantities. Editable calculator values never become schema prices. No availability, ratings, reviews, strength results, coordinates, hours or founding year are asserted.

Product markup is inside an ItemList on the collection page. This does not promise Google product rich results: Google's guidance focuses on individual-product pages. Dedicated pages should be considered only when each can contain distinct, useful specifications, photos and application guidance, rather than duplicating the tab content. No new landing-page routes were invented.

The supplied business identity is reflected as TEJ Bricks, manufactured by Shivasakti Etta Udyog. Existing contact information remains visible; no additional address or phone data is asserted in schema.

## Validation commands

```sh
npm ci
npm run typecheck
npm test
npm run build -- --webpack
npm run test:seo
```

The browser tests start a fresh local production server on port 3100. Local testing uses installed Google Chrome. In CI, install Playwright Chromium (`npx playwright install --with-deps chromium`) and set `CI=1`. No lint script/configuration existed, so no lint pass is claimed. `npm run assets:seo` regenerates image/icon derivatives if originals change; it requires the Sharp dependency installed with Next.js.

SEO tests cover HTTP status, metadata uniqueness, canonical query handling, JSON-LD syntax and price/unit consistency, XML validity, sitemap routes, robots, local assets and links, missing-page status, headings, no-JavaScript content, tabs/keyboard controls, mobile layout and 3D fallback activation. Generated screenshots are in ignored `test-results/`.

## Verification results (26 November 2026)

- `npm run build -- --webpack`: passed. Build reports static `/`, `/products`, `/robots.txt`, `/sitemap.xml`, `/icon.png` and `/opengraph-image`; `/enquiry` and `/api/enquiry` remain dynamic.
- `npm run typecheck`: passed.
- `npm test`: estimator, brick geometry and enquiry validation/delivery tests passed.
- `npm run test:seo`: all 5 tests passed against the final production build, including no-JavaScript content, local links/assets, metadata, XML, redirects, structured-data consistency, and desktop/mobile interaction checks.
- `git diff --check`: passed. Screenshots of the responsive fallback and generated social image were inspected. Full target-device and visual-regression coverage is not claimed.
- Next.js normalizes the root canonical and Open Graph URL to `https://tejbricks.com` without the trailing slash. This is the same URL as `https://tejbricks.com/`; the sitemap uses the slash form. Tests compare normalized URL values.
- Live production was rechecked: homepage, products, enquiry, robots and sitemap all return 200. HTTP apex and HTTPS www still return 200. The SEO changes are local and have not been deployed, so production does not yet have the new metadata or redirect behavior.
- No lint configuration existed. External Google Rich Results/Schema.org validation, Search Console verification and real-user Core Web Vitals measurement remain manual follow-up steps. Local tests validate JSON syntax and catalogue consistency, not Google's eligibility determination.

## Host redirects — required external step

The repository cannot inspect or edit the live cPanel/LiteSpeed virtual host or its security rules. Enable HTTPS redirection for `tejbricks.com` and redirect `www.tejbricks.com` to `https://tejbricks.com`, preferably in a single hop. Keep certificates valid for both names. The application also supplies a www redirect as a fallback.

If LiteSpeed terminates TLS directly and the provider supports `.htaccess`, merge the following before Passenger rules after checking existing rules; do not overwrite the managed file:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(?:www\.)?tejbricks\.com$ [NC]
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\.tejbricks\.com$ [NC]
RewriteRule ^ https://tejbricks.com%{REQUEST_URI} [R=301,L,NE]
```

This rule preserves the existing query string. If TLS terminates at an upstream CDN/proxy, use its HTTPS setting or ask the host for its trusted scheme configuration. Do not blindly trust client-supplied forwarded headers or install a rule that creates a redirect loop. Do not disable WAF/bot protections. Investigate any 403 through host logs and Search Console's live URL inspection.

Preserve `/enquiry?grade=...&quantity=...` functionality. Canonical tags point to `/enquiry`; query strings must not be globally stripped. Next.js normalizes trailing slashes. No blanket redirect of unknown paths to the homepage is used.

## Search Console and analytics

1. Create a Search Console **Domain property** for `tejbricks.com`.
2. Add the exact TXT record Google supplies at your authoritative DNS provider. Wait for DNS propagation and verify. Keep the record after verification.
3. Alternatively, create the HTTPS URL-prefix property and set the supplied token as `GOOGLE_SITE_VERIFICATION` before building; redeploy and verify the rendered tag. DNS verification does not need an application token.
4. Submit `https://tejbricks.com/sitemap.xml` in Sitemaps.
5. Inspect `/`, `/products` and `/enquiry`; use **Test live URL** to check Google access and rendered content. Request indexing where appropriate.
6. Monitor Pages, HTTPS and Core Web Vitals reports. Check Google-selected versus declared canonicals after recrawling.
7. Validate deployed JSON-LD using Schema.org Validator and Google's Rich Results Test. An ItemList of distinct products does not guarantee product rich-result eligibility.

GA4 is optional and has not been activated. Add it only with an actual measurement ID and the owner's tracking/consent requirements. Search Console works without GA4. No indexing completion is claimed.

## Deployment checklist

- Review code and product content, retain the user's unrelated changes, and pass the commands above.
- Deploy through the established Passenger workflow (`.deploy.sh` on the host), after committing/reviewing the intended changes. Do not run that host-specific script locally.
- Build with production configuration. Catalogue updates now require rebuilding/deploying `/` and `/products`; enquiry reads the same catalogue at runtime. Do not edit only the server's JSON file after deployment.
- Restart Passenger after a successful build. Verify HTTP/www redirects and ensure existing HTTPS URLs do not loop.
- Check the three public pages, robots, sitemap, canonical tags, social image, icon files, optimized images and a deliberately missing URL on the live domain. Fetch HTML without executing JS to verify all product details.
- Check the enquiry flow, calculator, mobile navigation, journey animations and 3D controls on target devices.
- Run external structured-data validation, submit the sitemap and monitor Search Console.

LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds and CLS ≤ 0.1 are 75th-percentile real-user goals. No field dataset or guaranteed Lighthouse result is available from this implementation. Use Search Console/CrUX where available and measure representative mobile visits before claiming those targets are met.

References: https://developers.google.com/search/docs/appearance/structured-data/product-snippet ; https://nextjs.org/docs/app/api-reference/functions/generate-metadata ; https://r3f.docs.pmnd.rs/advanced/scaling-performance
