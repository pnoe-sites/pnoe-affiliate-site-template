import type { Testimonial } from '@shared/schemas'
import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-pine-green/80 via-deep-forest/90 to-charcoal text-white shadow-[0_25px_80px_rgba(3,8,6,0.45)]">
      <CardContent className="flex h-full flex-col gap-8 p-8">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < (testimonial.rating || 5)
                  ? 'text-lime-glow fill-lime-glow'
                  : 'text-white/20'
              }`}
            />
          ))}
        </div>

        <blockquote className="relative flex-1 text-lg leading-relaxed text-white/80">
          <span className="absolute -left-4 -top-4 text-5xl text-lime-glow/30">“</span>
          {testimonial.quote}
        </blockquote>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase tracking-wide text-white">
            {testimonial.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div>
            <div className="text-base font-semibold text-white">{testimonial.name}</div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">{testimonial.role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
