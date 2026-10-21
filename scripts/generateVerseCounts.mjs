import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BIBLE_BOOKS } from '../src/utils/bibleStructure.js'

// Verse counts per chapter (from the bundled KJV text), used to split slow
// reading plans into evenly sized parts of chapters. Regenerate with
// `npm run generate:verse-counts` if the bundled Bible data changes.
const counts = {}
for (const book of BIBLE_BOOKS) {
  counts[book.abbrev] = []
  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    const data = JSON.parse(readFileSync(join(process.cwd(), 'public', 'bibles', 'KJV', book.abbrev, `${chapter}.json`), 'utf8'))
    counts[book.abbrev].push(data.verses.length)
  }
}

writeFileSync(join(process.cwd(), 'src', 'data', 'verseCounts.json'), `${JSON.stringify(counts)}\n`)
const total = Object.values(counts).flat().reduce((sum, n) => sum + n, 0)
console.log(`Wrote verse counts for ${BIBLE_BOOKS.length} books (${total} verses)`)
