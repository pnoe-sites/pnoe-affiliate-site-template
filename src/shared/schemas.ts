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
