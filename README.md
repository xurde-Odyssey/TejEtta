# Shivasakti Etta Udyog — TEJ Bricks

Shivasakti Etta Udyog is the company and manufacturer. TEJ is its brick product brand.

A responsive Next.js + TypeScript website with React Three Fiber product exploration, GSAP ScrollTrigger, Motion, Lenis and Tailwind CSS.
## Local development

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Pages: `/`, `/products`, `/enquiry`.

```sh
npm run typecheck
npm run build
npm start
```

## Configuration

- Public SEO URLs use `https://tejbricks.com`, centralized in `lib/seo.ts`. Preview hosts do not change canonical URLs.
- `GOOGLE_SITE_VERIFICATION`: optional real Search Console URL-prefix verification token, configured before building. DNS verification needs no application token.
- `ENQUIRY_WEBHOOK_URL`: HTTPS endpoint receiving validated enquiry JSON. Configure a trusted inbox/CRM integration; its successful HTTP response is treated as receipt. Optional: the primary enquiry action opens WhatsApp with the completed quotation request. The customer reviews the message and taps Send; no WhatsApp API integration is required. When configured, the webhook enables a secondary direct website submission.

## Catalogue and hosting

`data/catalogue.json` is the source of truth for the five grades and rates. Update it through the repository. Administration and the catalogue write endpoint are excluded from v1.

Deploy using a Node host with `npm run build` and `npm start`. No deployment has been performed by this project setup. For a public deployment, configure webhook-side rate limits/spam filtering (or add a durable limiter), backups, the official contact information and site URL. GA4 is deliberately not activated without a supplied measurement ID and appropriate consent configuration.

## Content and visual notes

Rates and dimensions are maintained in the catalogue; Tukra is priced per full loaded tractor. Prices are indicative and subject to order/delivery confirmation. The homepage uses supplied photographs. The interactive brick model and animated truck are illustrations, not scanned product assets. No unverified strength figures, absorption results, company age, certifications, or client testimonials are asserted.

Motion respects reduced-motion settings; the product can still be manually explored. Three.js is client-loaded with a fallback for rendering failure. The interface includes keyboard focus, labelled form fields, a mobile enquiry bar, and live result messaging. Full WCAG conformance requires a production audit.

## Verification in this workspace

Production builds and TypeScript checks passed using `npm run build -- --webpack`. The default Turbopack build cannot bind its worker port in this restricted workspace. Browser/WebGL verification remains pending.

## Homepage journey

The homepage follows hero → ten production steps → product grades → quotation estimate. A continuous SVG road connects the production photographs. Scrolling moves a small truck along the road; it starts filling at Storage, fills through the brick grades, and unloads into a stack at Delivery. Mobile uses a lane beside the photos. Reduced-motion preferences show a static delivered state. The hero background photo is set to 20% opacity. No hosting changes have been made.

## Office and contact

Public contact details are maintained in `lib/contact.ts`: Campus Mode, Damak, Jhapa; tejitta@gmail.com; +977 980-1452601. The contact page and footer include location, email, telephone and WhatsApp links. The enquiry WhatsApp message includes the selected product, quantity, delivery location, project notes and customer details in a formatted quotation request. Email links open the visitor’s email app; they do not configure automatic form delivery.

## House-area brick estimator

Removed from the homepage and products page at user request. The unused component and calculation module are retained for potential reuse. Visitors can enter length/width or a floor area (square footprint assumed), then adjust identical floor count, height, wall thicknesses, internal wall length, openings, mortar joint and waste. The sample uses 24 × 27 ft enclosed area, excluding the open porch; other defaults are assumptions rather than measurements from the drawing.

`lib/brick-estimate.ts` calculates net wall volume divided by a mortar-inclusive 10 × 5 × 3 inch brick module. The displayed ±15% planning band is illustrative, not a statistical confidence interval. Wall junctions and concrete frame displacement are not deducted. The estimate excludes foundations, parapets, boundary walls and structural design. Only per-piece grades can be priced. Quotation links carry grade and calculated quantity; WhatsApp includes the assumptions for review.

Run calculation checks with `node tests/brick-estimate.cjs`.

## Reference-based 360° brick

`Brick.png` is the visual reference, preserved at `public/reference/tej-brick.png`. The custom Three.js model has a recessed stamp panel, explicit extruded T/E/J silhouettes, rounded edges and deterministic clay bump texture. Letter contours are a hand-built approximation of the reference rather than generated typography. Unseen faces are inferred, not photogrammetry. No Blender or external font asset is needed for the model.

Drag to orbit the entire model, use arrow keys/90° buttons, or toggle continuous 360° rotation. Reduced-motion disables automatic rotation and pointer tilt. Offscreen canvases stop rendering. The homepage product showcase uses the 3D model; the production journey uses a separate lightweight SVG truck.

Meshy comparison is pending: plugin discovery returned no Meshy integration, no `MESHY_API_KEY` was configured, and Weave model discovery required a linked Figma/Weave account. No Meshy generation or lettering-quality comparison was performed. The custom model is the working fallback.

Geometry checks: `node tests/brick-geometry.cjs`. Browser/WebGL visual inspection is still required to confirm lighting, touch gestures and likeness on target devices.


# TejEtta

## SEO maintenance

See [SEO audit and deployment guide](docs/seo-deployment.md) for the findings, changed files, hosting redirects, Search Console setup and deployment checklist. Homepage and products are now prerendered: catalogue changes require a new production build/deployment. Run `npm test` and, after `npm run build -- --webpack`, run `npm run test:seo` for production HTML and browser checks.
