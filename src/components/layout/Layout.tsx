import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { clinicData } from '@/lib/api'
import { metaForPath } from '@shared/routeMeta'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname } = useLocation()

  // The static HTML for each route already carries its own <title> and
  // description (scripts/postbuild.ts writes them from the same routeMeta), so
  // this only has to keep the tab honest as the visitor moves between pages.
  useEffect(() => {
    const meta = metaForPath(clinicData, pathname)
    if (!meta) return
    document.title = meta.title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', meta.description)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-charcoal text-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
