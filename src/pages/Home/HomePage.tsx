import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { defaultMissionValues } from '@/constants/missionValues'
import { api, getImageUrl } from '@/lib/api'
import type { Service, Testimonial } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  ArrowUpRight,
  CheckCircle,
  Crosshair,
  Headphones,
  Heart,
  MoveRight,
  Sparkles,
  Target,
  Trophy,
  Zap,
  type LucideIcon
} from 'lucide-react'
import { BookingLink } from '@/components/shared/BookingLink'
import { Link } from 'react-router-dom'
const missionIconMap: Record<string, LucideIcon> = {
  target: Target,
  heart: Heart,
  activity: Activity,
  check: CheckCircle,
  trophy: Trophy,
  focus: Crosshair,
  support: Headphones,
  sparkles: Sparkles,
  zap: Zap,
}

const getMissionIcon = (key?: string): LucideIcon => {
  if (!key) return Activity
  return missionIconMap[key.toLowerCase()] || Activity
}

export default function HomePage() {
  const { config } = useConfig()
  const copy = copyFor(config)

  const { data: servicesData } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.services.getAll(),
  })

  const { data: testimonialsData } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => api.testimonials.getAll(),
  })

  const services = servicesData || []
  const testimonials = testimonialsData || []
  const defaultPersonPhoto = getImageUrl('/images/defaults/person.png')
  const hero = config?.hero
  const heroMeta = config?.heroMeta ?? []
  const missionValues = config?.missionValues ?? []
  const whoWeHelpPanels = config?.whoWeHelpPanels ?? []
  const outcomes = config?.outcomes ?? []
  const method = config?.method
  const categoryNames = new Map((config?.serviceCategories ?? []).map((c) => [c.id, c.name]))

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{
          backgroundImage: config?.heroImage
            ? `linear-gradient(rgba(5, 12, 9, 0.75), rgba(5, 12, 9, 0.75)), url(${getImageUrl(config.heroImage)})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {!config?.heroImage && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))]" />
        )}
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {config?.tagline && (
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{config.tagline}</p>
            )}
            <h1 className="text-[clamp(3rem,6vw,4.55rem)] font-bold leading-[1.05]">
              {hero?.headline}
            </h1>
            <p className="text-body-lg text-white/90 leading-relaxed max-w-content mx-auto">
              {hero?.sub}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 pt-4">
              {/* The entry product, when the business has one, is the first
                  button; the Book button is then the second. */}
              {hero?.cta ? (
                <>
                  <a href={hero.cta.url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-white text-deep-forest px-8 py-6">
                      {hero.cta.label}
                    </Button>
                  </a>
                  <BookingLink className="text-sm font-semibold text-lime-glow inline-flex items-center gap-2">
                    {copy.bookLabel} <MoveRight className="h-4 w-4" />
                  </BookingLink>
                </>
              ) : (
                <>
                  <BookingLink>
                    <Button size="lg" className="bg-white text-deep-forest px-8 py-6">
                      {copy.bookLabel}
                    </Button>
                  </BookingLink>
                  <Link to="/offerings" className="text-sm font-semibold text-lime-glow inline-flex items-center gap-2">
                    {copy.ctaSecondaryLabel} <MoveRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
            {heroMeta.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-3 pt-6 max-w-3xl mx-auto">
                {heroMeta.map((meta) => (
                  <div key={meta.label} className="rounded-[16px] border border-white/10 bg-white/5 px-5 py-6 backdrop-blur">
                    <p className="text-xs tracking-[0.4em] uppercase text-white/60">{meta.label}</p>
                    <p className="text-2xl font-semibold mt-3">{meta.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission / Values */}
      {(config?.missionHeadline || config?.missionBody) && (
        <section className="bg-[rgb(var(--brand-surface-tint))] py-24 text-forest-green">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_1fr] items-center">
              <div className="space-y-6 max-w-2xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-forest-green/60">{copy.missionEyebrow}</p>
                  <h2 className="mt-4 text-[clamp(2.6rem,4vw,3.6rem)] font-semibold leading-tight text-forest-green">
                    {copy.missionTitle}
                  </h2>
                </div>
                {config?.missionHeadline && (
                  <p className="text-body-lg text-forest-green/80 leading-relaxed">
                    {config.missionHeadline}
                  </p>
                )}
                {config?.missionBody && (
                  <p className="text-body text-forest-green/70 leading-relaxed">
                    {config.missionBody}
                  </p>
                )}
              </div>
              <div className="space-y-5">
                {(missionValues.length > 0 ? missionValues : defaultMissionValues)
                  .slice(0, 4)
                  .map((value) => {
                    const Icon = getMissionIcon(value.icon)
                    return (
                      <div key={value.title} className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_15px_45px_rgba(10,40,24,0.15)]">
                          <Icon className="h-7 w-7 text-forest-green" />
                        </div>
                        <div className="flex-1 rounded-[999px] bg-white px-6 py-5 shadow-[0_20px_60px_rgba(9,39,24,0.12)]">
                          <p className="text-base font-semibold leading-tight text-forest-green">{value.title}</p>
                          {value.description && (
                            <p className="mt-1 text-sm text-forest-green/70 leading-relaxed">{value.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Accordion */}
      {services.length > 0 && (
        <section className="bg-[#f6f6f6] py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-left">
              <p className="text-xs tracking-[0.35em] uppercase text-forest-green/70">{copy.offeringsLabel}</p>
              <h2 className="mt-4 text-[2.8rem] font-semibold leading-[1.05] text-forest-green">{copy.homeServicesHeadline}</h2>
              <p className="mt-4 max-w-2xl text-body-lg text-off-black/80">
                {copy.homeServicesIntro}
              </p>
            </div>
            <div className="mt-16">
              <Accordion
                type="single"
                collapsible
                className="divide-y divide-forest-green/15 border-y border-forest-green/15"
              >
                {services.map((service, index) => (
                  <AccordionItem
                    value={`service-${service.id}`}
                    key={service.id}
                    className="group border-0"
                  >
                    <AccordionTrigger className="group flex w-full items-center gap-8 py-6 text-left text-forest-green no-underline transition-colors hover:bg-white/70 hover:no-underline data-[state=open]:no-underline">
                      <div className="flex items-baseline gap-6">
                        <p className="text-xs uppercase tracking-[0.5em] text-forest-green/60">{String(index + 1).padStart(2, '0')}</p>
                        <div>
                          <h3 className="text-[1.9rem] font-semibold leading-tight">{service.title}</h3>
                          {service.shortDescription && (
                            <p className="mt-2 text-sm text-forest-green/70 max-w-xl">{service.shortDescription}</p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-10 text-body text-off-black/80">
                      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
                        <div className="space-y-5">
                          <p className="text-base leading-relaxed">
                            {service.longDescription || service.shortDescription}
                          </p>
                          <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green">
                            Read more <MoveRight className="h-4 w-4" />
                          </Link>
                        </div>
                        <div className="space-y-4">
                          {service.imageUrl && (
                            <div className="rounded-[14px] overflow-hidden shadow-[0_25px_70px_rgba(10,20,15,0.15)]">
                              <img
                                src={getImageUrl(service.imageUrl)}
                                alt={service.title}
                                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="rounded-[14px] border border-forest-green/10 bg-white/80 p-6 shadow-inner">
                            {categoryNames.get(service.category) && (
                              <>
                                <p className="text-xs uppercase tracking-[0.4em] text-forest-green/50">Category</p>
                                <p className="mt-3 text-base font-semibold text-forest-green">
                                  {categoryNames.get(service.category)}
                                </p>
                              </>
                            )}
                            <p className="mt-2 text-sm text-forest-green/70">
                              {copy.serviceAskLine}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* The method, only when the business has written one */}
      {method && (
        <section className="relative">
          <div className="bg-forest-green text-white">
            <div className="container py-24">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] lg:items-start">
                <div className="space-y-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">{config?.methodName ?? 'How we work'}</p>
                  <h2 className="text-[3.2rem] font-semibold leading-tight">
                    {method.headline}
                  </h2>
                  <p className="text-lg text-white/85 leading-relaxed">
                    {method.intro}
                  </p>
                </div>
                <div className="flex lg:justify-end">
                  <Link to="/method" className="text-sm font-semibold text-lime-200 inline-flex items-center gap-2">
                    {config?.methodName ?? 'How we work'} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {config?.images?.method && (
            <div className="container -mt-16">
              <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-[0_60px_160px_rgba(0,0,0,0.55)] group">
                <img
                  src={getImageUrl(config.images.method)}
                  alt={config.methodName ?? method.headline}
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Who We Help */}
      {whoWeHelpPanels.length > 0 && (
        <section className="bg-charcoal py-24 text-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.3em] uppercase text-white/60">{copy.audiencesEyebrow}</p>
              <h2 className="text-[2.5rem] font-semibold mt-4">{copy.audiencesHeadline}</h2>
              <p className="text-body-lg text-white/65 mt-4">
                {copy.audiencesIntro}
              </p>
            </div>
            <div className="mt-16">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {whoWeHelpPanels.map((panel) => (
                  <div key={panel.id} className="flex flex-col items-center text-center rounded-[18px] border border-white/10 bg-graphite/80 px-6 py-12 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                    <span className="text-[3.5rem] font-semibold text-lime-glow">{panel.id}</span>
                    <h3 className="text-xl font-semibold mt-6">{panel.title}</h3>
                    <p className="text-sm text-white/70 mt-3">{panel.description}</p>
                    {panel.image && (
                      <div className="w-24 h-24 rounded-[12px] overflow-hidden mt-8 group">
                        <img
                          src={getImageUrl(panel.image)}
                          alt={panel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <span className="mt-6 text-xs font-semibold tracking-[0.3em] text-white/40 uppercase">{panel.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Outcomes Section */}
      {outcomes.length > 0 && (
        <section className="bg-pine-green py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.3em] uppercase text-white/70">{copy.outcomesEyebrow}</p>
              <h2 className="text-[2.5rem] font-semibold text-white mt-4">{copy.outcomesHeadline}</h2>
              <p className="text-body-lg text-white/75 leading-relaxed mt-4">
                {copy.outcomesIntro}
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-[18px] bg-white/10 border border-white/15 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.4)] flex flex-col gap-4 backdrop-blur">
                  <span className="text-xs uppercase tracking-[0.45em] text-white/60">{outcome.label}</span>
                  <h3 className="text-2xl font-semibold text-white">{outcome.title}</h3>
                  <p className="text-body text-white/80 flex-1">{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-[#050505] py-24 relative overflow-hidden">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.35em] uppercase text-white/60">{copy.testimonialsEyebrow}</p>
              <h2 className="text-[2.5rem] font-semibold text-white mt-4">{copy.testimonialsHeadline}</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <Carousel opts={{ align: 'start', loop: true }}>
                <CarouselContent>
                  {testimonials.map((testimonial) => {
                    const photoSrc = testimonial.photo
                      ? getImageUrl(testimonial.photo)
                      : defaultPersonPhoto

                    return (
                      <CarouselItem key={testimonial.id} className="md:basis-full">
                      <div className="rounded-[20px] bg-[radial-gradient(circle_at_top,#1b1b1b,#070707)] border border-white/10 shadow-[0_35px_120px_rgba(0,0,0,0.65)] p-10">
                        <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] items-center">
                          <div className="flex flex-col items-center text-center">
                            <div className="h-28 w-28 rounded-full overflow-hidden border border-white/20">
                              <img
                                src={photoSrc}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xl font-semibold text-[#c4ff4d] mt-4">{testimonial.name}</p>
                            <p className="text-sm text-white/60">{testimonial.role}</p>
                          </div>
                          <div>
                            <p className="text-2xl md:text-3xl font-semibold text-white leading-tight">“{testimonial.quote}”</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious className="border-white/30 text-white" />
                <CarouselNext className="border-white/30 text-white" />
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-deep-forest text-white py-24">
        <div className="container text-center">
          <h2 className="text-h2 font-semibold mb-6">{copy.ctaHeadline}</h2>
          <p className="text-body-lg mb-12 max-w-content mx-auto opacity-95 leading-relaxed">
            {copy.ctaBody}
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <BookingLink>
              <Button size="lg" className="bg-white text-forest-green hover:bg-white/90">
                {copy.bookLabel}
              </Button>
            </BookingLink>
            <Link to="/offerings">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-forest-green">
                {copy.ctaSecondaryLabel}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
