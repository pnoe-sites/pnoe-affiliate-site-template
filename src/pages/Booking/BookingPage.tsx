import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useConfig } from '@/config/ConfigProvider'
import { getImageUrl } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Clock, Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening'], {
    errorMap: () => ({ message: 'Please select a time preference' }),
  }),
  serviceInterest: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters').optional(),
  hearAboutUs: z.string().optional(),
})

type BookingForm = z.infer<typeof bookingSchema>

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false)
  const { config } = useConfig()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = async (data: BookingForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Booking request:', data)
    setSubmitted(true)
    reset()
  }

  const baseFieldClass = (hasError?: boolean) =>
    `mt-2 rounded-xl border ${
      hasError ? 'border-red-400' : 'border-white/10'
    } bg-white/5 px-4 text-white placeholder-white/40 focus-visible:ring-lime-glow/60 focus-visible:ring-offset-0`

  if (submitted) {
    return (
      <div className="container py-24 text-white">
        <Card className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-pine-green/80 via-deep-forest/80 to-charcoal/95 text-center shadow-[0_35px_120px_rgba(4,10,8,0.55)]">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-glow/20 text-2xl text-lime-glow">
              ✓
            </div>
            <CardTitle className="text-3xl text-white">Consultation requested</CardTitle>
            <CardDescription className="text-white/70">
              We received your submission and will confirm times within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-white/60">
              Expect a calendar link and intake checklist shortly. Need to adjust details? Submit another request below.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setSubmitted(false)}
                className="rounded-full bg-lime-glow px-6 text-charcoal hover:bg-lime-glow/90"
              >
                Book another
              </Button>
              <Link to="/" className="inline-flex">
                <Button variant="ghost" className="rounded-full border border-white/20 px-6 text-white/80 hover:text-white">
                  Return home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-charcoal text-white">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top,_#1c372b,_#050c09)] py-24 lg:py-28">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Schedule</p>
              <h1 className="text-[clamp(2.5rem,4vw,3.75rem)] font-semibold leading-tight">
                Book a cinematic consultation that aligns diagnostics with ritual.
              </h1>
              <p className="text-body-lg text-white/80 max-w-content">
                Share a few details and our concierge team will script the first chapter of your longevity plan.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-video overflow-hidden rounded-[28px]">
                {config?.images?.scheduleConsultation ? (
                  <img
                    src={getImageUrl(config.images.scheduleConsultation)}
                    alt="Schedule a Consultation"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
                    Schedule Consultation Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info & What to Expect */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">What to expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/75">
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-lime-glow" />
                  <div>
                    <p className="font-semibold text-white">Duration</p>
                    <p>45–60 minutes</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-lime-glow" />
                  <div>
                    <p className="font-semibold text-white">Format</p>
                    <p>In-studio or virtual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Contact us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/75">
                {config?.contact.phone && (
                  <a
                    href={`tel:${config.contact.phone}`}
                    className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-lime-glow" />
                    {config.contact.phone}
                  </a>
                )}
                {config?.contact.email && (
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-lime-glow" />
                    {config.contact.email}
                  </a>
                )}
              </CardContent>
            </Card>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                During the consult
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Align on goals + health history</li>
                <li>• Review testing + therapy options</li>
                <li>• Map first 30 days of your ritual</li>
                <li>• Outline investment + cadence</li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-[32px] border border-white/10 bg-gradient-to-b from-deep-forest/80 via-pine-green/70 to-charcoal/95 text-white">
              <CardHeader className="space-y-3">
                <CardTitle className="text-3xl text-white">Request a consultation</CardTitle>
                <CardDescription className="text-white/70">
                  Complete the form and our concierge will confirm timing plus next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName" className="text-sm text-white/80">
                        First Name *
                      </Label>
                      <Input id="firstName" {...register('firstName')} className={`${baseFieldClass(!!errors.firstName)} h-11`} />
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-400">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm text-white/80">
                        Last Name *
                      </Label>
                      <Input id="lastName" {...register('lastName')} className={`${baseFieldClass(!!errors.lastName)} h-11`} />
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-400">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="email" className="text-sm text-white/80">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`${baseFieldClass(!!errors.email)} h-11`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm text-white/80">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className={`${baseFieldClass(!!errors.phone)} h-11`}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="preferredDate" className="text-sm text-white/80">
                        Preferred Date *
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('preferredDate')}
                        className={`${baseFieldClass(!!errors.preferredDate)} h-11`}
                      />
                      {errors.preferredDate && (
                        <p className="mt-2 text-sm text-red-400">{errors.preferredDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferredTime" className="text-sm text-white/80">
                        Preferred Time *
                      </Label>
                      <select
                        id="preferredTime"
                        {...register('preferredTime')}
                        className={`${baseFieldClass(!!errors.preferredTime)} h-11 appearance-none`}
                      >
                        <option value="">Select time...</option>
                        <option value="morning">Morning (9am-12pm)</option>
                        <option value="afternoon">Afternoon (12pm-5pm)</option>
                        <option value="evening">Evening (5pm-8pm)</option>
                      </select>
                      {errors.preferredTime && (
                        <p className="mt-2 text-sm text-red-400">{errors.preferredTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serviceInterest" className="text-sm text-white/80">
                      Service Interest (Optional)
                    </Label>
                    <Input
                      id="serviceInterest"
                      placeholder="e.g., VO₂ Max Testing, IV Therapy"
                      {...register('serviceInterest')}
                      className={`${baseFieldClass()} h-11`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm text-white/80">
                      Additional Information (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your goals, concerns, or timeline."
                      {...register('message')}
                      className={`${baseFieldClass(!!errors.message)} min-h-[140px] py-3`}
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hearAboutUs" className="text-sm text-white/80">
                      How did you hear about us? (Optional)
                    </Label>
                    <Input
                      id="hearAboutUs"
                      placeholder="e.g., Google, referral, social"
                      {...register('hearAboutUs')}
                      className={`${baseFieldClass()} h-11`}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full bg-lime-glow py-6 text-charcoal hover:bg-lime-glow/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting…' : 'Request consultation'}
                  </Button>

                  <p className="text-center text-xs text-white/60">
                    By submitting, you agree to be contacted by our concierge team regarding your consultation.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
