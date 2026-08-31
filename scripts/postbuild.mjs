// GitHub Pages serves 404.html for unknown paths; copying index.html there
// makes deep links into the client-routed app (e.g. /services/cryotherapy)
// survive a page refresh.
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const index = path.join(dist, 'index.html')

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found; run vite build first')
  process.exit(1)
}
copyFileSync(index, path.join(dist, '404.html'))
console.log('postbuild: wrote dist/404.html')
