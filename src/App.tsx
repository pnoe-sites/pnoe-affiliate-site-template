import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { ConfigProvider } from './config/ConfigProvider'
import AboutPage from './pages/About/AboutPage'
import BookingPage from './pages/Booking/BookingPage'
import HolisticMethodPage from './pages/HolisticMethod/HolisticMethodPage'
import HomePage from './pages/Home/HomePage'
import OfferingsPage from './pages/Offerings/OfferingsPage'
import ServiceDetailPage from './pages/ServiceDetail/ServiceDetailPage'
import ShopPage from './pages/Shop/ShopPage'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="offerings" element={<OfferingsPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="holistic-method" element={<HolisticMethodPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="*" element={<div className="container py-12"><h1 className="text-2xl font-bold">Page Not Found</h1><p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
