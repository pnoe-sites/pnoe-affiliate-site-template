import type { BrandConfig, ClinicData, Package, Service, TeamMember, Testimonial } from '@shared/schemas'
import clinic from '@/data/clinic.json'

// All site content is compiled in from src/data/clinic.json. The published
// site makes no network requests; `npm run validate:data` checks the file's
// shape before every build.
const data = clinic as unknown as ClinicData

// Image paths in clinic.json are root-relative (e.g. /images/team/emily.jpg)
// and served from public/. Absolute URLs pass through untouched.
export function getImageUrl(path: string | undefined): string {
  return path ?? ''
}

// The async surface is kept so every useQuery call site works unchanged.
export const api = {
  config: {
    get: (): Promise<BrandConfig> => Promise.resolve(data.config),
  },
  services: {
    getAll: (category?: string): Promise<Service[]> =>
      Promise.resolve(category ? data.services.filter(s => s.category === category) : data.services),
    getBySlug: (slug: string): Promise<Service> => {
      const service = data.services.find(s => s.slug === slug)
      return service
        ? Promise.resolve(service)
        : Promise.reject(new Error(`Service not found: ${slug}`))
    },
  },
  testimonials: {
    getAll: (): Promise<Testimonial[]> => Promise.resolve(data.testimonials),
  },
  team: {
    getAll: (): Promise<TeamMember[]> => Promise.resolve(data.team),
  },
  packages: {
    getAll: (): Promise<Package[]> => Promise.resolve(data.packages),
  },
}
