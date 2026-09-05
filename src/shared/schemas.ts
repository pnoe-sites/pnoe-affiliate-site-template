import { z } from 'zod'

// ============================================================================
// Brand Configuration Schema
// ============================================================================

export const BrandConfigSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  tagline: z.string().optional(),
  heroImage: z.string().optional(),
  missionHeadline: z.string().optional(),
  missionBody: z.string().optional(),
  // What this clinic calls its way of working. Used as the nav label and the
  // eyebrow on that page, both of which used to read "Holistic Method".
  methodName: z.string().optional(),
  // A network or group this clinic belongs to, shown above its name in the
  // footer. Absent shows nothing, which is the only safe default: it is a
  // claim about affiliation.
  networkName: z.string().optional(),
  holisticHeadline: z.string().optional(),
  holisticBody: z.string().optional(),
  
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
    ourHolisticMethod: z.string().optional(),
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
  // Stated next to the packages: turnaround, what is included, how often you
  // would come in. The template used to hardcode three of these, so every
  // clinic promised a 72-hour onboarding and weekly contact whether or not it
  // offered either. Absent means the row is not shown.
  // The clinic's values, shown on About. Three reads best.
  values: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    copy: z.string(),
  })).optional(),
  packageFacts: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  // What the clinic says about its own consultation. These were hard-coded, so
  // every affiliate site promised a reply within 24 hours, a 45-60 minute
  // appointment and evening slots to 8pm regardless of how the clinic runs.
  booking: z.object({
    // url is the clinic's own scheduler. When set, every Book button on the
    // site opens it and the request page hands over to it; without it the
    // request page emails the request to contact.email, because the site has
    // no server to post to. ctaLabel is the header button's text.
    url: z.string().url().optional(),
    ctaLabel: z.string().optional(),
    duration: z.string().optional(),
    format: z.string().optional(),
    confirmationNote: z.string().optional(),
    timeSlots: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
  }).optional(),
})

export type BrandConfig = z.infer<typeof BrandConfigSchema>

// ============================================================================
// Service Schema
// ============================================================================

export const ServiceCategorySchema = z.enum([
  'tech-therapies',
  'alternative-medicine',
  'biometric-testing',
  'diagnostics',
])

export type ServiceCategory = z.infer<typeof ServiceCategorySchema>

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: ServiceCategorySchema,
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
  photo: z.string(),
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
  photo: z.string(),
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
