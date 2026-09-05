// Validates src/data/clinic.json before every build, so a malformed data file
// fails in seconds with a readable message instead of minutes later inside tsc
// or as a blank section on the published site.
//
// Two modes. The default runs inside `npm run build`: schema, image existence,
// image weight, category and slug checks. `--release` (`npm run validate:release`)
// adds the checks that decide whether the site may go public: no line still
// carrying the template's own words, a booking decision made, no
// `[Confirm with ...]` marker left on a page. The seed passes the first and
// fails the second on purpose, so the template demos and never publishes as is.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ClinicDataSchema } from '../src/shared/schemas'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', 'data', 'clinic.json')
const release = process.argv.includes('--release')

/** The heaviest a shipped image may be. GitHub Pages serves it as-is on every visit. */
export const MAX_IMAGE_BYTES = 1024 * 1024

const raw = readFileSync(dataPath, 'utf8')
let parsed: unknown
try {
  parsed = JSON.parse(raw)
} catch (err) {
  console.error(`clinic.json is not valid JSON: ${(err as Error).message}`)
  process.exit(1)
}

const result = ClinicDataSchema.safeParse(parsed)
if (!result.success) {
  console.error('clinic.json does not match the data contract (see DATA_CONTRACT.md):')
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
  process.exit(1)
}

const data = result.data
const errors: string[] = []
const warnings: string[] = []

// Every referenced image must exist under public/ with the exact casing: Windows
// resolves case-insensitively but GitHub Pages does not, so existsSync alone
// would pass a path that 404s in production.
function existsCaseExact(segments: string[]): boolean {
  let dir = path.join(root, 'public')
  for (const segment of segments) {
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      return false
    }
    if (!entries.includes(segment)) return false
    dir = path.join(dir, segment)
  }
  return true
}

function checkImage(field: string, value: string | undefined) {
  if (!value) return
  if (value.startsWith('http://') || value.startsWith('https://')) return
  if (!value.startsWith('/')) {
    errors.push(`${field}: image path ${JSON.stringify(value)} must start with "/" (served from public/)`)
    return
  }
  if (!existsCaseExact(value.split('/').filter(Boolean))) {
    errors.push(`${field}: image not found at public${value} (the path is case-sensitive)`)
    return
  }
  if (release && value.startsWith('/images/defaults/')) {
    warnings.push(`${field}: still the template's stock image (${value})`)
  }
}

checkImage('config.heroImage', data.config.heroImage)
checkImage('config.logo', data.config.logo)
for (const [key, value] of Object.entries(data.config.images ?? {})) {
  checkImage(`config.images.${key}`, value)
}
data.config.whoWeHelpPanels?.forEach((p, i) => checkImage(`config.whoWeHelpPanels[${i}].image`, p.image))
data.services.forEach((s, i) => checkImage(`services[${i}].imageUrl`, s.imageUrl))
data.testimonials.forEach((t, i) => checkImage(`testimonials[${i}].photo`, t.photo))
data.team.forEach((m, i) => checkImage(`team[${i}].photo`, m.photo))

// Image weight. A 2 MB portrait is downloaded on every visit to the page that
// shows it; `npm run images` resizes and re-encodes everything in custom/.
const customDir = path.join(root, 'public', 'images', 'custom')
let customTotal = 0
function walkImages(dir: string) {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walkImages(full)
      continue
    }
    if (!/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(entry)) continue
    customTotal += stat.size
    if (stat.size > MAX_IMAGE_BYTES) {
      const rel = path.relative(root, full).split(path.sep).join('/')
      errors.push(`${rel}: ${(stat.size / 1048576).toFixed(2)} MB, over the ${MAX_IMAGE_BYTES / 1048576} MB limit. Run: npm run images`)
    }
  }
}
walkImages(customDir)

// A shown price needs an amount; the page renders "From $<amount>" unguarded.
data.services.forEach((s, i) => {
  if (s.pricing && s.pricing.display !== 'hidden' && typeof s.pricing.amount !== 'number') {
    errors.push(`services[${i}].pricing: display ${JSON.stringify(s.pricing.display)} requires an amount (or use "hidden")`)
  }
})

// Slugs must be unique, and pairsWith must point at real services.
const slugs = new Set<string>()
data.services.forEach((s, i) => {
  if (slugs.has(s.slug)) errors.push(`services[${i}].slug: duplicate slug ${JSON.stringify(s.slug)}`)
  slugs.add(s.slug)
})
data.services.forEach((s, i) => {
  s.pairsWith?.forEach(ref => {
    if (!slugs.has(ref)) errors.push(`services[${i}].pairsWith: unknown service slug ${JSON.stringify(ref)}`)
  })
})

// Every service category is one the Offerings page knows how to head.
const categoryIds = new Set((data.config.serviceCategories ?? []).map((c) => c.id))
const seenCategories = new Set<string>()
data.config.serviceCategories?.forEach((c, i) => {
  if (seenCategories.has(c.id)) errors.push(`config.serviceCategories[${i}].id: duplicate id ${JSON.stringify(c.id)}`)
  seenCategories.add(c.id)
})
data.services.forEach((s, i) => {
  if (!categoryIds.has(s.category)) {
    errors.push(`services[${i}].category: ${JSON.stringify(s.category)} is not in config.serviceCategories; add {id, name} there`)
  }
})

// Outbound links are https, so a scheduler or assessment never opens over http.
for (const [field, url] of [
  ['config.booking.url', data.config.booking?.url],
  ['config.hero.cta.url', data.config.hero.cta?.url],
  ['config.seo.siteUrl', data.config.seo?.siteUrl],
] as const) {
  if (url && !url.startsWith('https://')) errors.push(`${field}: must start with https://`)
}

// ---------------------------------------------------------------------------
// Release gate
// ---------------------------------------------------------------------------

if (release) {
  // Every string the seed ships. A site whose field still equals one of them
  // is showing the template's words as its own; the one exception is a stock
  // image path, which is a warning (stock stays where the business has no photo).
  const seed = JSON.parse(readFileSync(path.join(root, 'scripts', 'template-defaults.json'), 'utf8'))
  const seedStrings = new Set<string>()
  const SKIP_KEYS = new Set(['colors', 'primary', 'secondary', 'accent', 'icon', 'role', 'display', 'currency', 'id', 'label', 'platform', 'billingPeriod', 'tag', 'value', 'methodName'])
  const collect = (node: unknown, key?: string) => {
    if (key && SKIP_KEYS.has(key)) return
    if (typeof node === 'string') {
      if (node.trim().length >= 12 && !node.startsWith('/images/')) seedStrings.add(node.trim())
    } else if (Array.isArray(node)) {
      node.forEach((n) => collect(n, key))
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) collect(v, k)
    }
  }
  collect(seed)

  const visit = (node: unknown, trail: string, key?: string) => {
    if (key && SKIP_KEYS.has(key)) return
    if (typeof node === 'string') {
      if (seedStrings.has(node.trim())) {
        errors.push(`${trail} still carries the template's own text; write the business's own line or remove it`)
      }
      if (/\[Confirm with /.test(node)) {
        errors.push(`${trail} still holds a [Confirm with ...] marker; settle it before publishing`)
      }
    } else if (Array.isArray(node)) {
      node.forEach((n, i) => visit(n, `${trail}[${i}]`, key))
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) visit(v, trail ? `${trail}.${k}` : k, k)
    }
  }
  visit(data, '')

  if (!data.config.booking?.url && data.config.booking?.noScheduler !== true) {
    errors.push('config.booking: set booking.url to the business\'s scheduler, or booking.noScheduler: true to send requests by email')
  }
  if (data.config.contact.email && /@example\.com$/i.test(data.config.contact.email)) {
    errors.push('config.contact.email: still the example address')
  }
}

if (warnings.length > 0) {
  console.warn('clinic.json notes:')
  for (const w of warnings) console.warn(`  - ${w}`)
}

if (errors.length > 0) {
  console.error(release ? 'clinic.json is not ready to publish:' : 'clinic.json failed validation:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(
  `clinic.json OK${release ? ' (release)' : ''}: ${data.services.length} services, ${data.team.length} team, ` +
    `${data.testimonials.length} testimonials, ${data.packages.length} packages, ` +
    `custom images ${(customTotal / 1048576).toFixed(2)} MB`,
)
