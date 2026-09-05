import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { Card, CardContent } from '@/components/ui/card'
import { api, getImageUrl } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import type { Service } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Clock, DollarSign, Link as LinkIcon } from 'lucide-react'
import { BookingLink } from '@/components/shared/BookingLink'
import { Link, Navigate, useParams } from 'react-router-dom'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { config } = useConfig()
  const copy = copyFor(config)
  
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ['service', slug],
    queryFn: () => api.services.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-1/2 rounded bg-muted" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-6 rounded bg-muted" />
              <div className="h-6 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
            </div>
            <div className="h-64 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return <Navigate to="/offerings" replace />
  }

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-20">
        <div className="container space-y-6">
          <Link
            to="/offerings"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
          >
            ← {copy.offeringsLabel}
          </Link>
          <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-semibold leading-tight">{service.title}</h1>
          {service.shortDescription && (
            <p className="max-w-3xl text-body-lg text-white/75">{service.shortDescription}</p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_1fr]">
          {/* Left Column - Text Content */}
          <div className="space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Overview</p>
              <p className="mt-4 text-base leading-relaxed text-white/75">{service.longDescription}</p>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {service.duration && (
                <Card className="rounded-2xl border border-white/10 bg-white/5 text-white">
                  <CardContent className="flex items-start gap-3 p-5">
                    <Clock className="h-5 w-5 text-lime-glow" />
                    <div>
                      <p className="text-sm font-semibold">Duration</p>
                      <p className="text-sm text-white/70">{service.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* An amount is required, not just a display mode: a service priced
                  'exact' with the amount left blank used to render "$undefined". */}
              {service.pricing && service.pricing.display !== 'hidden' && service.pricing.amount != null && (
                <Card className="rounded-2xl border border-white/10 bg-white/5 text-white">
                  <CardContent className="flex items-start gap-3 p-5">
                    <DollarSign className="h-5 w-5 text-lime-glow" />
                    <div>
                      <p className="text-sm font-semibold">Pricing</p>
                      <p className="text-sm text-white/70">
                        {service.pricing.display === 'from' ? 'From ' : ''}
                        {formatPrice(service.pricing.amount, service.pricing.currency)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {service.contraindications && (
              <Card className="rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 to-transparent text-white">
                <CardContent className="flex gap-4 p-6">
                  <AlertCircle className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="font-semibold text-amber-200">Contraindications</p>
                    <p className="mt-2 text-sm text-amber-100/80">{service.contraindications}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {service.pairsWith && service.pairsWith.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <LinkIcon className="h-5 w-5" />
                  Pairs well with
                </h3>
                <div className="flex flex-wrap gap-3">
                  {service.pairsWith.map((pairedSlug) => (
                    <Link key={pairedSlug} to={`/services/${pairedSlug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full border border-white/20 bg-transparent text-white/80 hover:border-lime-glow/60 hover:text-lime-glow"
                      >
                        {pairedSlug
                          .split('-')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <BookingLink>
                <Button className="rounded-full bg-lime-glow px-8 py-6 text-charcoal hover:bg-lime-glow/90">
                  {copy.bookLabel}
                </Button>
              </BookingLink>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[32px] border border-white/10">
              <div className="relative aspect-[4/3] bg-white/5">
                {service.imageUrl ? (
                  <img
                    src={getImageUrl(service.imageUrl)}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
