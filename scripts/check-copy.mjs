// Refuses template code that speaks for the business.
//
// The pages used to carry sentences written for a fictional testing clinic:
// "What patients say", "IV treatments and coaching", a "How we work" page
// naming cryotherapy and hyperbaric oxygen. Every site published from the
// template said them. All of that copy now comes from clinic.json or from
// src/constants/copy.ts, whose defaults name no treatment, no premises and no
// kind of visitor. This scan keeps it that way: any of the words below in a
// string literal or JSX text under src/ (data files excepted) fails the lint.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')

// Word boundaries, case-insensitive. "clinicName" and "clinic.json" do not
// match: the first has no boundary after "clinic", the second is excluded below.
const BANNED = [
  /\bclinics?\b(?!\.json)/i,
  /\bclinical\b/i,
  /\bpatients?\b/i,
  /\bIV\b/,
  /\btherap(y|ies)\b/i,
  /\bcryo(therapy)?\b/i,
  /\bhyperbaric\b/i,
  /\bhormones?\b/i,
  /\btreatments?\b/i,
]

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'data') continue
      out.push(...walk(full))
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      out.push(full)
    }
  }
  return out
}

// Comments may say anything; they are not on the page.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`])\/\/[^\n]*/g, (m, lead) => lead + ' '.repeat(m.length - lead.length))
}

// What reaches the page: string literals and JSX text. Identifiers, imports
// and class names are code and are skipped by only looking inside quotes and
// between tags.
function visibleText(source) {
  const pieces = []
  const literal = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g
  let m
  while ((m = literal.exec(source))) pieces.push({ text: m[1] ?? m[2] ?? m[3] ?? '', index: m.index })
  // JSX text between tags, with any {expression} inside it blanked out so
  // "IV therapy for {name}" is still read as prose.
  const jsxText = />([^<>]*[A-Za-z][^<>]*)</g
  while ((m = jsxText.exec(source))) {
    const text = m[1].replace(/\{[^{}]*\}/g, ' ')
    if (/[A-Za-z]/.test(text)) pieces.push({ text, index: m.index + 1 })
  }
  return pieces
}

const failures = []
for (const file of walk(srcDir)) {
  const source = stripComments(readFileSync(file, 'utf8'))
  for (const piece of visibleText(source)) {
    // Import paths are not prose. Class strings are scanned like everything
    // else: no utility class carries one of the banned words, and a heuristic
    // that skipped "class-looking" strings let title-case prose through.
    if (/^[@./]/.test(piece.text)) continue
    for (const rule of BANNED) {
      if (rule.test(piece.text)) {
        const line = source.slice(0, piece.index).split('\n').length
        failures.push(`${path.relative(root, file)}:${line}: ${JSON.stringify(piece.text.trim().slice(0, 80))} matches ${rule}`)
        break
      }
    }
  }
}

if (failures.length > 0) {
  console.error('check-copy: template code speaks for the business. Move the line into clinic.json (config.copy) or a neutral default:')
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('check-copy: no business-specific words in template code')
