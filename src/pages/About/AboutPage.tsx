import { Button } from '@/components/ui/button'
import { useConfig } from '@/config/ConfigProvider'
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

export default function AboutPage() {
  const { config } = useConfig()
  
  const { data: teamData, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => api.team.getAll(),
  })

  const team = teamData || []
  const missionValues = config?.missionValues ?? []
  const missionTitle = 'The PNOĒ Advantage'
  const missionEyebrow = 'Why choose us?'
  const missionYear = ''
  const missionHeadline = config?.missionHeadline ?? 'We create clarity, autonomy, and velocity for every wellness decision.'
  const missionBody = config?.missionBody ?? 'Diagnostics, coaching, and protocols live in one ritual so you never have to guess what comes next.'
  const holisticHeadline = config?.holisticHeadline ?? 'A cinematic blueprint that stacks diagnostics, therapy, and rituals.'
  const holisticBody = config?.holisticBody ?? 'Think of it as an editorial layout for your body—a bold top block of testing, a supporting narrative of care, and a full-bleed image of how you want to feel.'

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,#14271f,#050c09)] py-24 text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-content">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Inside PNOĒ</p>
              <h1 className="text-hero-mobile md:text-h1 font-bold leading-[1.05]">About Us</h1>
              <p className="text-body-lg text-white/80 leading-relaxed">
                A team of passionate healthcare professionals dedicated to helping 
                you achieve optimal health and longevity through personalized, science-based care.
              </p>
            </div>
            <div className="rounded-[18px] aspect-video overflow-hidden shadow-[0_35px_120px_rgba(0,0,0,0.45)] group">
              {config?.images?.aboutUs ? (
                <img 
                  src={getImageUrl(config.images.aboutUs)} 
                  alt="About Us"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="bg-white/10 w-full h-full flex items-center justify-center">
                  <p className="text-white/70">About Us Image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-[#def3d6] py-24 text-forest-green">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_1fr] items-center">
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-forest-green/60">{missionYear}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-forest-green/60">{missionEyebrow}</p>
                <h2 className="mt-4 text-[clamp(2.6rem,4vw,3.6rem)] font-semibold leading-tight text-forest-green">
                  {missionTitle}
                </h2>
              </div>
              <p className="text-body-lg text-forest-green/80 leading-relaxed">
                {missionHeadline}
              </p>
              <p className="text-body text-forest-green/70 leading-relaxed">
                {missionBody}
              </p>
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

      {/* Our Holistic Method */}
      <section className="relative">
        <div className="bg-forest-green text-white">
          <div className="container py-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] lg:items-start">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Holistic Method</p>
                <h2 className="text-[3rem] font-semibold leading-tight">{holisticHeadline}</h2>
                <p className="text-lg text-white/85 leading-relaxed">{holisticBody}</p>
              </div>
              <div className="flex lg:justify-end">
                <Link to="/offerings" className="text-sm font-semibold text-lime-200 inline-flex items-center gap-2">
                  View Practice <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container -mt-16">
          <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-[0_60px_160px_rgba(0,0,0,0.55)] group">
            {config?.images?.ourHolisticMethod ? (
              <img
                src={getImageUrl(config.images.ourHolisticMethod)}
                alt="Our Holistic Method"
                className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="bg-white/10 w-full h-[460px] flex items-center justify-center text-white/70">
                Holistic Method Image
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-charcoal py-24 text-white">
        <div className="container">
          <h2 className="text-h2 font-semibold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{
              icon: '🔍',
              title: 'Science-First',
              copy: 'Every recommendation is backed by peer-reviewed research and measurable outcomes.',
            },
            {
              icon: '👤',
              title: 'Personalized Care',
              copy: 'Your biology is unique. Your treatment plan should be too.',
            },
            {
              icon: '🎯',
              title: 'Results-Driven',
              copy: 'We track progress with objective data and adjust based on what works.',
            }].map((value) => (
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
      <section className="container py-24">
        <h2 className="text-h2 font-semibold text-center mb-6 text-forest-green">Meet Our Team</h2>
        <p className="text-center text-body-lg text-off-white mb-16 max-w-2xl mx-auto">
          Experienced professionals committed to your health journey
        </p>
        
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 w-20 bg-pale-sage rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
            {team.map((member) => (
              <div key={member.id} className="group relative cursor-pointer">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-forest-green/20 transition-all duration-300 hover:border-lime-glow hover:scale-110">
                  {member.photo ? (
                    <img
                      src={getImageUrl(member.photo)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-pale-sage flex items-center justify-center text-forest-green font-semibold text-lg">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Hover card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-white rounded-lg shadow-xl border border-forest-green/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-forest-green">{member.name}</h3>
                    <p className="text-sm font-medium text-forest-green/80">{member.title}</p>
                    <p className="text-xs text-off-black/70 leading-relaxed">{member.bio}</p>
                    <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider bg-pale-sage text-forest-green rounded-full">
                      {member.role}
                    </span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-3 h-3 bg-white border-r border-b border-forest-green/10 rotate-45"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-deep-forest text-white py-24">
        <div className="container text-center">
          <h2 className="text-h2 font-semibold mb-6">Work with our team</h2>
          <p className="text-body-lg mb-10 max-w-2xl mx-auto opacity-90">
            Schedule a consultation to meet our team and discuss how we can help you achieve your health goals.
          </p>
          <Link to="/booking" className="inline-block">
            <Button
              size="lg"
              className="rounded-full bg-lime-glow px-8 py-5 text-charcoal shadow-[0_15px_40px_rgba(196,255,77,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-lime-glow/90"
            >
              Book Your Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
