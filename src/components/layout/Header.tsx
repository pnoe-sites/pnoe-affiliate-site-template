import type { Package } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { BookingLink, useBookingCtaLabel } from '@/components/shared/BookingLink'
import { copyFor } from '@/constants/copy'
import { Link, NavLink } from 'react-router-dom'
import { useConfig } from '../../config/ConfigProvider'
import { api } from '../../lib/api'
import { businessName } from '../../lib/brand'
import { Button } from '../ui/button'

export default function Header() {
  const { config, isLoading } = useConfig()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const ctaLabel = useBookingCtaLabel('Schedule Consult')
  const copy = copyFor(config)

  // Shared cache key with ShopPage, so this costs nothing on a warm app.
  const { data: packages } = useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: () => api.packages.getAll(),
  })

  // Built per business rather than fixed.
  //
  // Every label is the business's own or a neutral default, and a tab exists
  // only when its page has content: the method page appears only when
  // config.method is written, Packages only when there are packages. A tab
  // leading to an empty page, or to a page of the template author's words, is
  // a broken promise in the most visible part of the site.
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/offerings', label: copy.offeringsLabel },
    ...(config?.method ? [{ to: '/method', label: config.methodName ?? 'How we work' }] : []),
    { to: '/about', label: copy.aboutLabel },
    ...(packages && packages.length > 0 ? [{ to: '/shop', label: copy.packagesLabel }] : []),
  ]

  if (isLoading) {
    return (
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-charcoal/80 text-white backdrop-blur-xl">
      <div className="container flex h-20 items-center gap-4">
        <Link to="/" className="text-lg font-semibold tracking-[0.2em] uppercase text-white/80">
          {businessName(config)}
        </Link>
        <nav className="ml-auto hidden flex-1 items-center justify-end gap-6 text-sm font-medium text-white/60 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-white ${isActive ? 'text-white' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <BookingLink>
            <Button size="sm" className="rounded-full bg-lime-glow px-6 text-charcoal shadow-[0_10px_30px_rgba(196,255,77,0.35)] hover:bg-lime-glow/90">
              {ctaLabel}
            </Button>
          </BookingLink>
        </div>
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-glow lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-charcoal/95 text-white lg:hidden">
          <nav className="container flex flex-col gap-4 py-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={`mobile-${item.to}`}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-full border border-white/10 px-4 py-3 text-center transition-colors hover:border-lime-glow/60 hover:text-lime-glow ${isActive ? 'text-white' : 'text-white/70'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <BookingLink onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full rounded-full bg-lime-glow px-6 py-3 text-charcoal shadow-[0_15px_35px_rgba(196,255,77,0.35)] hover:bg-lime-glow/90">
                {ctaLabel}
              </Button>
            </BookingLink>
          </nav>
        </div>
      )}
    </header>
  )
}
