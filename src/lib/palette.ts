/**
 * The clinic palette, translated from what the data file carries into what the
 * stylesheet needs.
 *
 * config.colors holds three hexes because that is what a clinic knows about
 * itself. Tailwind needs space-separated RGB channels so it can compose the
 * `/70` opacity modifiers this template uses on almost every muted paragraph
 * (see tailwind.config.ts). This module is the one place that conversion
 * happens.
 *
 * It also derives the two darker primaries. The template's dark sections are
 * tints of the primary rather than colours of their own, and asking a clinic
 * for five colours to describe one brand is asking them to do the design. A
 * clinic that sets a single primary gets a site that is coherently theirs;
 * before this, they got their colour nowhere at all, because the tokens were
 * literal hexes and the three contract fields were dead.
 */

/** Space-separated RGB channels, the form Tailwind's alpha composition needs. */
export type Channels = string

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * toChannels parses "#244C3F" or "244c3f" or "#abc" into "36 76 63".
 *
 * Returns null for anything it does not understand rather than a black
 * fallback: an unreadable colour should leave the template's default in place,
 * not repaint the site in a colour nobody chose.
 */
export function toChannels(hex: string | undefined | null): Channels | null {
  const raw = (hex ?? '').trim()
  const m = HEX.exec(raw)
  if (!m) return null
  let body = m[1]
  if (body.length === 3) {
    body = body[0] + body[0] + body[1] + body[1] + body[2] + body[2]
  }
  const n = parseInt(body, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/**
 * darken scales a channel triple toward black.
 *
 * The two factors are read off the template's own palette: #0F241B is #244C3F
 * at about 0.44, and #183327 at about 0.66. Keeping the same relationship
 * means a new primary produces the same depth of contrast the design was drawn
 * with.
 */
export function darken(channels: Channels, factor: number): Channels {
  return channels
    .split(' ')
    .map((c) => Math.max(0, Math.min(255, Math.round(Number(c) * factor))))
    .join(' ')
}

export const PRIMARY_DEEP_FACTOR = 0.44
export const PRIMARY_SOFT_FACTOR = 0.66

/**
 * The large surfaces, as fractions of the primary. SURFACE_DARK is the top of
 * every hero gradient, SURFACE_DEEP the near-black it fades into, and
 * SURFACE_TINT how far the pale mission band is mixed into white.
 *
 * Read off the template's own values so an unset site keeps its look: the four
 * hand-written hero greens sat between 0.52 and 0.73 of the primary, and this
 * collapses them to one. That is a deliberate loss of incidental variation, in
 * exchange for a clinic's colour reaching the surfaces that dominate the page.
 */
export const SURFACE_DARK_FACTOR = 0.62
export const SURFACE_DEEP_FACTOR = 0.14
export const SURFACE_TINT_MIX = 0.85

/** lighten mixes a channel triple toward white. */
export function lighten(channels: Channels, amount: number): Channels {
  return channels
    .split(' ')
    .map((c) => {
      const v = Number(c)
      return Math.max(0, Math.min(255, Math.round(v + (255 - v) * amount)))
    })
    .join(' ')
}

/**
 * brandVariables maps a clinic's three colours onto the eight CSS variables the
 * palette reads: the three as given, plus the two darker primaries and the
 * three large surfaces derived from the primary. Anything missing or
 * unparseable is simply absent from the result, which leaves index.css's
 * default standing for that one variable.
 */
export function brandVariables(colors: { primary?: string; secondary?: string; accent?: string } | undefined): Record<string, string> {
  const out: Record<string, string> = {}

  const primary = toChannels(colors?.primary)
  if (primary) {
    out['--brand-primary'] = primary
    out['--brand-primary-deep'] = darken(primary, PRIMARY_DEEP_FACTOR)
    out['--brand-primary-soft'] = darken(primary, PRIMARY_SOFT_FACTOR)
    out['--brand-surface-dark'] = darken(primary, SURFACE_DARK_FACTOR)
    out['--brand-surface-deep'] = darken(primary, SURFACE_DEEP_FACTOR)
    out['--brand-surface-tint'] = lighten(primary, SURFACE_TINT_MIX)
  }

  const secondary = toChannels(colors?.secondary)
  if (secondary) out['--brand-secondary'] = secondary

  const accent = toChannels(colors?.accent)
  if (accent) out['--brand-accent'] = accent

  return out
}
