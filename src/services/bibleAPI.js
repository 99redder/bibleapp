import { BIBLE_VERSIONS, getPassageId } from '../utils/bibleStructure'

const API_BASE = 'https://api.scripture.api.bible/v1'
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY

/**
 * Fetch a Bible passage from API.Bible
 * @param {string} versionKey - Key from BIBLE_VERSIONS (e.g., 'KJV')
 * @param {string} bookAbbrev - Book abbreviation (e.g., 'GEN')
 * @param {number} chapter - Chapter number
 * @returns {Object} Passage data with content
 */
export async function fetchPassage(versionKey, bookAbbrev, chapter) {
  const version = BIBLE_VERSIONS[versionKey] || BIBLE_VERSIONS.KJV
  const passageId = getPassageId(bookAbbrev, chapter)

  try {
    const response = await fetch(
      `${API_BASE}/bibles/${version.id}/chapters/${passageId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true`,
      {
        headers: {
          'api-key': API_KEY
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      reference: data.data.reference,
      content: cleanPassageContent(data.data.content),
      copyright: data.data.copyright
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
function cleanPassageContent(content) {
  if (!content) return ''

  // Remove paragraph markers and extra whitespace
  let cleaned = content
    .replace(/\[[\d]+\]/g, '') // Remove footnote markers like [1]
    .replace(/¶/g, '\n\n') // Convert pilcrow to paragraph break
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .trim()

  return cleaned
}

/**
 * Check if API is configured and working
 * @returns {boolean} True if API is configured
 */
export function isAPIConfigured() {
  return Boolean(API_KEY)
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
