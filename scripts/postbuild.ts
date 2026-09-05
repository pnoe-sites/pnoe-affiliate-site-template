// What the built folder needs that vite does not write.
//
// 1. One HTML file per route. GitHub Pages has no rewrite engine, so a
//    client-routed app answers 404 on every path but "/", and anything that
//    reads a page without running its JavaScript (a search engine, a link
//    preview in WhatsApp or Slack) sees the 404 or, at best, the home page's
//    title on every route. Writing dist/<route>/index.html for every route,
//    each with its own <title>, description, canonical and social tags, means
//    every address answers 200 with the right head before the app mounts. The
//    route list and the words come from src/shared/routeMeta.ts, the same
//    source Layout.tsx uses in the browser, so the two cannot drift.
// 2. dist/404.html, a copy of the home shell, for addresses that are not
//    routes at all (an old link, a typo): the app then shows its own not-found
//    page instead of GitHub's.
// 3. sitemap.xml and robots.txt when the published address is known, and a
//    JSON-LD block on the home page from recorded fields only.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ClinicDataSchema, type ClinicData } from '../src/shared/schemas'
import { routeMetaFor } from '../src/shared/routeMeta'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const indexPath = path.join(dist, 'index.html')

if (!existsSync(indexPath)) {
  console.error('postbuild: dist/index.html not found; run vite build first')
  process.exit(1)
}

const data: ClinicData = ClinicDataSchema.parse(JSON.parse(readFileSync(path.join(root, 'src', 'data', 'clinic.json'), 'utf8')))
const siteUrl = data.config.seo?.siteUrl?.replace(/\/+$/, '')
const shell = readFileSync(indexPath, 'utf8')

/** absolute makes a root-relative asset path public; an https URL is already public. */
const absolute = (p: string): string => (/^https?:\/\//i.test(p) ? p : `${siteUrl}${p}`)

/** escapeAttr keeps a name with a quote or an ampersand in it from breaking the tag. */
const escapeAttr = (s: string) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function jsonLd(): string {
  const { config } = data
  const block: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': config.seo?.schemaType ?? 'LocalBusiness',
    name: config.name,
  }
  if (siteUrl) block.url = `${siteUrl}/`
  if (config.tagline) block.slogan = config.tagline
  block.description = config.hero.sub
  if (config.contact.phone) block.telephone = config.contact.phone
  if (config.contact.email) block.email = config.contact.email
  if (config.contact.location) block.address = config.contact.location
  if (config.logo && siteUrl) block.logo = absolute(config.logo)
  if (config.heroImage && siteUrl) block.image = absolute(config.heroImage)
  const sameAs = (config.contact.socials ?? []).map((s) => s.url).filter(Boolean)
  if (sameAs.length) block.sameAs = sameAs
  if (data.team.length) {
    block.employee = data.team.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.title }))
  }
  // No aggregateRating: a review line on a marketing page is not a rating with a count and a source.
  return `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`
}

function headFor(route: { path: string; title: string; description: string }): string {
  const canonical = siteUrl ? `${siteUrl}${route.path === '/' ? '/' : route.path + '/'}` : ''
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    canonical ? `<meta property="og:url" content="${escapeAttr(canonical)}" />` : '',
    data.config.heroImage && siteUrl ? `<meta property="og:image" content="${escapeAttr(absolute(data.config.heroImage))}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    canonical ? `<link rel="canonical" href="${escapeAttr(canonical)}" />` : '',
    route.path === '/' ? jsonLd() : '',
  ]
  return tags.filter(Boolean).map((tag) => '    ' + tag).join('\n')
}

function pageFor(route: { path: string; title: string; description: string }): string {
  let html = shell
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
  )
  return html.replace('</head>', headFor(route) + '\n  </head>')
}

const routes = routeMetaFor(data)
for (const route of routes) {
  const dir = route.path === '/' ? dist : path.join(dist, ...route.path.split('/').filter(Boolean))
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'index.html'), pageFor(route))
}
console.log(`postbuild: wrote ${routes.length} route pages for ${data.config.name}`)

// The not-found fallback carries the home head; GitHub serves it for any
// address that is not a route, and the app shows its own not-found page.
copyFileSync(indexPath, path.join(dist, '404.html'))
console.log('postbuild: wrote dist/404.html')

if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map((r) => `  <url><loc>${escapeAttr(siteUrl + (r.path === '/' ? '/' : r.path + '/'))}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')
  writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
  writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  console.log('postbuild: wrote sitemap.xml and robots.txt')
} else {
  console.log('postbuild: no config.seo.siteUrl, so no sitemap, canonical or robots.txt (set it once the address is assigned)')
}
