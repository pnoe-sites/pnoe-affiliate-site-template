# PNOĒ Affiliate Site Template

A static website template for PNOĒ-affiliated clinics: React 18 + Vite + Tailwind,
dark editorial wellness design. Every piece of clinic content comes from one file,
`src/data/clinic.json`, and the built site makes no network requests, so the output
publishes anywhere static files are served (Plexon managed hosting publishes it to
GitHub Pages).

Derived from [EndoMedical/pnoe-affiliate-website](https://github.com/EndoMedical/pnoe-affiliate-website):
same pages and design, with the mock API server replaced by the build-time data file
and the project flattened to a single package so Plexon's site publisher can build it.

## How it works

- `src/data/clinic.json` holds the clinic's profile, services, team, testimonials,
  and packages. The full schema is documented in [DATA_CONTRACT.md](DATA_CONTRACT.md).
- `npm run build` validates the data file, type-checks, builds to `dist/`, and writes
  `dist/404.html` so deep links survive a refresh on GitHub Pages.
- The file ships with fictional "Evergreen Wellness Clinic" content, so the template
  previews out of the box. Replace the sections you have data for; the rest keeps the
  defaults.
- Clinic-specific imagery goes under `public/images/custom/`; stock imagery lives in
  `public/images/defaults/`, `team/`, and `testimonials/`.

## Commands

```
npm install        # or npm ci
npm run dev        # dev server on :5173
npm run build      # validate + tsc + vite build + 404.html
npm run validate:data
npm run preview
```

In Plexon, the PNOĒ Business Analyst persona clones this template, fills
`clinic.json` from the clinic's data sources, and publishes through the company's
managed hosting.
