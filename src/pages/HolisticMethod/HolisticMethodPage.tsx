import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { getImageUrl } from '@/lib/api'
import { Link } from 'react-router-dom'

export default function HolisticMethodPage() {
  const { config } = useConfig()

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-24 lg:py-28">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{config?.methodName ?? 'How we work'}</p>
              <h1 className="text-[clamp(2.75rem,4vw,3.75rem)] font-semibold leading-[1.1]">
                How we work
              </h1>
              <p className="text-body-lg text-white/80 max-w-content">
                Four steps: measure, optimise, enhance, sustain. Each one uses what the
                one before it found.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-square overflow-hidden rounded-[28px]">
                  {config?.images?.ourHolisticMethod ? (
                    <img
                      src={getImageUrl(config.images.ourHolisticMethod)}
                      alt="Our Holistic Method"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                      Holistic Method Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.4em] text-white/70">
                    four pillars
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-y border-white/5 py-24">
        <div className="container">
          <p className="mx-auto max-w-3xl text-center text-body-lg text-white/75">
            Numbers on their own do not tell you what to do. We turn results into a plan you can follow, and revisit it when the next set of results comes in.
          </p>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-gradient-to-b from-pine-green via-deep-forest to-charcoal py-24">
        <div className="container">
          <h2 className="text-center text-[clamp(2rem,3vw,3rem)] font-semibold text-white">The four steps</h2>
          <div className="mx-auto mt-16 max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  value: 'measure',
                  icon: '',
                  title: '1. Measure',
                  subtitle: 'Understand your baseline',
                  body: 'Everything starts with data. We use advanced biometric testing including VO₂ Max, RMR, and comprehensive lab work to establish your unique biological baseline.',
                  bullets: [
                    'VO₂ Max testing for cardiovascular capacity',
                    'Metabolic rate analysis for personalized nutrition',
                    'Comprehensive blood panels for hormones and inflammation',
                    'Body composition and vital sign tracking',
                  ],
                },
                {
                  value: 'optimize',
                  icon: '',
                  title: '2. Optimize',
                  subtitle: 'Address deficiencies and imbalances',
                  body: 'Using your test results, we implement targeted interventions to bring your body back into balance.',
                  bullets: [
                    'Custom IV therapy formulations for nutrient optimization',
                    'Pharmaceutical-grade supplementation protocols',
                    'Hormone balancing strategies when indicated',
                    'Sleep and stress recalibration frameworks',
                  ],
                },
                {
                  value: 'enhance',
                  icon: '',
                  title: '3. Enhance',
                  subtitle: 'Amplify performance and recovery',
                  body: 'Once the basics are in order, we add therapies aimed at recovery and performance.',
                  bullets: [
                    'Red-light therapy for mitochondrial energy',
                    'Cryotherapy for inflammation control',
                    'Hyperbaric oxygen for regeneration',
                    'Training protocols tuned to VO₂ data',
                  ],
                },
                {
                  value: 'sustain',
                  icon: '',
                  title: '4. Sustain',
                  subtitle: 'Build long-term healthy habits',
                  body: 'We embed the protocol into your life with coaching, accountability, and regular recalibration.',
                  bullets: [
                    'Quarterly testing and progress reviews',
                    'Lifestyle coaching across nutrition, sleep, and stress',
                    'Sustainable supplementation calendars',
                    'Community support and accountability loops',
                  ],
                },
              ].map((pillar) => (
                <AccordionItem
                  key={pillar.value}
                  value={pillar.value}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal/40 px-6"
                >
                  <AccordionTrigger className="text-left text-white no-underline hover:no-underline">
                    <div className="flex items-center gap-4">
                      {pillar.icon && (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                          <span>{pillar.icon}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                        <p className="text-sm text-white/60">{pillar.subtitle}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 text-white/80">
                    <p className="mb-4 text-body leading-relaxed">{pillar.body}</p>
                    <ul className="ml-4 list-disc space-y-2 text-sm text-white/70">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24">
        <div className="container">
          <h2 className="text-center text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold text-white">Why this works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              {
                label: 'Personalization',
                copy: 'Every decision comes from your own results rather than from an average.',
              },
              {
                label: 'Integration',
                copy: 'Each step feeds the next, so you are not collecting unrelated treatments.',
              },
              {
                label: 'Evidence-Based',
                copy: 'Every therapy we offer is one we can point to research for, and measure the result of.',
              },
              {
                label: 'Sustainable',
                copy: 'A plan you can keep up with beats a better plan you cannot. Coaching and retesting are part of it.',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{item.label}</p>
                <p className="mt-3 text-sm text-white/75">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-lime-glow/20 via-lime-glow/10 to-transparent py-24 text-white">
        <div className="container text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Getting started</p>
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold">
            Ready to start?
          </h2>
          <p className="mx-auto max-w-2xl text-body-lg text-white/75">
            Book a consultation and we will map out the first three months with you.
          </p>
          <Link to="/booking" className="inline-block">
            <Button
              size="lg"
              className="rounded-full bg-lime-glow px-10 py-6 text-charcoal shadow-[0_15px_40px_rgba(196,255,77,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-lime-glow/90"
            >
              Schedule your consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
