import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FlashCardProps {
  title: string
  description: string
  icon?: string
  defaultExpanded?: boolean
}

export function FlashCard({ title, description, icon, defaultExpanded = false }: FlashCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-deep-forest/80 via-pine-green/60 to-charcoal/95 text-white shadow-[0_20px_60px_rgba(5,10,8,0.4)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between gap-4 px-6 py-6 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex flex-1 items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl text-lime-glow">
              <span>{icon}</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
            {!isExpanded && (
              <p className="line-clamp-1 text-sm text-white/60">
                {description}
              </p>
            )}
          </div>
        </div>
        <ChevronDown 
          className={cn(
            'h-5 w-5 shrink-0 text-white/60 transition-transform',
            isExpanded && 'rotate-180 text-lime-glow'
          )}
        />
      </button>
      {isExpanded && (
        <div className="animate-accordion-down px-6 pb-6 pt-0">
          <p className="text-sm leading-relaxed text-white/70">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
