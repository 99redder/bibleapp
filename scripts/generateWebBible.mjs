import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { BIBLE_BOOKS } from '../src/utils/bibleStructure.js'

const SOURCE_URL = 'https://ebible.org/Scriptures/eng-web_usfm.zip'
const OUT_DIR = join(process.cwd(), 'public', 'bibles', 'WEB')
const WORK_DIR = join(process.cwd(), '.tmp', 'eng-web-usfm')
const ZIP_PATH = join(process.cwd(), '.tmp', 'eng-web_usfm.zip')
const COPYRIGHT = 'World English Bible (WEB), Public Domain. Source: https://ebible.org/Scriptures/eng-web_usfm.zip'

const SOURCE_ID_OVERRIDES = {
  NAH: 'NAM'
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function downloadSource() {
  ensureDir(join(process.cwd(), '.tmp'))

  if (!existsSync(ZIP_PATH)) {
    execFileSync('curl', ['-L', '--fail', SOURCE_URL, '-o', ZIP_PATH], { stdio: 'inherit' })
  }

  rmSync(WORK_DIR, { recursive: true, force: true })
  ensureDir(WORK_DIR)
  execFileSync('unzip', ['-q', ZIP_PATH, '-d', WORK_DIR])
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

function parseBook(filePath, expectedSourceId) {
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

    const idMatch = line.match(/^\\id\s+(\S+)/)
    if (idMatch && idMatch[1] !== expectedSourceId) {
      throw new Error(`Expected ${expectedSourceId}, found ${idMatch[1]} in ${filePath}`)
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

    if (currentVerse && /^\\(p|m|q|pi|li|nb|b)\b/.test(line)) {
      currentVerse.parts.push(line)
    }
  }

  commitVerse()
  return chapters
}

function findUsfmFile(sourceId) {
  const suffix = `${sourceId}eng-web.usfm`
  const match = readdirSync(WORK_DIR).find(file => file.endsWith(suffix))
  if (!match) {
    throw new Error(`Missing USFM file for ${sourceId}`)
  }
  return join(WORK_DIR, match)
}

function writeBibleData() {
  rmSync(OUT_DIR, { recursive: true, force: true })
  ensureDir(OUT_DIR)

  const manifest = {
    key: 'WEB',
    name: 'World English Bible',
    abbreviation: 'WEB',
    sourceUrl: SOURCE_URL,
    copyright: COPYRIGHT,
    books: []
  }

  let chapterCount = 0
  let verseCount = 0

  for (const book of BIBLE_BOOKS) {
    const sourceId = SOURCE_ID_OVERRIDES[book.abbrev] || book.abbrev
    const chapters = parseBook(findUsfmFile(sourceId), sourceId)
    const bookDir = join(OUT_DIR, book.abbrev)
    ensureDir(bookDir)

    manifest.books.push({
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters
    })

    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      const verses = chapters.get(chapter)
      if (!verses?.length) {
        throw new Error(`Missing ${book.abbrev} ${chapter}`)
      }

      const payload = {
        version: 'WEB',
        book: book.name,
        abbrev: book.abbrev,
        chapter,
        reference: `${book.name} ${chapter}`,
        verses,
        copyright: COPYRIGHT
      }

      writeFileSync(join(bookDir, `${chapter}.json`), `${JSON.stringify(payload)}\n`)
      chapterCount += 1
      verseCount += verses.length
    }
  }

  manifest.chapterCount = chapterCount
  manifest.verseCount = verseCount
  writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Generated ${chapterCount} chapters and ${verseCount} verses in ${basename(OUT_DIR)}`)
}

downloadSource()
writeBibleData()
