import { z } from 'zod'

// ============================================================================
// Brand Configuration Schema
// ============================================================================

// A link the site can send a visitor to: the entry product (an assessment, a
// quiz), a scheduler. Always https, always opened in a new tab.
const ExternalLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
})

// The words on the page that used to be written into the components. Every
// key is optional in the data file; the template's neutral defaults live in
// src/constants/copy.ts and never name a treatment or a kind of business.
export const CopySchema = z.object({
  // Header and section labels
  offeringsLabel: z.string().optional(),
  packagesLabel: z.string().optional(),
  aboutLabel: z.string().optional(),
  bookLabel: z.string().optional(),
  // Home
  homeServicesHeadline: z.string().optional(),
  homeServicesIntro: z.string().optional(),
  serviceAskLine: z.string().optional(),
  missionEyebrow: z.string().optional(),
  missionTitle: z.string().optional(),
  audiencesEyebrow: z.string().optional(),
  audiencesHeadline: z.string().optional(),
  audiencesIntro: z.string().optional(),
  outcomesEyebrow: z.string().optional(),
  outcomesHeadline: z.string().optional(),
  outcomesIntro: z.string().optional(),
  testimonialsEyebrow: z.string().optional(),
  testimonialsHeadline: z.string().optional(),
  ctaHeadline: z.string().optional(),
  ctaBody: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  // Offerings
  offeringsHeadline: z.string().optional(),
  offeringsIntro: z.string().optional(),
  offeringsCaption: z.string().optional(),
  offeringsCtaEyebrow: z.string().optional(),
  offeringsCtaHeadline: z.string().optional(),
  offeringsCtaBody: z.string().optional(),
  // About
  aboutEyebrow: z.string().optional(),
  aboutHeadline: z.string().optional(),
  aboutIntro: z.string().optional(),
  valuesHeadline: z.string().optional(),
  teamHeadline: z.string().optional(),
  teamIntro: z.string().optional(),
  aboutCtaHeadline: z.string().optional(),
  aboutCtaBody: z.string().optional(),
  // Booking
  bookingEyebrow: z.string().optional(),
  bookingHeadline: z.string().optional(),
  bookingIntro: z.string().optional(),
  bookingOnlineTitle: z.string().optional(),
  bookingOnlineBody: z.string().optional(),
  bookingRequestTitle: z.string().optional(),
  bookingRequestBody: z.string().optional(),
  bookingConsent: z.string().optional(),
  consultStepsTitle: z.string().optional(),
  consultSteps: z.array(z.string()).optional(),
  // Packages
  packagesHeadline: z.string().optional(),
  packagesIntro: z.string().optional(),
  packagesCtaEyebrow: z.string().optional(),
  packagesCtaHeadline: z.string().optional(),
  packagesCtaBody: z.string().optional(),
})

export type Copy = z.infer<typeof CopySchema>

export const BrandConfigSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  tagline: z.string().optional(),
  heroImage: z.string().optional(),
  // The first words on the site. Required: the template used to carry its own
  // sentence here as a literal in the page, and a studio's site went live
  // under a headline the studio never wrote.
  hero: z.object({
    headline: z.string().min(1),
    sub: z.string().min(1),
    // The hero's primary button when the business has an entry product (an
    // assessment, a quiz). Without it the primary button is the Book button.
    cta: ExternalLinkSchema.optional(),
  }),
  missionHeadline: z.string().optional(),
  missionBody: z.string().optional(),
  // What this business calls its way of working. Used as the nav label and
  // the eyebrow on the method page, both of which used to read "Holistic Method".
  methodName: z.string().optional(),
  // The method page and the home section that points at it. Absent means the
  // page, its nav item and the home section are not rendered at all: the
  // template used to ship this page with four hard-coded steps naming
  // treatments, and every site published from it claimed them.
  method: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    intro: z.string().min(1),
    steps: z.array(z.object({
      title: z.string().min(1),
      body: z.string().min(1),
      points: z.array(z.string()).optional(),
    })).min(1),
    whyItWorks: z.array(z.object({
      title: z.string(),
      body: z.string(),
    })).optional(),
    cta: z.object({
      headline: z.string(),
      body: z.string(),
    }).optional(),
  }).optional(),
  // A network or group this business belongs to, shown above its name in the
  // footer. Absent shows nothing, which is the only safe default: it is a
  // claim about affiliation.
  networkName: z.string().optional(),

  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),

  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    socials: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).optional(),
  }),

  // Section images for various pages
  images: z.object({
    mission: z.string().optional(),
    method: z.string().optional(),
    ourOfferings: z.string().optional(),
    scheduleConsultation: z.string().optional(),
    aboutUs: z.string().optional(),
  }).optional(),

  // Structured content blocks consumed on the frontend
  heroMeta: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  missionValues: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).optional(),
  whoWeHelpPanels: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    image: z.string().optional(),
  })).optional(),
  outcomes: z.array(z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  // The business's values, shown on About. Three reads best.
  values: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    copy: z.string(),
  })).optional(),
  // Stated next to the packages: turnaround, what is included, how often you
  // would come in. The template used to hardcode three of these, so every
  // site promised a 72-hour onboarding and weekly contact whether or not it
  // offered either. Absent means the row is not shown.
  packageFacts: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  // The groups the Offerings page sorts services into, in display order. A
  // service's `category` must be one of these ids. The template used to fix
  // four medical categories in code, and a training studio's phases had to be
  // filed under "alternative medicine" to render at all.
  serviceCategories: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
  })).optional(),
  // What the business says about its own consultation. These were hard-coded,
  // so every affiliate site promised a reply within 24 hours, a 45-60 minute
  // appointment and evening slots to 8pm regardless of how the business runs.
  booking: z.object({
    // url is the business's own scheduler. When set, every Book button on the
    // site opens it and the request page hands over to it; without it the
    // request page emails the request to contact.email, because the site has
    // no server to post to. noScheduler: true records that the absence is a
    // decision, which is what the release gate asks for. ctaLabel is the
    // header button's text.
    url: z.string().url().optional(),
    noScheduler: z.boolean().optional(),
    ctaLabel: z.string().optional(),
    duration: z.string().optional(),
    format: z.string().optional(),
    confirmationNote: z.string().optional(),
    timeSlots: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
  }).optional(),
  copy: CopySchema.optional(),
  // What the static build writes into each route's <head>. siteUrl is the
  // published address (canonical links, the sitemap and JSON-LD need it);
  // schemaType is the schema.org type for the home page's JSON-LD; routes
  // overrides the derived title or description per path ("/about").
  seo: z.object({
    siteUrl: z.string().url().optional(),
    schemaType: z.string().optional(),
    routes: z.record(z.string(), z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
  }).optional(),
})

export type BrandConfig = z.infer<typeof BrandConfigSchema>

// ============================================================================
// Service Schema
// ============================================================================

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  // One of config.serviceCategories[].id; the validator checks it.
  category: z.string().min(1),
  shortDescription: z.string().optional(),
  longDescription: z.string(),
  duration: z.string().optional(),
  pricing: z.object({
    display: z.enum(['from', 'exact', 'hidden']),
    amount: z.number().optional(),
    currency: z.string().default('USD'),
  }).optional(),
  imageUrl: z.string().optional(),
  pairsWith: z.array(z.string()).optional(),
  contraindications: z.string().optional(),
})

export type Service = z.infer<typeof ServiceSchema>

// ============================================================================
// Testimonial Schema
// ============================================================================

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  // Optional: most businesses publish quotes without a portrait, and the
  // page falls back to the neutral silhouette.
  photo: z.string().optional(),
  quote: z.string(),
  rating: z.number().min(1).max(5).optional(),
})

export type Testimonial = z.infer<typeof TestimonialSchema>

// ============================================================================
// Team Member Schema
// ============================================================================

export const TeamMemberRoleSchema = z.enum([
  'clinician',
  'technician',
  'coordinator',
  'other',
])

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  photo: z.string().optional(),
  role: TeamMemberRoleSchema,
})

export type TeamMember = z.infer<typeof TeamMemberSchema>

// ============================================================================
// Package Schema
// ============================================================================

export const PackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  inclusions: z.array(z.string()),
  pricing: z.object({
    amount: z.number(),
    currency: z.string().default('USD'),
    billingPeriod: z.enum(['one-time', 'monthly', 'annual']).optional(),
  }),
  featured: z.boolean().default(false),
})

export type Package = z.infer<typeof PackageSchema>

// ============================================================================
// Clinic data file (src/data/clinic.json)
// ============================================================================

export const ClinicDataSchema = z.object({
  config: BrandConfigSchema,
  services: z.array(ServiceSchema),
  testimonials: z.array(TestimonialSchema),
  team: z.array(TeamMemberSchema),
  packages: z.array(PackageSchema),
})

export type ClinicData = z.infer<typeof ClinicDataSchema>
