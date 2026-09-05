import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { defaultMissionValues } from '@/constants/missionValues'
import { api, getImageUrl } from '@/lib/api'
import type { TeamMember } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  ArrowUpRight,
  CheckCircle,
  Crosshair,
  Headphones,
  Heart,
  Target,
  Trophy,
  type LucideIcon,
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
}

const getMissionIcon = (key?: string): LucideIcon => {
  if (!key) return Activity
  return missionIconMap[key.toLowerCase()] || Activity
}

const DEFAULT_VALUES = [
  { icon: '💬', title: 'We explain', copy: 'You should leave understanding your results, not holding a printout of them.' },
  { icon: '👥', title: 'We stay with it', copy: 'The same team follows your progress, so you are not repeating yourself.' },
  { icon: '📋', title: 'We write it down', copy: 'Every visit ends with the next step agreed and recorded.' },
]

export default function AboutPage() {
  const { config } = useConfig()
  const copy = copyFor(config)

  const { data: teamData, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => api.team.getAll(),
  })

  const team = teamData || []
  const missionValues = config?.missionValues ?? []
  // The business's values, or a default that claims nothing on its behalf. The
  // three that shipped asserted peer-reviewed backing for every recommendation
  // and progress tracked against objective data, on the site of any business
  // that left this alone.
  const values = config?.values?.length ? config.values : DEFAULT_VALUES
  const method = config?.method
  const defaultPersonPhoto = getImageUrl('/images/defaults/person.png')

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-24 text-white">
        <div className="container">
          <div className={`grid gap-12 items-center ${config?.images?.aboutUs ? 'lg:grid-cols-2' : ''}`}>
            <div className="space-y-6 max-w-content">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">{copy.aboutEyebrow}</p>
              <h1 className="text-hero-mobile md:text-h1 font-bold leading-[1.05]">{copy.aboutHeadline}</h1>
              <p className="text-body-lg text-white/80 leading-relaxed">
                {copy.aboutIntro}
              </p>
            </div>
            {config?.images?.aboutUs && (
              <div className="rounded-[18px] aspect-video overflow-hidden shadow-[0_35px_120px_rgba(0,0,0,0.45)] group">
                <img
                  src={getImageUrl(config.images.aboutUs)}
                  alt={copy.aboutHeadline}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
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

      {/* The method, when the business has written one */}
      {method && (
        <section className="relative">
          <div className="bg-forest-green text-white">
            <div className="container py-24">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] lg:items-start">
                <div className="space-y-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">{config?.methodName ?? 'How we work'}</p>
                  <h2 className="text-[3rem] font-semibold leading-tight">{method.headline}</h2>
                  <p className="text-lg text-white/85 leading-relaxed">{method.intro}</p>
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
                  className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Values */}
      <section className="bg-charcoal py-24 text-white">
        <div className="container">
          <h2 className="text-h2 font-semibold text-center mb-16">{copy.valuesHeadline}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="rounded-[18px] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mx-auto mb-4 text-3xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-body text-white/70 leading-relaxed">{value.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {(isLoading || team.length > 0) && (
        <section className="container py-24">
          <h2 className="text-h2 font-semibold text-center mb-6 text-forest-green">{copy.teamHeadline}</h2>
          <p className="text-center text-body-lg text-off-white mb-16 max-w-2xl mx-auto">
            {copy.teamIntro}
          </p>

          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 w-20 bg-pale-sage rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {team.map((member) => (
                <div key={member.id} className="rounded-[18px] border border-white/10 bg-white/5 p-6 text-center">
                  <div className="mx-auto h-28 w-28 rounded-full overflow-hidden border-2 border-forest-green/20">
                    <img
                      src={member.photo ? getImageUrl(member.photo) : defaultPersonPhoto}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-lime-glow">{member.title}</p>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-deep-forest text-white py-24">
        <div className="container text-center">
          <h2 className="text-h2 font-semibold mb-6">{copy.aboutCtaHeadline}</h2>
          <p className="text-body-lg mb-10 max-w-2xl mx-auto opacity-90">
            {copy.aboutCtaBody}
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
      </section>
    </div>
  )
}
