import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { useConfig } from '../../config/ConfigProvider'

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

const getSocialIcon = (platform: string) => {
  const Icon = socialIconMap[platform.toLowerCase()]
  return Icon || null
}

export default function Footer() {
  const { config } = useConfig()

  return (
    <footer className="border-t border-white/10 bg-charcoal text-white">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">PNOĒ NETWORK</p>
            <h3 className="text-2xl font-semibold">{config?.name || 'PNOĒ Clinic'}</h3>
            <p className="text-sm text-white/70 max-w-sm">
              {config?.tagline || 'Clinical testing for longevity'}
            </p>
          </div>

          {config?.contact && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Contact</h4>
              <div className="space-y-2 text-sm text-white/70">
                {config.contact.email && (
                  <p>
                    <a href={`mailto:${config.contact.email}`} className="transition-colors hover:text-lime-glow">
                      {config.contact.email}
                    </a>
                  </p>
                )}
                {config.contact.phone && (
                  <p>
                    <a href={`tel:${config.contact.phone}`} className="transition-colors hover:text-lime-glow">
                      {config.contact.phone}
                    </a>
                  </p>
                )}
                {config.contact.location && <p>{config.contact.location}</p>}
              </div>
            </div>
          )}

          {config?.contact?.socials && config.contact.socials.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Social</h4>
              <div className="flex flex-wrap gap-3">
                {config.contact.socials.map((social) => {
                  const Icon = getSocialIcon(social.platform)
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-lime-glow/60 hover:text-lime-glow"
                      aria-label={social.platform}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : <span className="text-xs">{social.platform[0]}</span>}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-xs uppercase tracking-[0.3em] text-white/50">
          © {new Date().getFullYear()} {config?.name || 'PNOĒ Clinic'}
        </div>
      </div>
    </footer>
  )
}
