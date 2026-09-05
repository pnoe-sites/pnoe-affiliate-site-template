import { ServiceCard } from '@/components/shared/ServiceCard'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { api, getImageUrl } from '@/lib/api'
import type { Service } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { BookingLink } from '@/components/shared/BookingLink'

export default function OfferingsPage() {
  const { config } = useConfig()
  const copy = copyFor(config)

  const { data: servicesData, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.services.getAll(),
  })

  const services = servicesData || []

  // Groups in the order config.serviceCategories lists them; a service whose
  // category is not declared (the validator refuses that) would land in a
  // trailing unnamed group rather than vanish.
  const categories = config?.serviceCategories ?? []
  const declared = new Set(categories.map((c) => c.id))
  const groups = categories
    .map((category) => ({ category, services: services.filter((s) => s.category === category.id) }))
    .filter((group) => group.services.length > 0)
  const undeclared = services.filter((s) => !declared.has(s.category))
  if (undeclared.length > 0) {
    groups.push({ category: { id: 'other', name: copy.offeringsCaption, description: undefined }, services: undeclared })
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
          <div className={`grid items-center gap-16 ${config?.images?.ourOfferings ? 'lg:grid-cols-[minmax(0,1fr)_0.9fr]' : ''}`}>
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                {copy.offeringsLabel}
              </p>
              <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-semibold leading-[1.1]">
                {copy.offeringsHeadline}
              </h1>
              <p className="max-w-content text-body-lg text-white/75">
                {copy.offeringsIntro}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <BookingLink>
                  <Button size="lg" className="rounded-full bg-lime-glow px-8 text-charcoal hover:bg-lime-glow/90">
                    {copy.bookLabel}
                  </Button>
                </BookingLink>
              </div>
            </div>
            {config?.images?.ourOfferings && (
              <div className="relative">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                    <img
                      src={getImageUrl(config.images.ourOfferings)}
                      alt={copy.offeringsLabel}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.4em] text-white/70">
                      {copy.offeringsCaption}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24">
        <div className="container space-y-24">
          {groups.map(({ category, services: categoryServices }) => (
            <div key={category.id} className="space-y-10">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{category.name}</p>
                {category.description && (
                  <h2 className="text-3xl font-semibold leading-tight">
                    {category.description}
                  </h2>
                )}
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.id} service={service} categoryName={category.id === 'other' ? undefined : category.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-pine-green to-deep-forest py-24 text-white">
        <div className={`container grid items-center gap-12 ${config?.images?.scheduleConsultation ? 'lg:grid-cols-2' : ''}`}>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">{copy.offeringsCtaEyebrow}</p>
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold">
              {copy.offeringsCtaHeadline}
            </h2>
            <p className="text-body-lg text-white/80 max-w-content">
              {copy.offeringsCtaBody}
            </p>
            <BookingLink className="inline-block">
              <Button
                size="lg"
                className="rounded-full bg-lime-glow px-8 py-5 text-charcoal shadow-[0_15px_40px_rgba(196,255,77,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-lime-glow/90"
              >
                {copy.bookLabel}
              </Button>
            </BookingLink>
          </div>
          {config?.images?.scheduleConsultation && (
            <div className="overflow-hidden rounded-[28px] border border-white/15">
              <div className="relative aspect-[4/3]">
                <img
                  src={getImageUrl(config.images.scheduleConsultation)}
                  alt={copy.bookLabel}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
