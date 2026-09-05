# Data contract: src/data/clinic.json

Every piece of clinic content on the site comes from one file, `src/data/clinic.json`.
The build validates it first (`npm run validate:data`) and fails with a readable message
when it is wrong. The canonical schema lives in `src/shared/schemas.ts`
(`ClinicDataSchema`); this document explains it field by field.

Top-level shape:

```json
{
  "config": { ... },
  "services": [ ... ],
  "testimonials": [ ... ],
  "team": [ ... ],
  "packages": [ ... ]
}
```

## The default-content rule

The file ships with fictional "Evergreen Wellness Clinic" content so the template
builds and previews out of the box. Any section left as-is keeps showing that default
content. Replace what you have, keep the rest, and the site stays coherent.

## config (BrandConfig)

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Clinic name. Shown in the header, footer, and browser title. |
| `tagline` | no | One line under the name and in the browser title. |
| `heroImage` | no | Path under `public/`, e.g. `/images/defaults/Hero.jpg`. |
| `missionHeadline`, `missionBody` | no | Home and About mission copy. |
| `holisticHeadline`, `holisticBody` | no | Holistic Method section copy. |
| `colors.primary`, `colors.secondary`, `colors.accent` | yes | Hex values (`#RRGGBB`). See **Colours** below for what each one moves. |
| `contact.email` | no | Must be a valid email when present. |
| `contact.phone`, `contact.location` | no | Free text. |
| `contact.socials` | no | Array of `{platform, url}`. Platforms the footer knows: instagram, facebook, linkedin, twitter, youtube. |
| `images.mission`, `images.ourHolisticMethod`, `images.ourOfferings`, `images.scheduleConsultation`, `images.aboutUs` | no | Section imagery, paths under `public/`. |
| `methodName` | no | What this clinic calls its way of working. Used as the nav label and the eyebrow on that page. Defaults to "How we work". |
| `networkName` | no | A network or group the clinic belongs to, shown above its name in the footer. Nothing is shown when it is absent, because it is a claim about affiliation. |
| `values` | no | Array of `{icon, title, copy}` shown on About. Three reads best. The default claims nothing on the clinic's behalf. |
| `booking` | no | `{url, ctaLabel, duration, format, confirmationNote, timeSlots}`. `url` is the clinic's online scheduler: when set, every Book button opens it in a new tab and the request page hands over to it; when absent, the request page sends the request as an email to `contact.email` (there is no server behind the site), and with no email either it shows the phone and no form. `ctaLabel` is the header button's text (default "Schedule Consult"). The rest is what the clinic tells someone booking: how long a consultation runs, in person or online, what happens after they submit, and which time slots to offer. Every one of these used to be fixed in the template, so each site promised a reply within 24 hours and evening slots to 8pm. |
| `packageFacts` | no | Array of `{label, value}` stated beside the packages (turnaround, what is included, how often you come in). The row is not shown when empty. |
| `heroMeta` | no | Array of `{label, value}` cards under the hero. Three reads best. |
| `missionValues` | no | Array of `{title, description, icon}`. Icons: target, heart, activity, check, trophy, focus, support, sparkles, zap. |
| `whoWeHelpPanels` | no | Array of `{id, title, description, tag, image}` audience panels. Five ship by default. |
| `outcomes` | no | Array of `{label, title, description}` outcome rows. |

### Colours

`colors.primary` does most of the work. The site's dark hero gradients, the pale
band behind the mission section, and every heading and body colour on a light
background are all drawn from it, with the darker shades derived rather than
asked for: set one colour and the whole site is coherently yours.

`colors.secondary` is the supporting dark tone and `colors.accent` the pale tint
behind quiet sections.

Two things do **not** follow this table, on purpose. The action colour (buttons,
link highlights, the Schedule Consult pill) is fixed by the template, because it
has to stay legible on the dark sections whatever the clinic's brand is. So are
the neutral greys and near-blacks. If a clinic needs those changed, it is a
template change, not a data change.

Give real hex values. An unreadable one is ignored and the template's own colour
stands, which looks like the field did nothing.

## services (Service[])

| Field | Required | Notes |
|---|---|---|
| `id`, `slug` | yes | Use the same kebab-case value for both, e.g. `red-light-therapy`. Slugs must be unique; they become URLs (`/services/<slug>`). |
| `title` | yes | |
| `category` | yes | Exactly one of: `tech-therapies`, `alternative-medicine`, `biometric-testing`, `diagnostics`. |
| `shortDescription` | no | Card text, one or two sentences. |
| `longDescription` | yes | Detail-page body. Plain text, no markdown. |
| `duration` | no | Free text, e.g. `15-20 minutes`. |
| `pricing.display` | with pricing | `from` (shows "From $X"), `exact` (shows "$X"), `hidden` (no price shown). Omit `pricing` entirely to show nothing. |
| `pricing.amount` | for from/exact | Number. |
| `pricing.currency` | no | Defaults to `USD`. |
| `imageUrl` | no | Path under `public/`. |
| `pairsWith` | no | Array of other service slugs. Validation fails on unknown slugs. |
| `contraindications` | no | Shown on the detail page when present. |

## testimonials (Testimonial[])

`id`, `name`, `role`, `photo` (path under `public/`), `quote`, and optional `rating`
(1 to 5). Use real client quotes only with the client's consent.

## team (TeamMember[])

`id`, `name`, `title`, `bio`, `photo` (path under `public/`), and `role`: one of
`clinician`, `technician`, `coordinator`, `other`.

## packages (Package[])

`id`, `name`, `description`, `inclusions` (array of strings, one line each),
`pricing` (`amount` number, `currency`, optional `billingPeriod`: `one-time`,
`monthly`, or `annual`), and `featured` (boolean; the featured card is highlighted).

## Images

- All paths are root-relative and resolve into `public/`, so `/images/team/emily.jpg`
  means `public/images/team/emily.jpg`. Absolute `https://` URLs also work.
- Put clinic-specific files under `public/images/custom/`. The `defaults/`, `team/`,
  and `testimonials/` folders hold the template's stock imagery.
- Recommended sizes: hero and section images about 1920x1080, service cards about
  800x600, portraits square and at least 400px.
- Validation fails when a referenced local image does not exist.
