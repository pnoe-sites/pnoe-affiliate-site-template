import { copyFor } from '../constants/copy'
import type { ClinicData } from './schemas'

/**
 * One entry per route the site serves: the path, the <title> and the meta
 * description that route's static HTML carries.
 *
 * Used twice, from the same source so they cannot drift: scripts/postbuild.ts
 * writes one dist/<path>/index.html per entry so every route answers HTTP 200
 * on GitHub Pages with its own head, and Layout.tsx sets document.title on
 * client-side navigation. Derived from the data file; config.seo.routes
 * overrides title or description per path.
 */
export interface RouteMeta {
  path: string
  title: string
  description: string
}

const MAX_TITLE = 60
const MAX_DESCRIPTION = 160

/** Cut at a word boundary so a description never ends mid-word. */
export function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return (space > max / 2 ? cut.slice(0, space) : cut).replace(/[,;:]$/, '') + '…'
}

// A long business name would leave the page part two characters wide, so
// past 30 characters the name drops off page titles (the home title keeps it).
const MAX_NAME_IN_TITLE = 30

function pageTitle(name: string, page: string): string {
  const full = `${page} | ${name}`
  if (full.length <= MAX_TITLE) return full
  if (name.length > MAX_NAME_IN_TITLE) return clip(page, MAX_TITLE)
  return clip(page, MAX_TITLE - name.length - 3) + ` | ${name}`
}

// "in Woburn, MA" reads; "in 10 Roessler Rd Suite D, Woburn, MA 01801" does not.
function placePhrase(location: string | undefined): string {
  if (!location || /\d/.test(location) || location.length > 40) return ''
  return ` in ${location}`
}

export function routeMetaFor(data: ClinicData): RouteMeta[] {
  const { config, services, packages } = data
  const name = config.name.trim()
  const copy = copyFor(config)
  const overrides = config.seo?.routes ?? {}
  const where = placePhrase(config.contact.location)

  const homeTitle = config.tagline ? `${name} - ${config.tagline}` : name
  const entries: RouteMeta[] = [
    {
      path: '/',
      title: homeTitle.length <= MAX_TITLE ? homeTitle : name,
      description: config.hero.sub,
    },
    {
      path: '/offerings',
      title: pageTitle(name, copy.offeringsLabel),
      description: services.length
        ? `What ${name} offers${where}: ${services.map((s) => s.title).join(', ')}.`
        : `What ${name} offers${where}.`,
    },
    ...services.map((s) => ({
      path: `/services/${s.slug}`,
      title: pageTitle(name, s.title),
      description: s.shortDescription || s.longDescription,
    })),
  ]
  if (config.method) {
    entries.push({
      path: '/method',
      title: pageTitle(name, config.methodName ?? config.method.headline),
      description: config.method.intro,
    })
  }
  entries.push({
    path: '/about',
    title: pageTitle(name, copy.aboutLabel),
    description: config.missionHeadline ?? config.hero.sub,
  })
  if (packages.length > 0) {
    entries.push({
      path: '/shop',
      title: pageTitle(name, copy.packagesLabel),
      description: `${copy.packagesIntro} ${name} packages: ${packages.map((p) => p.name).join(', ')}.`,
    })
  }
  entries.push({
    path: '/booking',
    title: pageTitle(name, copy.bookingHeadline),
    description: `${copy.bookingHeadline} with ${name}${where}. ${copy.bookingIntro}`,
  })

  return entries.map((entry) => {
    const override = overrides[entry.path] ?? {}
    return {
      path: entry.path,
      title: clip(override.title ?? entry.title, MAX_TITLE),
      description: clip(override.description ?? entry.description, MAX_DESCRIPTION),
    }
  })
}

/** The entry for a pathname, tolerant of a trailing slash. */
export function metaForPath(data: ClinicData, pathname: string): RouteMeta | undefined {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return routeMetaFor(data).find((entry) => entry.path === normalized)
}
