import { useConfig } from '@/config/ConfigProvider'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface BookingLinkProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

/**
 * Where every "book" call to action goes.
 *
 * With `config.booking.url` set, the clinic's own scheduler (a booking widget,
 * a calendar page) opens in a new tab. Without it, the site's request page.
 * One component rather than ten `<Link to="/booking">`s, because the first
 * clinic with a scheduler had every button rewired by editing page source,
 * and template updates would have undone that.
 */
export function BookingLink({ children, className, onClick }: BookingLinkProps) {
  const { config } = useConfig()
  const url = config?.booking?.url
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link to="/booking" className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

/** The header button's text, from `config.booking.ctaLabel` when the clinic set one. */
export function useBookingCtaLabel(fallback: string): string {
  const { config } = useConfig()
  return config?.booking?.ctaLabel?.trim() || fallback
}
