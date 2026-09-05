# Data contract: src/data/clinic.json

Every word and picture on the site comes from one file, `src/data/clinic.json`. The
build validates it first (`npm run validate:data`) and fails with a readable message when
it is wrong; `npm run validate:release` adds the checks a site must pass before it goes
public. The canonical schema lives in `src/shared/schemas.ts` (`ClinicDataSchema`); this
document explains it field by field.

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

The file ships with fictional "Evergreen Wellness Clinic" content so the template builds
and previews out of the box. Any section left as-is keeps showing that content, and
**`npm run validate:release` refuses to pass while it does**: every line the seed ships
is compared against the site's data, and a match is an error naming the field. Replace
every section with the business's own words; a stock image is allowed (it is reported as
a note, not an error) where the business has no photo for the slot.

The template's own code carries no words about the business: the page copy that is not
in `clinic.json` comes from `src/constants/copy.ts`, whose defaults name no treatment,
premises or kind of visitor, and `npm run lint` fails if one comes back.

## config (BrandConfig)

| Field | Required | Notes |
|---|---|---|
| `name` | yes | The business's name. Header, footer, titles. |
| `tagline` | no | Shown as the eyebrow over the hero, in the footer and in the home page title. Nothing is shown when absent. |
| `hero.headline`, `hero.sub` | **yes** | The first words on the site. The H1 and the line under it. |
| `hero.cta` | no | `{label, url}`: the hero's primary button when the business has an entry product (an assessment, a quiz). https only. The Book button becomes the second button. Without it the Book button is first. |
| `heroImage` | no | Path under `public/`, e.g. `/images/custom/hero.jpg`. |
| `missionHeadline`, `missionBody` | no | The "Why choose us" section on Home and About. Both absent hides the section. |
| `methodName` | no | What the business calls its way of working: the nav label and the eyebrow on the method page. Defaults to "How we work". |
| `method` | no | `{eyebrow?, headline, intro, steps[{title, body, points?[]}], whyItWorks?[{title, body}], cta?{headline, body}}`. The method page (`/method`) and the home and About sections that point at it. **Absent means no method page, no nav item and no section**: this page used to be four fixed steps naming the fictional clinic's treatments, and every published site claimed them. |
| `serviceCategories` | when there are services | `[{id, name, description?}]` in display order. Every `services[].category` must be one of the ids; the Offerings page heads each group with `name` and `description`. |
| `colors.primary`, `colors.secondary`, `colors.accent` | yes | Hex values (`#RRGGBB`). See **Colours** below for what each one moves. |
| `contact.email` | no | Must be a valid email when present. The request page emails to it when there is no scheduler. |
| `contact.phone`, `contact.location` | no | Free text. `location` also becomes the JSON-LD address. |
| `contact.socials` | no | Array of `{platform, url}`. Platforms the footer knows: instagram, facebook, linkedin, twitter, youtube. They become `sameAs` in the JSON-LD. |
| `images.mission`, `images.method`, `images.ourOfferings`, `images.scheduleConsultation`, `images.aboutUs` | no | Section imagery, paths under `public/`. A slot left empty renders no image and no placeholder box. |
| `networkName` | no | A network or group the business belongs to, shown above its name in the footer. Nothing is shown when absent, because it is a claim about affiliation. |
| `values` | no | Array of `{icon, title, copy}` shown on About. Three reads best. |
| `booking` | no | `{url, noScheduler, ctaLabel, duration, format, confirmationNote, timeSlots}`. `url` is the business's online scheduler (https): when set, every Book button opens it in a new tab and the request page hands over to it. When absent the request page sends the request as an email to `contact.email` (there is no server behind the site), and with no email either it shows the phone. **The release gate requires either `url` or `noScheduler: true`**, so "no scheduler" is a decision on record, never an omission. `ctaLabel` is the header button's text. The rest is what the business tells someone booking: how long a consultation runs, in person or online, what happens after they submit, which time slots to offer. |
| `packageFacts` | no | Array of `{label, value}` stated beside the packages. The row is not shown when empty. |
| `heroMeta` | no | Array of `{label, value}` cards under the hero. Three reads best. Absent hides the row. |
| `missionValues` | no | Array of `{title, description, icon}`. Icons: target, heart, activity, check, trophy, focus, support, sparkles, zap. |
| `whoWeHelpPanels` | no | Array of `{id, title, description, tag, image}` audience panels. Absent hides the section. |
| `outcomes` | no | Array of `{label, title, description}` outcome rows. Absent hides the section. |
| `copy` | no | The page copy that is not content: section headings, intros, button labels, the booking page's lines, the "During the consult" list. Every key is optional; see `src/constants/copy.ts` for the keys and the neutral defaults. `{business}` in a value is replaced with `name`. |
| `seo` | no | `{siteUrl, schemaType, routes}`. `siteUrl` is the published address (canonical links, `sitemap.xml`, `robots.txt` and the JSON-LD `url` need it; set it once the address is assigned). `schemaType` is the schema.org type of the home page's JSON-LD (default `LocalBusiness`; `HealthClub`, `MedicalClinic`, `Physiotherapy` are common). `routes` overrides the derived title or description per path: `{"/about": {"title": "...", "description": "..."}}`. |

### Per-route HTML

`npm run build` writes one `index.html` per route into `dist/` (`/`, `/offerings`,
`/services/<slug>`, `/method` when there is one, `/about`, `/shop` when there are
packages, `/booking`), each with its own `<title>`, description, canonical and social
tags, so every address answers 200 on GitHub Pages and reads right in a link preview.
Titles stay under 60 characters and descriptions under 160; both derive from the data
(`hero.sub`, a service's `shortDescription`, the method's `intro`) unless `seo.routes`
says otherwise. The home page carries one JSON-LD block from recorded fields only; there
is never an `aggregateRating`.

### Colours

`colors.primary` does most of the work. The site's dark hero gradients, the pale
band behind the mission section, and every heading and body colour on a light
background are all drawn from it, with the darker shades derived rather than
asked for: set one colour and the whole site is coherently yours.

`colors.secondary` is the supporting dark tone and `colors.accent` the pale tint
behind quiet sections.

Two things do **not** follow this table, on purpose. The action colour (buttons,
link highlights, the Schedule Consult pill) is fixed by the template, because it
has to stay legible on the dark sections whatever the business's brand is. So are
the neutral greys and near-blacks. If a business needs those changed, it is a
template change, not a data change.

Give real hex values. An unreadable one is ignored and the template's own colour
stands, which looks like the field did nothing.

## services (Service[])

| Field | Required | Notes |
|---|---|---|
| `id`, `slug` | yes | Use the same kebab-case value for both, e.g. `decode-experience`. Slugs must be unique; they become URLs (`/services/<slug>`). |
| `title` | yes | |
| `category` | yes | One of `config.serviceCategories[].id`. |
| `shortDescription` | no | Card text, one or two sentences. Also the route's meta description. |
| `longDescription` | yes | Detail-page body. Plain text, no markdown. |
| `duration` | no | Free text, e.g. `15-20 minutes`. |
| `pricing.display` | with pricing | `from` (shows "From $X"), `exact` (shows "$X"), `hidden` (no price shown). Omit `pricing` entirely to show nothing. |
| `pricing.amount` | for from/exact | Number. |
| `pricing.currency` | no | Defaults to `USD`. |
| `imageUrl` | no | Path under `public/`. |
| `pairsWith` | no | Array of other service slugs. Validation fails on unknown slugs. |
| `contraindications` | no | Shown on the detail page when present. |

## testimonials (Testimonial[])

`id`, `name`, `role`, `quote`, optional `photo` (path under `public/`; the neutral
silhouette is used when absent) and optional `rating` (1 to 5). Use real client quotes
only with the client's consent.

## team (TeamMember[])

`id`, `name`, `title`, `bio`, optional `photo` (path under `public/`), and `role`: one of
`clinician`, `technician`, `coordinator`, `other`.

## packages (Package[])

`id`, `name`, `description`, `inclusions` (array of strings, one line each),
`pricing` (`amount` number, `currency`, optional `billingPeriod`: `one-time`,
`monthly`, or `annual`), and `featured` (boolean; the featured card is highlighted).
An empty array hides the Packages page and its nav item.

## Images

- All paths are root-relative and resolve into `public/`, so `/images/custom/hero.jpg`
  means `public/images/custom/hero.jpg`. Absolute `https://` URLs also work.
- Put the business's files under `public/images/custom/`. The `defaults/`, `team/`,
  and `testimonials/` folders hold the template's stock imagery.
- Sizes the slots render at: hero and section images 1920 wide, audience panels 1200,
  service cards 1000, team portraits 800, testimonial portraits 600.
- **No file under `public/images/custom/` may exceed 1 MB**; the build fails on one that
  does. `npm run images` resizes every file there to its slot's width, re-encodes
  photographs as progressive JPEG (PNG is kept only for images with transparency),
  renames the extension and rewrites the references in `clinic.json`. Run it after
  adding photos.
- Validation fails when a referenced local image does not exist (the path is
  case-sensitive, as GitHub Pages is).

## Migrating a site built from template 1.x

`hero` is now required (the H1 and sub used to be template code). `holisticHeadline` /
`holisticBody` became `method.headline` / `method.intro`, with `method.steps` for the page
that used to be hard-coded; the route moved from `/holistic-method` to `/method`;
`images.ourHolisticMethod` is `images.method`. Service categories are declared in
`config.serviceCategories` instead of a fixed enum. `testimonials[].photo` and
`team[].photo` are optional. The build's postbuild step is `scripts/postbuild.ts`.
