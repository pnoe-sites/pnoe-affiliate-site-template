import type { BrandConfig } from '@shared/schemas'

/**
 * brandLabel builds a section label that carries the CLINIC's name.
 *
 * The template shipped these labels with the template author's name written
 * into them ("The PNOĒ Advantage", "Inside PNOĒ", "PNOĒ Method", "PNOĒ
 * Packages"). Every affiliate site published from it therefore told visitors
 * it belonged to someone else: a clinic's About page headed "Inside PNOĒ"
 * under its own logo. It is the clinic's own offering the label describes, so
 * the clinic's own name is what belongs in it.
 *
 * pattern carries `{clinic}` where the name goes. fallback is used when the
 * site has no name yet, which happens for the seconds before the config query
 * resolves and for a data file that has not been filled in; it must read as a
 * finished sentence on its own rather than as a gap.
 */
export function brandLabel(config: BrandConfig | null | undefined, pattern: string, fallback: string): string {
  const name = config?.name?.trim()
  return name ? pattern.replace('{clinic}', name) : fallback
}

/** clinicName is the site's name, or a neutral stand-in before it loads. */
export function clinicName(config: BrandConfig | null | undefined): string {
  return config?.name?.trim() || 'Clinic'
}
