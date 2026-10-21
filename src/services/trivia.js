import { BIBLE_BOOKS, BIBLE_VERSIONS } from '../utils/bibleStructure'

const BOOK_NAMES = new Map(BIBLE_BOOKS.map(book => [book.abbrev, book.name]))

let triviaIndexPromise = null

/**
 * Lazily load the verse trivia dataset (its own small chunk, precached by the
 * PWA) and index it by "BOOK:chapter". Only called when fun facts are enabled.
 * @returns {Promise<Map<string, Array>>}
 */
export function loadTriviaIndex() {
  if (!triviaIndexPromise) {
    triviaIndexPromise = import('../data/verseTrivia.json')
      .then(({ default: entries }) => {
        const index = new Map()
        for (const entry of entries) {
          const key = `${entry.book}:${entry.chapter}`
          if (!index.has(key)) index.set(key, [])
          index.get(key).push(entry)
        }
        for (const chapterEntries of index.values()) {
          chapterEntries.sort((a, b) => (a.verseStart ?? 0) - (b.verseStart ?? 0))
        }
        return index
      })
      .catch((err) => {
        triviaIndexPromise = null
        throw err
      })
  }
  return triviaIndexPromise
}

/**
 * Trivia entries for one chapter in a given translation.
 * @returns {Array} Entries (empty when the index isn't loaded)
 */
export function getChapterTrivia(index, versionKey, book, chapter) {
  if (!index || !book || !chapter) return []
  // Trivia references use standard Psalm numbering, which doesn't line up with
  // Vulgate-numbered translations such as Douay-Rheims.
  if (book === 'PSA' && BIBLE_VERSIONS[versionKey]?.psalmNumbering === 'vulgate') return []
  return index.get(`${book}:${chapter}`) || []
}

/**
 * Human-readable reference for an entry, e.g. "Ecclesiastes 3:1–8".
 */
export function formatTriviaReference(entry) {
  const name = BOOK_NAMES.get(entry.book) || entry.book
  if (entry.verseStart == null) return `${name} ${entry.chapter}`
  const range = entry.verseEnd && entry.verseEnd !== entry.verseStart ? `–${entry.verseEnd}` : ''
  return `${name} ${entry.chapter}:${entry.verseStart}${range}`
}
