import type { BrandConfig, Copy } from '@shared/schemas'

/**
 * The template's own words, used wherever config.copy says nothing.
 *
 * Every default here has to be true of a business that has written nothing
 * about itself, so none of them names a treatment, a kind of premises or a
 * kind of visitor. The lines they replaced were written for a fictional
 * testing clinic and went live, word for word, on a training studio's site.
 * scripts/check-copy.mjs fails the lint when such a word comes back.
 *
 * `{business}` in a value is replaced with config.name at render time.
 */
export const defaultCopy: Required<Copy> = {
  offeringsLabel: 'Offerings',
  packagesLabel: 'Packages',
  aboutLabel: 'About',
  bookLabel: 'Book a consultation',

  homeServicesHeadline: 'What we offer',
  homeServicesIntro: 'Open any one to see what it involves.',
  serviceAskLine: 'Ask us what this would involve for you.',
  missionEyebrow: 'Why choose us?',
  missionTitle: 'The {business} Advantage',
  audiencesEyebrow: 'Who we help',
  audiencesHeadline: 'The people we see most',
  audiencesIntro: 'Each group works with us a little differently. Here is what that looks like.',
  outcomesEyebrow: 'Outcomes',
  outcomesHeadline: 'What people come to us for',
  outcomesIntro: 'The changes people ask about most often, and what we track to know whether they are happening.',
  testimonialsEyebrow: 'Testimonials',
  testimonialsHeadline: 'What clients say',
  ctaHeadline: 'Ready to book?',
  ctaBody: 'Tell us what you need and we will find a time.',
  ctaSecondaryLabel: 'See what we offer',

  offeringsHeadline: 'Everything we offer, in one place.',
  offeringsIntro: 'Open any one to see what it involves.',
  offeringsCaption: 'What we offer',
  offeringsCtaEyebrow: 'Not sure where to start?',
  offeringsCtaHeadline: 'We will help you choose.',
  offeringsCtaBody: 'Book a consultation and we will work out which of these make sense for you, and which do not.',

  aboutEyebrow: 'Inside {business}',
  aboutHeadline: 'About us',
  aboutIntro: 'The people who will look after you, and how we work.',
  valuesHeadline: 'Our values',
  teamHeadline: 'Meet the team',
  teamIntro: 'The people you will meet.',
  aboutCtaHeadline: 'Work with our team',
  aboutCtaBody: 'Book a consultation and we will match you with the right person.',

  bookingEyebrow: 'Schedule',
  bookingHeadline: 'Book a consultation',
  bookingIntro: 'Tell us what you need and we will come back to you with times.',
  bookingOnlineTitle: 'Book online',
  bookingOnlineBody: 'Pick a time in our calendar. It opens in a new tab.',
  bookingRequestTitle: 'Request a consultation',
  bookingRequestBody: 'Fill this in. It opens as an email from your mail app; send it and we will confirm a time.',
  bookingConsent: 'By sending, you agree that we may contact you about this request.',
  consultStepsTitle: 'During the consult',
  consultSteps: [
    'Go through your goals and history',
    'Look at which of our services apply',
    'Agree the first steps and when to review them',
  ],

  packagesHeadline: 'Packages that bundle what most people need, at one price.',
  packagesIntro: 'Each one groups several of our services so you are not choosing them one at a time.',
  packagesCtaEyebrow: 'Need guidance?',
  packagesCtaHeadline: 'Not sure which package is yours? We will build it with you.',
  packagesCtaBody: 'Book a consultation first. We will tell you which package fits, or that none of them does.',
}

type CopyKey = keyof Copy

// What the two name-carrying lines say for the one frame before the config
// query resolves, so the page never reads "Inside Our".
const NAMELESS: Partial<Record<CopyKey, string>> = {
  missionTitle: 'Our advantage',
  aboutEyebrow: 'About us',
}

/**
 * useCopy-free accessor: the configured line for `key`, else the default,
 * with `{business}` filled in. Pages call `copyFor(config)` once and read
 * keys off the result, so a missing key never renders as `undefined`.
 */
export function copyFor(config: BrandConfig | null | undefined): Required<Copy> {
  const name = config?.name?.trim() || ''
  const merged: Record<string, unknown> = { ...defaultCopy }
  for (const [key, value] of Object.entries(config?.copy ?? {})) {
    if (value !== undefined && value !== null && value !== '') merged[key] = value
  }
  for (const key of Object.keys(merged) as CopyKey[]) {
    const value = merged[key]
    if (typeof value !== 'string' || !value.includes('{business}')) continue
    merged[key] = name ? value.replace('{business}', name) : (NAMELESS[key] ?? value.replace(/\s*\{business\}\s*/, ' ').trim())
  }
  return merged as Required<Copy>
}
