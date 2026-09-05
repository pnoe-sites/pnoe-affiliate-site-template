// Shrinks every image under public/images/custom/ to the size its slot needs
// and re-encodes it, then rewrites the references in src/data/clinic.json.
//
// Why a step and not advice: the first affiliate site shipped nineteen
// photographs of 1 to 2.5 MB each, 26 MB in all, because the photos were
// copied from the business's own site exactly as they were and nothing in the
// build minded. `npm run validate:data` now refuses any file over 1 MB; this
// is the command that makes it pass.
//
// Rules: resize down only, never up. A photo becomes a progressive JPEG; a
// PNG stays PNG only when it has transparency (a logo). Quality steps down,
// then width, until the file is under the limit. SVGs are left alone.
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clinicPath = path.join(root, 'src', 'data', 'clinic.json')
const MAX_BYTES = 1024 * 1024

// `npm run images` does the business's folder. `npm run images -- public/images/defaults`
// (any folder under public/) is how the template's own stock imagery was brought
// under the limit; it ships with every site, so it is held to the same rule.
const targets = process.argv.slice(2).length
  ? process.argv.slice(2).map((d) => path.resolve(root, d))
  : [path.join(root, 'public', 'images', 'custom')]
const present = targets.filter((d) => existsSync(d))
if (present.length === 0) {
  console.log('images: nothing to do (no such folder)')
  process.exit(0)
}

let clinicText = readFileSync(clinicPath, 'utf8')
const clinic = JSON.parse(clinicText)

// The widest a slot ever renders, by where the path is referenced.
function slotWidth(webPath) {
  const c = clinic.config ?? {}
  if (c.heroImage === webPath) return 1920
  if (Object.values(c.images ?? {}).includes(webPath)) return 1920
  if ((c.whoWeHelpPanels ?? []).some((p) => p.image === webPath)) return 1200
  if ((clinic.services ?? []).some((s) => s.imageUrl === webPath)) return 1000
  if ((clinic.team ?? []).some((m) => m.photo === webPath)) return 800
  if ((clinic.testimonials ?? []).some((t) => t.photo === webPath)) return 600
  if (c.logo === webPath) return 800
  return 1600
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.(jpe?g|png|webp|gif|avif)$/i.test(entry)) out.push(full)
  }
  return out
}

const mb = (n) => (n / 1048576).toFixed(2) + ' MB'
const rows = []
let before = 0
let after = 0

for (const file of present.flatMap((d) => walk(d))) {
  const rel = '/' + path.relative(path.join(root, 'public'), file).split(path.sep).join('/')
  const original = statSync(file).size
  before += original

  // Read into memory first: on Windows libvips keeps the source handle open
  // and writing over the same path fails with an opaque UNKNOWN error.
  const input = readFileSync(file)
  const meta = await sharp(input).metadata()
  const keepPng = meta.hasAlpha === true
  const targetWidth = slotWidth(rel)
  let width = Math.min(meta.width ?? targetWidth, targetWidth)
  let quality = 82
  let buffer
  for (;;) {
    let pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true })
    pipeline = keepPng
      ? pipeline.png({ compressionLevel: 9, palette: true })
      : pipeline.jpeg({ quality, progressive: true, mozjpeg: true })
    buffer = await pipeline.toBuffer()
    if (buffer.length <= MAX_BYTES) break
    if (quality > 60) quality -= 8
    else if (width > 640) width = Math.round(width * 0.8)
    else break
  }

  const ext = keepPng ? '.png' : '.jpg'
  const target = file.replace(/\.[^.]+$/, ext)
  const targetRel = rel.replace(/\.[^.]+$/, ext)
  if (buffer.length >= original && target === file) {
    after += original
    rows.push([rel, mb(original), 'kept', ''])
    continue
  }
  writeFileSync(target, buffer)
  if (target !== file) {
    unlinkSync(file)
    // Every reference moves with the file, so nothing points at a name that is gone.
    clinicText = clinicText.split(JSON.stringify(rel)).join(JSON.stringify(targetRel))
  }
  after += buffer.length
  rows.push([targetRel, mb(original), mb(buffer.length), `${width}px${keepPng ? ' png' : ` q${quality}`}`])
}

writeFileSync(clinicPath, clinicText)

for (const [name, was, now, how] of rows) {
  console.log(`${name.padEnd(48)} ${was.padStart(9)} -> ${now.padStart(9)}  ${how}`)
}
console.log(`images: ${rows.length} files, ${mb(before)} -> ${mb(after)}`)
