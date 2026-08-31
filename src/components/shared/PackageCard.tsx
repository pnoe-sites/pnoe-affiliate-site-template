import type { Package } from '@shared/schemas'
import { Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface PackageCardProps {
  package: Package
  onSelect?: (pkg: Package) => void
}

export function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const isFeatured = pkg.featured || false

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-deep-forest/85 via-pine-green/70 to-charcoal/95 text-white shadow-[0_30px_90px_rgba(5,10,8,0.55)] transition-transform duration-300 hover:-translate-y-1 ${
        isFeatured ? 'ring-1 ring-lime-glow/60' : ''
      }`}
    >
      {isFeatured && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-lime-glow/20 px-4 py-1 text-xs font-semibold text-lime-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-glow" />
          Most Popular
        </div>
      )}
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-3xl text-white">{pkg.name}</CardTitle>
          <CardDescription className="text-white/70 text-base">
            {pkg.description}
          </CardDescription>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <span className="text-5xl font-semibold tracking-tight">${pkg.pricing.amount}</span>
            {pkg.pricing.billingPeriod && (
              <span className="ml-2 text-sm text-white/60">/ {pkg.pricing.billingPeriod}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3 text-sm text-white/80">
          {pkg.inclusions.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-white/10 p-1">
                <Check className="h-3 w-3 text-lime-glow" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full rounded-xl text-base ${
            isFeatured
              ? 'bg-lime-glow text-charcoal hover:bg-lime-glow/90'
              : 'border-white/30 bg-transparent text-white hover:border-lime-glow/60 hover:bg-lime-glow/10'
          }`}
          variant={isFeatured ? 'default' : 'outline'}
          onClick={() => onSelect?.(pkg)}
        >
          Select Package
        </Button>
      </CardFooter>
    </Card>
  )
}
