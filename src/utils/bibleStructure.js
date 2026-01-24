// Complete Bible structure with chapter counts for each book
export const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', abbrev: 'GEN', chapters: 50, testament: 'OT' },
  { name: 'Exodus', abbrev: 'EXO', chapters: 40, testament: 'OT' },
  { name: 'Leviticus', abbrev: 'LEV', chapters: 27, testament: 'OT' },
  { name: 'Numbers', abbrev: 'NUM', chapters: 36, testament: 'OT' },
  { name: 'Deuteronomy', abbrev: 'DEU', chapters: 34, testament: 'OT' },
  { name: 'Joshua', abbrev: 'JOS', chapters: 24, testament: 'OT' },
  { name: 'Judges', abbrev: 'JDG', chapters: 21, testament: 'OT' },
  { name: 'Ruth', abbrev: 'RUT', chapters: 4, testament: 'OT' },
  { name: '1 Samuel', abbrev: '1SA', chapters: 31, testament: 'OT' },
  { name: '2 Samuel', abbrev: '2SA', chapters: 24, testament: 'OT' },
  { name: '1 Kings', abbrev: '1KI', chapters: 22, testament: 'OT' },
  { name: '2 Kings', abbrev: '2KI', chapters: 25, testament: 'OT' },
  { name: '1 Chronicles', abbrev: '1CH', chapters: 29, testament: 'OT' },
  { name: '2 Chronicles', abbrev: '2CH', chapters: 36, testament: 'OT' },
  { name: 'Ezra', abbrev: 'EZR', chapters: 10, testament: 'OT' },
  { name: 'Nehemiah', abbrev: 'NEH', chapters: 13, testament: 'OT' },
  { name: 'Esther', abbrev: 'EST', chapters: 10, testament: 'OT' },
  { name: 'Job', abbrev: 'JOB', chapters: 42, testament: 'OT' },
  { name: 'Psalms', abbrev: 'PSA', chapters: 150, testament: 'OT' },
  { name: 'Proverbs', abbrev: 'PRO', chapters: 31, testament: 'OT' },
  { name: 'Ecclesiastes', abbrev: 'ECC', chapters: 12, testament: 'OT' },
  { name: 'Song of Solomon', abbrev: 'SNG', chapters: 8, testament: 'OT' },
  { name: 'Isaiah', abbrev: 'ISA', chapters: 66, testament: 'OT' },
  { name: 'Jeremiah', abbrev: 'JER', chapters: 52, testament: 'OT' },
  { name: 'Lamentations', abbrev: 'LAM', chapters: 5, testament: 'OT' },
  { name: 'Ezekiel', abbrev: 'EZK', chapters: 48, testament: 'OT' },
  { name: 'Daniel', abbrev: 'DAN', chapters: 12, testament: 'OT' },
  { name: 'Hosea', abbrev: 'HOS', chapters: 14, testament: 'OT' },
  { name: 'Joel', abbrev: 'JOL', chapters: 3, testament: 'OT' },
  { name: 'Amos', abbrev: 'AMO', chapters: 9, testament: 'OT' },
  { name: 'Obadiah', abbrev: 'OBA', chapters: 1, testament: 'OT' },
  { name: 'Jonah', abbrev: 'JON', chapters: 4, testament: 'OT' },
  { name: 'Micah', abbrev: 'MIC', chapters: 7, testament: 'OT' },
  { name: 'Nahum', abbrev: 'NAH', chapters: 3, testament: 'OT' },
  { name: 'Habakkuk', abbrev: 'HAB', chapters: 3, testament: 'OT' },
  { name: 'Zephaniah', abbrev: 'ZEP', chapters: 3, testament: 'OT' },
  { name: 'Haggai', abbrev: 'HAG', chapters: 2, testament: 'OT' },
  { name: 'Zechariah', abbrev: 'ZEC', chapters: 14, testament: 'OT' },
  { name: 'Malachi', abbrev: 'MAL', chapters: 4, testament: 'OT' },
  // New Testament
  { name: 'Matthew', abbrev: 'MAT', chapters: 28, testament: 'NT' },
  { name: 'Mark', abbrev: 'MRK', chapters: 16, testament: 'NT' },
  { name: 'Luke', abbrev: 'LUK', chapters: 24, testament: 'NT' },
  { name: 'John', abbrev: 'JHN', chapters: 21, testament: 'NT' },
  { name: 'Acts', abbrev: 'ACT', chapters: 28, testament: 'NT' },
  { name: 'Romans', abbrev: 'ROM', chapters: 16, testament: 'NT' },
  { name: '1 Corinthians', abbrev: '1CO', chapters: 16, testament: 'NT' },
  { name: '2 Corinthians', abbrev: '2CO', chapters: 13, testament: 'NT' },
  { name: 'Galatians', abbrev: 'GAL', chapters: 6, testament: 'NT' },
  { name: 'Ephesians', abbrev: 'EPH', chapters: 6, testament: 'NT' },
  { name: 'Philippians', abbrev: 'PHP', chapters: 4, testament: 'NT' },
  { name: 'Colossians', abbrev: 'COL', chapters: 4, testament: 'NT' },
  { name: '1 Thessalonians', abbrev: '1TH', chapters: 5, testament: 'NT' },
  { name: '2 Thessalonians', abbrev: '2TH', chapters: 3, testament: 'NT' },
  { name: '1 Timothy', abbrev: '1TI', chapters: 6, testament: 'NT' },
  { name: '2 Timothy', abbrev: '2TI', chapters: 4, testament: 'NT' },
  { name: 'Titus', abbrev: 'TIT', chapters: 3, testament: 'NT' },
  { name: 'Philemon', abbrev: 'PHM', chapters: 1, testament: 'NT' },
  { name: 'Hebrews', abbrev: 'HEB', chapters: 13, testament: 'NT' },
  { name: 'James', abbrev: 'JAS', chapters: 5, testament: 'NT' },
  { name: '1 Peter', abbrev: '1PE', chapters: 5, testament: 'NT' },
  { name: '2 Peter', abbrev: '2PE', chapters: 3, testament: 'NT' },
  { name: '1 John', abbrev: '1JN', chapters: 5, testament: 'NT' },
  { name: '2 John', abbrev: '2JN', chapters: 1, testament: 'NT' },
  { name: '3 John', abbrev: '3JN', chapters: 1, testament: 'NT' },
  { name: 'Jude', abbrev: 'JUD', chapters: 1, testament: 'NT' },
  { name: 'Revelation', abbrev: 'REV', chapters: 22, testament: 'NT' }
]

// Total chapters in the Bible: 1,189
export const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0)

// Testament identifiers
export const TESTAMENTS = {
  OT: 'OT',
  NT: 'NT',
  BOTH: 'BOTH'
}

// Chapter counts by testament
export const OT_CHAPTERS = 929
export const NT_CHAPTERS = 260

// Get all chapters as a flat array for easy distribution
export function getAllChapters(testament = 'BOTH') {
  const chapters = []
  const filteredBooks = testament === 'BOTH'
    ? BIBLE_BOOKS
    : BIBLE_BOOKS.filter(book => book.testament === testament)

  filteredBooks.forEach(book => {
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

// Get total chapter count for a testament
export function getTestamentChapterCount(testament) {
  switch(testament) {
    case TESTAMENTS.OT:
      return OT_CHAPTERS
    case TESTAMENTS.NT:
      return NT_CHAPTERS
    case TESTAMENTS.BOTH:
      return TOTAL_CHAPTERS
    default:
      return TOTAL_CHAPTERS
  }
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
