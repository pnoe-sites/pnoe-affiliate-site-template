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
| `colors.primary`, `colors.secondary`, `colors.accent` | yes | Hex values (`#RRGGBB`). Applied as CSS variables at load. |
| `contact.email` | no | Must be a valid email when present. |
| `contact.phone`, `contact.location` | no | Free text. |
| `contact.socials` | no | Array of `{platform, url}`. Platforms the footer knows: instagram, facebook, linkedin, twitter, youtube. |
| `images.mission`, `images.ourHolisticMethod`, `images.ourOfferings`, `images.scheduleConsultation`, `images.aboutUs` | no | Section imagery, paths under `public/`. |
| `heroMeta` | no | Array of `{label, value}` cards under the hero. Three reads best. |
| `missionValues` | no | Array of `{title, description, icon}`. Icons: target, heart, activity, check, trophy, focus, support, sparkles, zap. |
| `whoWeHelpPanels` | no | Array of `{id, title, description, tag, image}` audience panels. Five ship by default. |
| `outcomes` | no | Array of `{label, title, description}` outcome rows. |

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
