// Signed-in screens are shown in the reader's language (settings.language,
// chosen once in onboarding). The public pages stay English.
import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { createT, getLanguage } from './translate'

export { createT, getLanguage }

export function useLanguage() {
  const { userDoc } = useAuth()
  return getLanguage(userDoc?.settings)
}

export function useT() {
  const language = useLanguage()
  return useMemo(() => createT(language), [language])
}
