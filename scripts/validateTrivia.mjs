import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { BIBLE_BOOKS } from '../src/utils/bibleStructure.js'
import { TRIVIA_CATEGORIES } from '../src/utils/triviaCategories.js'

// Checks every trivia entry against the bundled KJV chapter data:
// the book exists, the chapter is in range, and the verses exist.
const entries = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'verseTrivia.json'), 'utf8'))
const books = new Map(BIBLE_BOOKS.map(book => [book.abbrev, book]))
const errors = []
const ids = new Set()

for (const entry of entries) {
  const label = entry.id || JSON.stringify(entry).slice(0, 40)

  for (const field of ['id', 'book', 'chapter', 'category', 'title', 'text', 'source']) {
    if (entry[field] === undefined || entry[field] === '') errors.push(`${label}: missing ${field}`)
  }
  if (ids.has(entry.id)) errors.push(`${label}: duplicate id`)
  ids.add(entry.id)

  if (!TRIVIA_CATEGORIES[entry.category]) errors.push(`${label}: unknown category "${entry.category}"`)
  if (!entry.source?.url?.startsWith('https://')) errors.push(`${label}: source.url must be https`)

  const book = books.get(entry.book)
  if (!book) {
    errors.push(`${label}: unknown book "${entry.book}"`)
    continue
  }
  if (entry.chapter < 1 || entry.chapter > book.chapters) {
    errors.push(`${label}: chapter ${entry.chapter} out of range for ${entry.book}`)
    continue
  }

  if (entry.verseStart != null) {
    const chapter = JSON.parse(readFileSync(
      join(process.cwd(), 'public', 'bibles', 'KJV', entry.book, `${entry.chapter}.json`), 'utf8'
    ))
    const lastVerse = Math.max(...chapter.verses.map(v => v.verse))
    const verseEnd = entry.verseEnd ?? entry.verseStart
    if (entry.verseStart < 1 || verseEnd > lastVerse || verseEnd < entry.verseStart) {
      errors.push(`${label}: verses ${entry.verseStart}-${verseEnd} invalid (chapter has ${lastVerse})`)
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const flagged = entries.filter(entry => entry.needsReview).map(entry => entry.id)
console.log(`OK: ${entries.length} trivia entries valid.`)
if (flagged.length) console.log(`Flagged for review: ${flagged.join(', ')}`)
