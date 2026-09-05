# PNOĒ Affiliate Site Template

A static website template for PNOĒ-affiliated businesses: React 18 + Vite + Tailwind,
dark editorial wellness design. Every word and picture comes from one file,
`src/data/clinic.json`, and the built site makes no network requests, so the output
publishes anywhere static files are served (Plexon managed hosting publishes it to
GitHub Pages).

Derived from [EndoMedical/pnoe-affiliate-website](https://github.com/EndoMedical/pnoe-affiliate-website):
same pages and design, with the mock API server replaced by the build-time data file
and the project flattened to a single package so Plexon's site publisher can build it.

## How it works

- `src/data/clinic.json` holds the profile, the hero, the method, services and their
  categories, team, testimonials, packages and the page copy. The full schema is
  documented in [DATA_CONTRACT.md](DATA_CONTRACT.md).
- The template's code carries no words about the business. Section headings and the
  like come from `config.copy` or from neutral defaults in `src/constants/copy.ts`;
  `npm run lint` fails if a page names a treatment, premises or kind of visitor. A page
  whose data is absent (no `method`, no `packages`) is not rendered and not linked.
- Every Book button goes where `config.booking.url` says (the business's scheduler,
  opened in a new tab). Without it the request page turns the form into an email to
  `config.contact.email`; the site has no server, so nothing is ever "submitted" to
  nowhere. Change the destination in the data, never in a page.
- `npm run build` validates the data file, type-checks, builds to `dist/`, and writes one
  `index.html` per route with its own title, description, canonical and social tags, plus
  `404.html`, `sitemap.xml` and `robots.txt` (the last three need `config.seo.siteUrl`).
  Every route answers HTTP 200 on GitHub Pages and reads right in a link preview.
- The file ships with fictional "Evergreen Wellness Clinic" content, so the template
  previews out of the box. `npm run validate:release` refuses a site that still shows any
  of it, or that has made no booking decision; run it before publishing.
- Photos go under `public/images/custom/`; `npm run images` shrinks them to their slot's
  size (the build refuses any file over 1 MB). Stock imagery lives in
  `public/images/defaults/`, `team/`, and `testimonials/`.

## Commands

```
npm install        # or npm ci
npm run dev        # dev server on :5173
npm run build      # validate + tsc + vite build + per-route HTML, 404.html, sitemap
npm run validate:data
npm run validate:release   # the publish gate: no template copy, a booking decision
npm run images     # resize and re-encode public/images/custom/, rewrite references
npm run lint       # copy scan + eslint
npm run preview
```

In Plexon, the PNOĒ Business Analyst persona clones this template, fills
`clinic.json` from the business's data sources and its website brief, and publishes
through the company's managed hosting.
