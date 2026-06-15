import { BIBLE_VERSIONS } from '../utils/bibleStructure'

const LOCAL_BIBLE_BASE = `${import.meta.env.BASE_URL}bibles`


/**
 * Fetch a Bible passage from local static Bible data.
 * @param {string} versionKey - Key from BIBLE_VERSIONS (e.g., 'WEB')
 * @param {string} bookAbbrev - Book abbreviation (e.g., 'GEN')
 * @param {number} chapter - Chapter number
 * @returns {Object} Passage data with content
 */
export async function fetchPassage(versionKey, bookAbbrev, chapter) {
  const version = BIBLE_VERSIONS[versionKey] || BIBLE_VERSIONS.WEB

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

/**
 * Clean up passage content from API
 * @param {string} content - Raw content from API
 * @returns {string} Cleaned content
 */
function formatVerses(verses = []) {
  return verses
    .map(verse => `${verse.verse} ${verse.text}`)
    .join('\n\n')
}

/**
 * Check if API is configured and working
 * @returns {boolean} True if API is configured
 */
export function isAPIConfigured() {
  // The proxy is always "configured" client-side.
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
