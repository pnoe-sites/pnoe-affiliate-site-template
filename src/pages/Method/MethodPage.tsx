import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { getImageUrl } from '@/lib/api'
import { BookingLink } from '@/components/shared/BookingLink'
import { Navigate } from 'react-router-dom'

/**
 * The business's own account of how it works, from config.method.
 *
 * Every word on this page is the business's. The template used to carry four
 * fixed steps here naming the fictional clinic's treatments, and a training
 * studio's published site claimed them. With no config.method the route sends
 * the visitor home; Header and HomePage already hide the links to it.
 */
export default function MethodPage() {
  const { config, isLoading } = useConfig()
  const copy = copyFor(config)
  const method = config?.method

  if (isLoading) return null
  if (!method) return <Navigate to="/" replace />

  const eyebrow = method.eyebrow ?? config?.methodName ?? 'How we work'

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-24 lg:py-28">
        <div className="container">
          <div className={`grid items-center gap-16 ${config?.images?.method ? 'lg:grid-cols-[minmax(0,1fr)_0.9fr]' : ''}`}>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{eyebrow}</p>
              <h1 className="text-[clamp(2.75rem,4vw,3.75rem)] font-semibold leading-[1.1]">
                {method.headline}
              </h1>
              <p className="text-body-lg text-white/80 max-w-content">
                {method.intro}
              </p>
            </div>
            {config?.images?.method && (
              <div className="relative">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
                  <div className="relative aspect-square overflow-hidden rounded-[28px]">
                    <img
                      src={getImageUrl(config.images.method)}
                      alt={method.headline}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The steps */}
      <section className="bg-gradient-to-b from-pine-green via-deep-forest to-charcoal py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Accordion type="single" collapsible defaultValue={method.steps[0]?.title} className="space-y-4">
              {method.steps.map((step, index) => (
                <AccordionItem
                  key={step.title}
                  value={step.title}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal/40 px-6"
                >
                  <AccordionTrigger className="text-left text-white no-underline hover:no-underline">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-lime-glow">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 text-white/80">
                    <p className="mb-4 text-body leading-relaxed">{step.body}</p>
                    {step.points && step.points.length > 0 && (
                      <ul className="ml-4 list-disc space-y-2 text-sm text-white/70">
                        {step.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Why it works, when the business says so */}
      {method.whyItWorks && method.whyItWorks.length > 0 && (
        <section className="py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {method.whyItWorks.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{item.title}</p>
                  <p className="mt-3 text-sm text-white/75">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-lime-glow/20 via-lime-glow/10 to-transparent py-24 text-white">
        <div className="container text-center space-y-8">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold">
            {method.cta?.headline ?? copy.ctaHeadline}
          </h2>
          <p className="mx-auto max-w-2xl text-body-lg text-white/75">
            {method.cta?.body ?? copy.ctaBody}
          </p>
          <BookingLink className="inline-block">
            <Button
              size="lg"
              className="rounded-full bg-lime-glow px-10 py-6 text-charcoal shadow-[0_15px_40px_rgba(196,255,77,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-lime-glow/90"
            >
              {copy.bookLabel}
            </Button>
          </BookingLink>
        </div>
      </section>
    </div>
  )
}
