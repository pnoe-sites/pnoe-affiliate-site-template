/**
 * Prices, in the currency the clinic actually charges in.
 *
 * The template printed a hard-coded `$` in front of every amount while the data
 * carried a `currency` field beside it, so a clinic in Athens showed `$1200`
 * next to the word `EUR`, and one in London showed a dollar sign for pounds.
 * Intl.NumberFormat knows where the symbol goes, which is not always in front:
 * a euro amount in a European locale reads `1 200 €`.
 */

/** The locale used for grouping and symbol placement. */
const LOCALE = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US'

/**
 * formatPrice renders an amount in a currency.
 *
 * Falls back to `<code> <amount>` for anything Intl refuses (a made-up code, an
 * old browser), which is still readable and still names the currency. Cents are
 * shown only when the amount has them: clinic prices are usually round, and
 * `$250.00` reads like a checkout total rather than a price.
 */
export function formatPrice(amount: number, currency?: string): string {
  const code = (currency ?? 'USD').trim().toUpperCase()
  const hasCents = Math.round(amount * 100) % 100 !== 0
  try {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    }).format(amount)
  } catch {
    return `${code} ${amount}`
  }
}

/** Reads `one-time` / `monthly` / `annual` the way a person says it. */
export function billingLabel(period?: string): string {
  switch (period) {
    case 'monthly':
      return 'per month'
    case 'annual':
      return 'per year'
    case 'one-time':
      return 'one-time'
    default:
      return period ?? ''
  }
}
