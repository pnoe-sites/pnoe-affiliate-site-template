import { getImageUrl } from '@/lib/api'
import type { Service } from '@shared/schemas'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-gradient-to-b from-deep-forest/90 via-pine-green/60 to-charcoal/95 text-white shadow-[0_25px_80px_rgba(5,10,8,0.45)] transition-transform duration-300 hover:-translate-y-1">
      {service.imageUrl && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={getImageUrl(service.imageUrl)}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            {service.category?.split('-').join(' ') || 'Featured'}
          </span>
        </div>
      )}
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl text-white">{service.title}</CardTitle>
        <CardDescription className="line-clamp-3 text-white/70">
          {service.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link to={`/services/${service.slug}`}>
          <Button
            variant="ghost"
            className="group/btn flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 text-white transition-all hover:border-lime-glow/60 hover:bg-lime-glow/20 hover:text-charcoal"
          >
            Explore Service
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
