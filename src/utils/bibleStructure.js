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

// Spanish book names by book code. Saved plans keep the English name and the
// code, so Spanish readers' titles are looked up here by code.
export const BOOK_NAMES_ES = {
  GEN: 'Génesis',
  EXO: 'Éxodo',
  LEV: 'Levítico',
  NUM: 'Números',
  DEU: 'Deuteronomio',
  JOS: 'Josué',
  JDG: 'Jueces',
  RUT: 'Rut',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Reyes',
  '2KI': '2 Reyes',
  '1CH': '1 Crónicas',
  '2CH': '2 Crónicas',
  EZR: 'Esdras',
  NEH: 'Nehemías',
  EST: 'Ester',
  JOB: 'Job',
  PSA: 'Salmos',
  PRO: 'Proverbios',
  ECC: 'Eclesiastés',
  SNG: 'Cantares',
  ISA: 'Isaías',
  JER: 'Jeremías',
  LAM: 'Lamentaciones',
  EZK: 'Ezequiel',
  DAN: 'Daniel',
  HOS: 'Oseas',
  JOL: 'Joel',
  AMO: 'Amós',
  OBA: 'Abdías',
  JON: 'Jonás',
  MIC: 'Miqueas',
  NAH: 'Nahúm',
  HAB: 'Habacuc',
  ZEP: 'Sofonías',
  HAG: 'Hageo',
  ZEC: 'Zacarías',
  MAL: 'Malaquías',
  MAT: 'Mateo',
  MRK: 'Marcos',
  LUK: 'Lucas',
  JHN: 'Juan',
  ACT: 'Hechos',
  ROM: 'Romanos',
  '1CO': '1 Corintios',
  '2CO': '2 Corintios',
  GAL: 'Gálatas',
  EPH: 'Efesios',
  PHP: 'Filipenses',
  COL: 'Colosenses',
  '1TH': '1 Tesalonicenses',
  '2TH': '2 Tesalonicenses',
  '1TI': '1 Timoteo',
  '2TI': '2 Timoteo',
  TIT: 'Tito',
  PHM: 'Filemón',
  HEB: 'Hebreos',
  JAS: 'Santiago',
  '1PE': '1 Pedro',
  '2PE': '2 Pedro',
  '1JN': '1 Juan',
  '2JN': '2 Juan',
  '3JN': '3 Juan',
  JUD: 'Judas',
  REV: 'Apocalipsis'
}

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

// Local Bible versions bundled as static JSON under public/bibles
export const BIBLE_VERSIONS = {
  BSB: {
    key: 'BSB',
    name: 'Berean Standard Bible',
    abbreviation: 'BSB',
    language: 'en',
    source: 'local'
  },
  WEB: {
    key: 'WEB',
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'en',
    source: 'local'
  },
  KJV: {
    key: 'KJV',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'en',
    source: 'local'
  },
  ASV: {
    key: 'ASV',
    name: 'American Standard Version',
    abbreviation: 'ASV',
    language: 'en',
    source: 'local'
  },
  BBE: {
    key: 'BBE',
    name: 'Bible in Basic English',
    abbreviation: 'BBE',
    language: 'en',
    source: 'local'
  },
  YLT: {
    key: 'YLT',
    name: "Young's Literal Translation",
    abbreviation: 'YLT',
    language: 'en',
    source: 'local'
  },
  DARBY: {
    key: 'DARBY',
    name: 'Darby Translation',
    abbreviation: 'DARBY',
    language: 'en',
    source: 'local'
  },
  WBT: {
    key: 'WBT',
    name: "Webster's Bible Translation",
    abbreviation: 'WBT',
    language: 'en',
    source: 'local'
  },
  DRA: {
    key: 'DRA',
    name: 'Douay-Rheims 1899 American Edition',
    abbreviation: 'DRA',
    language: 'en',
    source: 'local',
    psalmNumbering: 'vulgate'
  },
  RV: {
    key: 'RV',
    name: 'Revised Version 1885',
    abbreviation: 'RV',
    language: 'en',
    source: 'local'
  },
  T4T: {
    key: 'T4T',
    name: 'Translation for Translators',
    abbreviation: 'T4T',
    language: 'en',
    source: 'local',
    // CC BY-SA requires visible credit; ReadingCard shows it under the text.
    credit: {
      text: 'Translation for Translators © 2008–2017 Ellis W. Deibler, Jr.',
      license: 'CC BY-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/'
    }
  },
  RVR1909: {
    key: 'RVR1909',
    name: 'Reina-Valera 1909',
    abbreviation: 'RVR1909',
    language: 'es',
    source: 'local'
  },
  BLM: {
    key: 'BLM',
    name: 'Santa Biblia libre para el mundo',
    abbreviation: 'BLM',
    language: 'es',
    source: 'local'
  },
  VBL: {
    key: 'VBL',
    name: 'Versión Biblia Libre',
    abbreviation: 'VBL',
    language: 'es',
    source: 'local',
    credit: {
      text: 'Versión Biblia Libre © 2018–2020 Jonathan Gallagher y Shelly Barrios de Avila',
      license: 'CC BY-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es'
    }
  }
}

// A reader's language is chosen once, in onboarding. Accounts from before
// Spanish support have no language and are English.
export const DEFAULT_VERSION_BY_LANGUAGE = { en: 'WEB', es: 'RVR1909' }

// Translations a reader of this language is offered (English readers never
// see the Spanish ones, and vice versa).
export function getVersionsForLanguage(language = 'en') {
  return Object.values(BIBLE_VERSIONS).filter(version => version.language === language)
}
