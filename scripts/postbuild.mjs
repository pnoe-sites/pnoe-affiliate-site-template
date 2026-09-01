// Two jobs, both about what the built folder needs that vite does not write.
//
// 1. The head tags. index.html ships the template's own title and description,
//    and the app only corrects them after React mounts. Everything that reads a
//    page WITHOUT running its JavaScript — Google, a link preview in WhatsApp or
//    Slack, a screen reader announcing the tab — sees the file, so a clinic's
//    site was being indexed and shared under the template's name. Rewriting them
//    here means the static file is right before anyone fetches it.
//
// 2. GitHub Pages serves 404.html for unknown paths; copying index.html there
//    makes deep links into the client-routed app (e.g. /services/cryotherapy)
//    survive a page refresh. It is copied AFTER the rewrite, so both files carry
//    the same head.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const index = path.join(dist, 'index.html')

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found; run vite build first')
  process.exit(1)
}

/** escapeAttr keeps a clinic name with a quote or an ampersand in it from breaking the tag. */
const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const clinicPath = path.join(root, 'src', 'data', 'clinic.json')
let head = { name: '', tagline: '', description: '' }
try {
  const config = JSON.parse(readFileSync(clinicPath, 'utf8')).config ?? {}
  head = {
    name: (config.name ?? '').trim(),
    tagline: (config.tagline ?? '').trim(),
    // The mission headline is the clinic's own sentence about itself, which is
    // exactly what a search result should show. Tagline is the fallback because
    // a site with no mission copy still has one.
    description: (config.missionHeadline ?? config.tagline ?? '').trim(),
  }
} catch (err) {
  console.warn('postbuild: could not read src/data/clinic.json, leaving the head tags alone:', err.message)
}

let html = readFileSync(index, 'utf8')
if (head.name) {
  const title = head.tagline ? `${head.name} - ${head.tagline}` : head.name
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
  if (head.description) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(head.description)}" />`,
    )
  }
  // og: and twitter: tags are appended rather than replaced: the template ships
  // none, and a link pasted into a chat is how most people first see the site.
  if (!html.includes('property="og:title"')) {
    const og = [
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${escapeAttr(title)}" />`,
      head.description ? `<meta property="og:description" content="${escapeAttr(head.description)}" />` : '',
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
      head.description ? `<meta name="twitter:description" content="${escapeAttr(head.description)}" />` : '',
    ]
      .filter(Boolean)
      .map((tag) => '    ' + tag)
      .join('\n')
    html = html.replace('</head>', og + '\n  </head>')
  }
  writeFileSync(index, html)
  console.log(`postbuild: head tags set for ${head.name}`)
}

copyFileSync(index, path.join(dist, '404.html'))
console.log('postbuild: wrote dist/404.html')
