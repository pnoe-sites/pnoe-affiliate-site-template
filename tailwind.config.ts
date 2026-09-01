/**
 * brand wires a palette token to a CSS variable holding SPACE-SEPARATED RGB
 * CHANNELS ("36 76 63"), not a hex.
 *
 * The channels and the function form are both required by Tailwind 3. A token
 * declared as a plain `var(--x)` string works until someone writes
 * `text-forest-green/70`, at which point Tailwind cannot compose the alpha and
 * silently emits the colour at full strength. This template leans on those
 * modifiers everywhere, so a naive variable swap would have flattened every
 * muted paragraph on the site while looking correct in a diff.
 */
const brand = (name) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${name}))` : `rgb(var(${name}) / ${opacityValue})`

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem', // 24px
        sm: '2rem',         // 32px
      },
      screens: {
        '2xl': '1180px',    // PNOĒ max-width specification
      },
    },
    extend: {
      colors: {
        // The clinic's own palette. These five follow config.colors from
        // src/data/clinic.json through the CSS variables ConfigProvider sets,
        // with the template's defaults declared in index.css so a site that
        // never sets them looks exactly as it always did.
        //
        // They used to be literal hexes, which made the three required colour
        // fields in the data contract dead: an affiliate filled them in, the
        // validator accepted them, and every published site came out in the
        // template author's green.
        'forest-green': brand('--brand-primary'),
        'deep-forest': brand('--brand-primary-deep'),
        'pine-green': brand('--brand-primary-soft'),
        'ocean-blue': brand('--brand-secondary'),
        'pale-sage': brand('--brand-accent'),

        // Fixed by the template, not by the clinic. lime-glow is the action
        // colour every button and link highlight uses and it has to stay
        // legible on the dark sections; the greys are neutral chrome. The data
        // contract says so, so nobody fills in a cell expecting these to move.
        'pale-blue': '#EAF3F8',
        'charcoal': '#0A0F0D',
        'graphite': '#111B16',
        'lime-glow': '#C4FF4D',
        
        // PNOĒ Secondary Palette
        'warm-gray': '#F7F7F7',
        'cool-gray': '#6F767E',
        'off-black': '#1A1A1A',
        
        // shadcn/ui compatibility mappings
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',       // Maps to Deep Forest Green
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',     // Maps to Deep Ocean Blue
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',         // Maps to Pale Sage/Blue
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',        // Maps to Pale Blue
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // PNOĒ Typography Scale
        // Headings use Plus Jakarta Sans (font-display)
        'hero-desktop': ['56px', { lineHeight: '1.1', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }],
        'hero-mobile': ['36px', { lineHeight: '1.1', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }],
        'h1': ['56px', { lineHeight: '1.2', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }],
        // Body text uses Inter
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        // 8pt spacing scale
        '18': '4.5rem',  // 72px
        '20': '5rem',    // 80px
        '22': '5.5rem',  // 88px
        '24': '6rem',    // 96px
        '26': '6.5rem',  // 104px
        '28': '7rem',    // 112px
        '30': '7.5rem',  // 120px
        '32': '8rem',    // 128px
        '36': '9rem',    // 144px
      },
      maxWidth: {
        'content': '620px',     // For H2/text blocks
        'container': '1180px',  // Main container
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
