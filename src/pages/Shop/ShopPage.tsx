import { PackageCard } from '@/components/shared/PackageCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConfig } from '@/config/ConfigProvider'
import { copyFor } from '@/constants/copy'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Package } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BookingLink } from '@/components/shared/BookingLink'
import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 digits'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function ShopPage() {
  const { config } = useConfig()
  const copy = copyFor(config)
  // Whatever the business wants stated next to its packages: turnaround, what is
  // included, how often you would come in. Empty is a valid answer and the row
  // is dropped rather than filled with a promise nobody made.
  const packageFacts = config?.packageFacts ?? []
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const { data: packagesData, isLoading } = useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: () => api.packages.getAll(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  const packages = packagesData || []

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowCheckout(true)
  }

  const onSubmit = async (data: CheckoutForm) => {
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Order:', { package: selectedPackage, customer: data })
    setOrderComplete(true)
    reset()
  }

  const fieldClass = (hasError?: boolean) =>
    `mt-2 h-11 rounded-xl border ${
      hasError ? 'border-red-400' : 'border-white/10'
    } bg-white/5 px-4 text-white placeholder-white/40 focus-visible:ring-lime-glow/60 focus-visible:ring-offset-0`

  if (orderComplete) {
    return (
      <div className="container py-24 text-white">
        <Card className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-pine-green/80 via-deep-forest/80 to-charcoal/95 text-center shadow-[0_35px_120px_rgba(4,10,8,0.55)]">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-glow/20 text-2xl text-lime-glow">
              ✓
            </div>
            <CardTitle className="text-3xl text-white">Order Confirmed</CardTitle>
            <CardDescription className="text-white/70">
              Thank you. We have your order and will be in touch to arrange the first appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-white/60">
              We will contact you using the details you gave us.
            </p>
            <Button
              className="rounded-full bg-lime-glow px-6 text-charcoal hover:bg-lime-glow/90"
              onClick={() => {
                setOrderComplete(false)
                setShowCheckout(false)
                setSelectedPackage(null)
              }}
            >
              Continue shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,rgb(var(--brand-surface-dark)),rgb(var(--brand-surface-deep)))] py-24">
        <div className="container space-y-12">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">{copy.packagesLabel}</p>
            <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-tight">
              {copy.packagesHeadline}
            </h1>
            <p className="max-w-3xl text-body-lg text-white/80">
              {copy.packagesIntro}
            </p>
          </div>
          {packageFacts.length > 0 && (
            <div className="grid gap-6 text-sm text-white/60 sm:grid-cols-3">
              {packageFacts.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">{item.label}</p>
                  <p className="mt-2 text-xl text-white">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showCheckout && selectedPackage ? (
        /* Checkout Section */
        <section className="container py-24">
          <Button
            variant="ghost"
            onClick={() => setShowCheckout(false)}
            className="mb-8 rounded-full border-white/20 text-white/80 hover:text-white"
          >
            ← Back to packages
          </Button>

          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Order summary</h2>
              <Card className="rounded-3xl border border-white/10 bg-gradient-to-b from-deep-forest/85 to-charcoal/95 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{selectedPackage.name}</CardTitle>
                  <CardDescription className="text-white/70">
                    {selectedPackage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Package</span>
                    <span className="text-base font-semibold text-white">
                      {formatPrice(selectedPackage.pricing.amount, selectedPackage.pricing.currency)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4 text-base">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Total</span>
                      <span className="text-3xl font-semibold text-white">
                        {formatPrice(selectedPackage.pricing.amount, selectedPackage.pricing.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div>
              <h2 className="text-2xl font-semibold">Checkout</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm text-white/80">
                      Full Name
                    </Label>
                    <Input id="name" {...register('name')} className={fieldClass(!!errors.name)} />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm text-white/80">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={fieldClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm text-white/80">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={fieldClass(!!errors.phone)}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm text-white/80">
                      Address
                    </Label>
                    <Input
                      id="address"
                      {...register('address')}
                      className={fieldClass(!!errors.address)}
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-400">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="city" className="text-sm text-white/80">
                        City
                      </Label>
                      <Input id="city" {...register('city')} className={fieldClass(!!errors.city)} />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-400">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm text-white/80">
                        State
                      </Label>
                      <Input id="state" {...register('state')} className={fieldClass(!!errors.state)} />
                      {errors.state && (
                        <p className="mt-2 text-sm text-red-400">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zip" className="text-sm text-white/80">
                        ZIP
                      </Label>
                      <Input id="zip" {...register('zip')} className={fieldClass(!!errors.zip)} />
                      {errors.zip && (
                        <p className="mt-2 text-sm text-red-400">{errors.zip.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-lime-glow py-6 text-charcoal hover:bg-lime-glow/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing…' : 'Complete purchase'}
                </Button>
              </form>
            </div>
          </div>
        </section>
      ) : (
        /* Packages Grid */
        <section className="container py-24">
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6">
                  <div className="h-72 rounded-2xl bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard 
                  key={pkg.id} 
                  package={pkg}
                  onSelect={handleSelectPackage}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Info Section */}
      {!showCheckout && (
        <section className="bg-gradient-to-r from-deep-forest via-charcoal to-pine-green py-24">
          <div className="container max-w-3xl text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">{copy.packagesCtaEyebrow}</p>
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold">
              {copy.packagesCtaHeadline}
            </h2>
            <p className="text-white/75">
              {copy.packagesCtaBody}
            </p>
            <BookingLink className="inline-flex">
              <Button className="rounded-full bg-lime-glow px-8 py-6 text-charcoal hover:bg-lime-glow/90">
                {copy.bookLabel}
              </Button>
            </BookingLink>
          </div>
        </section>
      )}
    </div>
  )
}
