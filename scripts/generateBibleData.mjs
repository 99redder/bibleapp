import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { BIBLE_BOOKS } from '../src/utils/bibleStructure.js'

const TMP_DIR = join(process.cwd(), '.tmp', 'bible-sources')
const OUT_ROOT = join(process.cwd(), 'public', 'bibles')
const BOOK_ID_ALIASES = {
  NAH: ['NAH', 'NAM']
}

const SOURCES = [
  {
    key: 'BSB',
    name: 'Berean Standard Bible',
    abbreviation: 'BSB',
    url: 'https://ebible.org/Scriptures/engbsb_usfm.zip',
    copyright: 'Berean Standard Bible (BSB), Public Domain. Source: https://ebible.org/Scriptures/engbsb_usfm.zip'
  },
  {
    key: 'WEB',
    name: 'World English Bible',
    abbreviation: 'WEB',
    url: 'https://ebible.org/Scriptures/eng-web_usfm.zip',
    copyright: 'World English Bible (WEB), Public Domain. Source: https://ebible.org/Scriptures/eng-web_usfm.zip'
  },
  {
    key: 'KJV',
    name: 'King James Version',
    abbreviation: 'KJV',
    url: 'https://ebible.org/Scriptures/eng-kjv_usfm.zip',
    copyright: 'King James Version (1769), Public Domain. Source: https://ebible.org/Scriptures/eng-kjv_usfm.zip'
  },
  {
    key: 'ASV',
    name: 'American Standard Version',
    abbreviation: 'ASV',
    url: 'https://ebible.org/Scriptures/eng-asv_usfm.zip',
    copyright: 'American Standard Version (1901), Public Domain. Source: https://ebible.org/Scriptures/eng-asv_usfm.zip'
  },
  {
    key: 'BBE',
    name: 'Bible in Basic English',
    abbreviation: 'BBE',
    url: 'https://ebible.org/Scriptures/engBBE_usfm.zip',
    copyright: 'Bible in Basic English, Public Domain. Source: https://ebible.org/Scriptures/engBBE_usfm.zip'
  },
  {
    key: 'YLT',
    name: "Young's Literal Translation",
    abbreviation: 'YLT',
    url: 'https://ebible.org/Scriptures/engylt_usfm.zip',
    copyright: "Young's Literal Translation, Public Domain. Source: https://ebible.org/Scriptures/engylt_usfm.zip"
  },
  {
    key: 'DARBY',
    name: 'Darby Translation',
    abbreviation: 'DARBY',
    url: 'https://ebible.org/Scriptures/engDBY_usfm.zip',
    copyright: 'Darby Translation, Public Domain. Source: https://ebible.org/Scriptures/engDBY_usfm.zip'
  },
  {
    key: 'WBT',
    name: "Webster's Bible Translation",
    abbreviation: 'WBT',
    url: 'https://ebible.org/Scriptures/engwebster_usfm.zip',
    copyright: "Webster's Bible Translation, Public Domain. Source: https://ebible.org/Scriptures/engwebster_usfm.zip"
  },
  {
    key: 'DRA',
    name: 'Douay-Rheims 1899 American Edition',
    abbreviation: 'DRA',
    url: 'https://ebible.org/Scriptures/engDRA_usfm.zip',
    copyright: 'Douay-Rheims 1899 American Edition, Public Domain. Source: https://ebible.org/Scriptures/engDRA_usfm.zip'
  }
]

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function downloadAndExtract(source) {
  const sourceDir = join(TMP_DIR, source.key)
  const zipPath = join(TMP_DIR, `${source.key}.zip`)
  ensureDir(TMP_DIR)

  if (!existsSync(zipPath)) {
    execFileSync('curl', ['-L', '--fail', source.url, '-o', zipPath], { stdio: 'inherit' })
  }

  rmSync(sourceDir, { recursive: true, force: true })
  ensureDir(sourceDir)
  execFileSync('unzip', ['-q', zipPath, '-d', sourceDir])
  return sourceDir
}

function cleanInlineUsfm(text) {
  return text
    .replace(/\\f\b[\s\S]*?\\f\*/g, '')
    .replace(/\\x\b[\s\S]*?\\x\*/g, '')
    .replace(/\\zaln-s\b[^\\]*(?:\\\*)?/g, '')
    .replace(/\\zaln-e\\\*/g, '')
    .replace(/\\\+?w\s+([^|\\]+?)(?:\|[^\\]*)?\\\+?w\*/g, '$1')
    .replace(/\\\+\w+\s+([^\\]+?)\\\+\w+\*/g, '$1')
    .replace(/\\[a-z0-9+-]+\*?/gi, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+([”’])/g, '$1')
    .replace(/([“‘])\s+/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

function readUsfmFiles(sourceDir) {
  return readdirSync(sourceDir)
    .filter(file => file.toLowerCase().endsWith('.usfm'))
    .map(file => join(sourceDir, file))
}

function getBookId(filePath) {
  const firstLine = readFileSync(filePath, 'utf8').split(/\r?\n/, 1)[0] || ''
  const match = firstLine.match(/^\\id\s+(\S+)/)
  return match?.[1] || null
}

function buildBookFileMap(sourceDir) {
  const map = new Map()
  for (const filePath of readUsfmFiles(sourceDir)) {
    const bookId = getBookId(filePath)
    if (bookId && !map.has(bookId)) {
      map.set(bookId, filePath)
    }
  }
  return map
}

function parseBook(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)
  const chapters = new Map()
  let currentChapter = null
  let currentVerse = null

  function commitVerse() {
    if (!currentChapter || !currentVerse) {
      return
    }

    const text = cleanInlineUsfm(currentVerse.parts.join(' '))
    if (text) {
      if (!chapters.has(currentChapter)) {
        chapters.set(currentChapter, [])
      }
      chapters.get(currentChapter).push({
        verse: currentVerse.verse,
        text
      })
    }

    currentVerse = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }

    const chapterMatch = line.match(/^\\c\s+(\d+)/)
    if (chapterMatch) {
      commitVerse()
      currentChapter = Number(chapterMatch[1])
      continue
    }

    const verseMatch = line.match(/^\\v\s+(\d+)\s*(.*)$/)
    if (verseMatch) {
      commitVerse()
      currentVerse = {
        verse: Number(verseMatch[1]),
        parts: [verseMatch[2]]
      }
      continue
    }

    if (currentVerse && /^\\(p|m|q|pi|li|nb|b|wj)\b/.test(line)) {
      currentVerse.parts.push(line)
    }
  }

  commitVerse()
  return chapters
}

function writeSourceData(source) {
  const sourceDir = downloadAndExtract(source)
  const bookFiles = buildBookFileMap(sourceDir)
  const outDir = join(OUT_ROOT, source.key)
  rmSync(outDir, { recursive: true, force: true })
  ensureDir(outDir)

  const manifest = {
    key: source.key,
    name: source.name,
    abbreviation: source.abbreviation,
    sourceUrl: source.url,
    copyright: source.copyright,
    books: []
  }

  let chapterCount = 0
  let verseCount = 0

  for (const book of BIBLE_BOOKS) {
    const sourceBookIds = BOOK_ID_ALIASES[book.abbrev] || [book.abbrev]
    const filePath = sourceBookIds.map(bookId => bookFiles.get(bookId)).find(Boolean)
    if (!filePath) {
      throw new Error(`${source.key}: Missing USFM file for ${book.abbrev}`)
    }

    const chapters = parseBook(filePath)
    const bookDir = join(outDir, book.abbrev)
    ensureDir(bookDir)

    manifest.books.push({
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters
    })

    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      const verses = chapters.get(chapter)
      if (!verses?.length) {
        throw new Error(`${source.key}: Missing ${book.abbrev} ${chapter}`)
      }

      const payload = {
        version: source.key,
        book: book.name,
        abbrev: book.abbrev,
        chapter,
        reference: `${book.name} ${chapter}`,
        verses,
        copyright: source.copyright
      }

      writeFileSync(join(bookDir, `${chapter}.json`), `${JSON.stringify(payload)}\n`)
      chapterCount += 1
      verseCount += verses.length
    }
  }

  manifest.chapterCount = chapterCount
  manifest.verseCount = verseCount
  writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Generated ${chapterCount} chapters and ${verseCount} verses in ${basename(outDir)}`)
}

rmSync(TMP_DIR, { recursive: true, force: true })
ensureDir(OUT_ROOT)

for (const source of SOURCES) {
  writeSourceData(source)
}
