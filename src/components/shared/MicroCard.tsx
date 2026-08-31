import { cn } from '@/lib/utils'

interface MicroCardProps {
  title: string
  description: string
  icon?: string
  variant?: 'default' | 'primary'
  className?: string
}

export function MicroCard({ title, description, icon, variant = 'default', className }: MicroCardProps) {
  return (
    <div 
      className={cn(
        'p-6 rounded-2xl border shadow-[0_20px_60px_rgba(5,10,8,0.35)] transition-all duration-300 hover:-translate-y-1',
        variant === 'primary'
          ? 'border-lime-glow/60 bg-gradient-to-br from-lime-glow/10 via-lime-glow/5 to-transparent text-white'
          : 'border-white/10 bg-gradient-to-br from-deep-forest/80 via-pine-green/70 to-charcoal/90 text-white/85',
        className
      )}
    >
      {icon && (
        <div className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl',
          variant === 'primary' ? 'bg-white/15 text-white' : 'bg-white/10 text-lime-glow'
        )}>
          <span>{icon}</span>
        </div>
      )}
      <h3
        className={cn(
          'text-lg font-semibold mb-2',
          variant === 'primary' ? 'text-white' : 'text-white'
        )}
      >
        {title}
      </h3>
      <p className={cn(
        'text-sm leading-relaxed',
        variant === 'primary' ? 'text-white/80' : 'text-white/70'
      )}>
        {description}
      </p>
    </div>
  )
}
