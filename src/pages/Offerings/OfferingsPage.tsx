import { ServiceCard } from '@/components/shared/ServiceCard'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { api, getImageUrl } from '@/lib/api'
import type { Service } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export default function OfferingsPage() {
  const { config } = useConfig()
  
  const { data: servicesData, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.services.getAll(),
  })

  const services = servicesData || []

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  const categoryNames: Record<string, string> = {
    'tech-therapies': 'Technology Therapies',
    'alternative-medicine': 'Alternative Medicine',
    'biometric-testing': 'Biometric Testing',
    'diagnostics': 'Diagnostics',
  }

  const categoryDescriptions: Record<string, string> = {
    'tech-therapies': 'Cutting-edge treatments using the latest technology',
    'alternative-medicine': 'Natural and holistic approaches to wellness',
    'biometric-testing': 'Precise measurements to understand your body',
    'diagnostics': 'Comprehensive health analysis and testing',
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-2/3"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-24 lg:py-28 text-white">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                Clinical Catalog
              </p>
              <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-semibold leading-[1.1]">
                Everything we offer, in one place.
              </h1>
              <p className="max-w-content text-body-lg text-white/75">
                Technology therapies, testing, IV treatments and coaching. Open any one
                to see what it involves and what it costs.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/booking">
                  <Button size="lg" className="rounded-full bg-lime-glow px-8 text-charcoal hover:bg-lime-glow/90">
                    Book a consultation
                  </Button>
                </Link>
                <Link to="/shop" className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white">
                  Explore packages →
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                  {config?.images?.ourOfferings ? (
                    <img
                      src={getImageUrl(config.images.ourOfferings)}
                      alt="Our Offerings"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                      Our Offerings Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.4em] text-white/70">
                    precision-led care
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24">
        <div className="container space-y-24">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="space-y-10">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{categoryNames[category] || category}</p>
                <h2 className="text-3xl font-semibold leading-tight">
                  {categoryDescriptions[category] || 'Our services'}
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-pine-green to-deep-forest py-24 text-white">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Not sure where to start?</p>
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold">
              We will help you choose.
            </h2>
            <p className="text-body-lg text-white/80 max-w-content">
              Book a consultation and we will work out which tests and treatments make sense for you, and which do not.
            </p>
            <Link to="/booking" className="inline-block">
              <Button
                size="lg"
                className="rounded-full bg-lime-glow px-8 py-5 text-charcoal shadow-[0_15px_40px_rgba(196,255,77,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-lime-glow/90"
              >
                Schedule consultation
              </Button>
            </Link>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/15">
            <div className="relative aspect-[4/3]">
              {config?.images?.scheduleConsultation ? (
                <img
                  src={getImageUrl(config.images.scheduleConsultation)}
                  alt="Schedule a Consultation"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                  Schedule Consultation Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
