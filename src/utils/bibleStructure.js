// Complete Bible structure with chapter counts for each book
export const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', abbrev: 'GEN', chapters: 50 },
  { name: 'Exodus', abbrev: 'EXO', chapters: 40 },
  { name: 'Leviticus', abbrev: 'LEV', chapters: 27 },
  { name: 'Numbers', abbrev: 'NUM', chapters: 36 },
  { name: 'Deuteronomy', abbrev: 'DEU', chapters: 34 },
  { name: 'Joshua', abbrev: 'JOS', chapters: 24 },
  { name: 'Judges', abbrev: 'JDG', chapters: 21 },
  { name: 'Ruth', abbrev: 'RUT', chapters: 4 },
  { name: '1 Samuel', abbrev: '1SA', chapters: 31 },
  { name: '2 Samuel', abbrev: '2SA', chapters: 24 },
  { name: '1 Kings', abbrev: '1KI', chapters: 22 },
  { name: '2 Kings', abbrev: '2KI', chapters: 25 },
  { name: '1 Chronicles', abbrev: '1CH', chapters: 29 },
  { name: '2 Chronicles', abbrev: '2CH', chapters: 36 },
  { name: 'Ezra', abbrev: 'EZR', chapters: 10 },
  { name: 'Nehemiah', abbrev: 'NEH', chapters: 13 },
  { name: 'Esther', abbrev: 'EST', chapters: 10 },
  { name: 'Job', abbrev: 'JOB', chapters: 42 },
  { name: 'Psalms', abbrev: 'PSA', chapters: 150 },
  { name: 'Proverbs', abbrev: 'PRO', chapters: 31 },
  { name: 'Ecclesiastes', abbrev: 'ECC', chapters: 12 },
  { name: 'Song of Solomon', abbrev: 'SNG', chapters: 8 },
  { name: 'Isaiah', abbrev: 'ISA', chapters: 66 },
  { name: 'Jeremiah', abbrev: 'JER', chapters: 52 },
  { name: 'Lamentations', abbrev: 'LAM', chapters: 5 },
  { name: 'Ezekiel', abbrev: 'EZK', chapters: 48 },
  { name: 'Daniel', abbrev: 'DAN', chapters: 12 },
  { name: 'Hosea', abbrev: 'HOS', chapters: 14 },
  { name: 'Joel', abbrev: 'JOL', chapters: 3 },
  { name: 'Amos', abbrev: 'AMO', chapters: 9 },
  { name: 'Obadiah', abbrev: 'OBA', chapters: 1 },
  { name: 'Jonah', abbrev: 'JON', chapters: 4 },
  { name: 'Micah', abbrev: 'MIC', chapters: 7 },
  { name: 'Nahum', abbrev: 'NAH', chapters: 3 },
  { name: 'Habakkuk', abbrev: 'HAB', chapters: 3 },
  { name: 'Zephaniah', abbrev: 'ZEP', chapters: 3 },
  { name: 'Haggai', abbrev: 'HAG', chapters: 2 },
  { name: 'Zechariah', abbrev: 'ZEC', chapters: 14 },
  { name: 'Malachi', abbrev: 'MAL', chapters: 4 },
  // New Testament
  { name: 'Matthew', abbrev: 'MAT', chapters: 28 },
  { name: 'Mark', abbrev: 'MRK', chapters: 16 },
  { name: 'Luke', abbrev: 'LUK', chapters: 24 },
  { name: 'John', abbrev: 'JHN', chapters: 21 },
  { name: 'Acts', abbrev: 'ACT', chapters: 28 },
  { name: 'Romans', abbrev: 'ROM', chapters: 16 },
  { name: '1 Corinthians', abbrev: '1CO', chapters: 16 },
  { name: '2 Corinthians', abbrev: '2CO', chapters: 13 },
  { name: 'Galatians', abbrev: 'GAL', chapters: 6 },
  { name: 'Ephesians', abbrev: 'EPH', chapters: 6 },
  { name: 'Philippians', abbrev: 'PHP', chapters: 4 },
  { name: 'Colossians', abbrev: 'COL', chapters: 4 },
  { name: '1 Thessalonians', abbrev: '1TH', chapters: 5 },
  { name: '2 Thessalonians', abbrev: '2TH', chapters: 3 },
  { name: '1 Timothy', abbrev: '1TI', chapters: 6 },
  { name: '2 Timothy', abbrev: '2TI', chapters: 4 },
  { name: 'Titus', abbrev: 'TIT', chapters: 3 },
  { name: 'Philemon', abbrev: 'PHM', chapters: 1 },
  { name: 'Hebrews', abbrev: 'HEB', chapters: 13 },
  { name: 'James', abbrev: 'JAS', chapters: 5 },
  { name: '1 Peter', abbrev: '1PE', chapters: 5 },
  { name: '2 Peter', abbrev: '2PE', chapters: 3 },
  { name: '1 John', abbrev: '1JN', chapters: 5 },
  { name: '2 John', abbrev: '2JN', chapters: 1 },
  { name: '3 John', abbrev: '3JN', chapters: 1 },
  { name: 'Jude', abbrev: 'JUD', chapters: 1 },
  { name: 'Revelation', abbrev: 'REV', chapters: 22 }
]

// Total chapters in the Bible: 1,189
export const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0)

// Get all chapters as a flat array for easy distribution
export function getAllChapters() {
  const chapters = []
  BIBLE_BOOKS.forEach(book => {
    for (let i = 1; i <= book.chapters; i++) {
      chapters.push({
        book: book.name,
        abbrev: book.abbrev,
        chapter: i
      })
    }
  })
  return chapters
}

// Bible version IDs for API.Bible
export const BIBLE_VERSIONS = {
  KJV: {
    id: 'de4e12af7f28f599-02',
    name: 'King James Version',
    abbreviation: 'KJV'
  },
  ASV: {
    id: '06125adad2d5898a-01',
    name: 'American Standard Version',
    abbreviation: 'ASV'
  },
  WEB: {
    id: '9879dbb7cfe39e4d-04',
    name: 'World English Bible',
    abbreviation: 'WEB'
  },
  BBE: {
    id: '65eec8e0b60e656b-01',
    name: 'Bible in Basic English',
    abbreviation: 'BBE'
  },
  DARBY: {
    id: '478f0e49c63acf21-01',
    name: 'Darby Translation',
    abbreviation: 'DARBY'
  },
  YLT: {
    id: 'f32e5dbdebc937a1-01',
    name: "Young's Literal Translation",
    abbreviation: 'YLT'
  },
  WBT: {
    id: '7142879509583d59-04',
    name: "Webster's Bible Translation",
    abbreviation: 'WBT'
  },
  FBV: {
    id: '65eec8e0b60e656b-01',
    name: 'Free Bible Version',
    abbreviation: 'FBV'
  },
  CPDV: {
    id: 'bba9f40f9c70cddc-01',
    name: 'Catholic Public Domain Version',
    abbreviation: 'CPDV'
  },
  RV: {
    id: '40072c4a5aba4022-01',
    name: 'Revised Version 1885',
    abbreviation: 'RV'
  },
  T4T: {
    id: 'b0f3a3d2dafb7e0b-01',
    name: 'Translation for Translators',
    abbreviation: 'T4T'
  }
}

// Helper to get passage ID for API.Bible
export function getPassageId(abbrev, chapter) {
  return `${abbrev}.${chapter}`
}
