import { BIBLE_VERSIONS, getPassageId } from '../utils/bibleStructure'
import { getToken } from 'firebase/app-check'
import { appCheck, auth } from './firebase'

const LOCAL_BIBLE_BASE = `${import.meta.env.BASE_URL}bibles`
const BIBLE_PROXY_BASE = import.meta.env.VITE_BIBLE_PROXY_BASE || '/api/bible'


/**
 * Fetch a Bible passage from local static Bible data.
 * @param {string} versionKey - Key from BIBLE_VERSIONS (e.g., 'WEB')
 * @param {string} bookAbbrev - Book abbreviation (e.g., 'GEN')
 * @param {number} chapter - Chapter number
 * @returns {Object} Passage data with content
 */
export async function fetchPassage(versionKey, bookAbbrev, chapter) {
  const version = BIBLE_VERSIONS[versionKey] || BIBLE_VERSIONS.WEB

  if (version.source === 'api') {
    return fetchApiPassage(version, bookAbbrev, chapter)
  }

  return fetchLocalPassage(version, bookAbbrev, chapter)
}

async function fetchLocalPassage(version, bookAbbrev, chapter) {
  try {
    const response = await fetch(`${LOCAL_BIBLE_BASE}/${version.key}/${bookAbbrev}/${chapter}.json`)

    if (!response.ok) {
      throw new Error(`Bible data error: ${response.status}`)
    }

    const data = await response.json()
    return {
      reference: data.reference,
      content: formatVerses(data.verses),
      copyright: data.copyright
    }
  } catch (error) {
    console.error('Error fetching passage:', error)
    throw error
  }
}

async function fetchApiPassage(version, bookAbbrev, chapter) {
  const passageId = getPassageId(bookAbbrev, chapter)
  const headers = {}

  const user = auth.currentUser
  if (user) {
    try {
      headers.Authorization = `Bearer ${await user.getIdToken()}`
    } catch (err) {
      console.warn('Failed to get auth token:', err)
    }
  }

  if (appCheck) {
    try {
      const token = await getToken(appCheck, false)
      if (token?.token) {
        headers['X-Firebase-AppCheck'] = token.token
      }
    } catch (err) {
      console.warn('App Check token fetch failed:', err)
    }
  }

  const response = await fetch(
    `${BIBLE_PROXY_BASE}/bibles/${version.id}/chapters/${passageId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true`,
    { headers }
  )

  if (!response.ok) {
    throw new Error(`Bible API error: ${response.status}`)
  }

  const data = await response.json()
  return {
    reference: data.data.reference,
    content: cleanApiPassageContent(data.data.content),
    copyright: data.data.copyright
  }
}

function cleanApiPassageContent(content) {
  if (!content) return ''

  return content
    .replace(/\[[\d]+\]/g, '')
    .replace(/¶/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Fetch multiple passages (for a day's reading)
 * @param {string} versionKey - Bible version key
 * @param {Array} passages - Array of {abbrev, chapter} objects
 * @returns {Array} Array of passage data
 */
export async function fetchDayPassages(versionKey, passages) {
  const results = await Promise.all(
    passages.map(p => fetchPassage(versionKey, p.abbrev, p.chapter))
  )
  return results
}

function formatVerses(verses = []) {
  return verses
    .map(verse => `${verse.verse} ${verse.text}`)
    .join('\n\n')
}

/**
 * Check if bundled Bible data is available client-side.
 * @returns {boolean} True when the app can attempt local Bible data loads
 */
export function isBibleDataAvailable() {
  return true
}

/**
 * Get available Bible versions
 * @returns {Array} Array of version objects
 */
export function getAvailableVersions() {
  return Object.entries(BIBLE_VERSIONS).map(([key, value]) => ({
    key,
    ...value
  }))
}
