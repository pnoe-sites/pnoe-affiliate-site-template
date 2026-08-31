// Validates src/data/clinic.json before every build, so a malformed data file
// fails in seconds with a readable message instead of minutes later inside tsc
// or as a blank section on the published site.
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ClinicDataSchema } from '../src/shared/schemas'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', 'data', 'clinic.json')

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

if (errors.length > 0) {
  console.error('clinic.json failed validation:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(
  `clinic.json OK: ${data.services.length} services, ${data.team.length} team, ` +
    `${data.testimonials.length} testimonials, ${data.packages.length} packages`,
)
