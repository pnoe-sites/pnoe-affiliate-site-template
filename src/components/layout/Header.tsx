import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useConfig } from '../../config/ConfigProvider'
import { Button } from '../ui/button'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/offerings', label: 'Offerings' },
  { to: '/holistic-method', label: 'Holistic Method' },
  { to: '/about', label: 'About' },
  { to: '/shop', label: 'Shop' },
]

export default function Header() {
  const { config, isLoading } = useConfig()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          {config?.name || 'PNOĒ Clinic'}
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
          <Link to="/booking">
            <Button size="sm" className="rounded-full bg-lime-glow px-6 text-charcoal shadow-[0_10px_30px_rgba(196,255,77,0.35)] hover:bg-lime-glow/90">
              Schedule Consult
            </Button>
          </Link>
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
            <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full rounded-full bg-lime-glow px-6 py-3 text-charcoal shadow-[0_15px_35px_rgba(196,255,77,0.35)] hover:bg-lime-glow/90">
                Schedule Consult
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
