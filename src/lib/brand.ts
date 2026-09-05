import type { BrandConfig } from '@shared/schemas'

/**
 * brandLabel builds a section label that carries the BUSINESS's name.
 *
 * The template shipped these labels with the template author's name written
 * into them ("The PNOĒ Advantage", "Inside PNOĒ", "PNOĒ Method", "PNOĒ
 * Packages"). Every affiliate site published from it therefore told visitors
 * it belonged to someone else: an About page headed "Inside PNOĒ" under the
 * business's own logo. It is the business's own offering the label describes,
 * so its own name is what belongs in it.
 *
 * pattern carries `{business}` where the name goes. fallback is used when the
 * site has no name yet, which happens for the seconds before the config query
 * resolves; it must read as a finished sentence on its own rather than as a gap.
 */
export function brandLabel(config: BrandConfig | null | undefined, pattern: string, fallback: string): string {
  const name = config?.name?.trim()
  return name ? pattern.replace('{business}', name) : fallback
}

/** businessName is the site's name, or nothing before it loads. */
export function businessName(config: BrandConfig | null | undefined): string {
  return config?.name?.trim() || ''
}
