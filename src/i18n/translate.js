// Plain translation helpers (no React), usable from utils and services.
import en from './en'
import es from './es'

const DICTIONARIES = { en, es }

// Accounts from before Spanish support have no language: they're English.
export function getLanguage(settings) {
  return settings?.language === 'es' ? 'es' : 'en'
}

/**
 * Translator for a language. Entries are strings with {name} placeholders,
 * or functions of the variables (for plurals and grammar).
 * Missing Spanish entries fall back to English.
 */
export function createT(language) {
  const dictionary = DICTIONARIES[language] || en
  return function t(key, vars = {}) {
    const entry = dictionary[key] ?? en[key]
    if (entry == null) return key
    if (typeof entry === 'function') return entry(vars)
    return entry.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match))
  }
}
