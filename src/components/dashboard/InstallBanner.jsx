import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInstallState } from '../../hooks/useInstallState'
import { promptInstall } from '../../services/installPrompt'
import { useT } from '../../i18n'

const DISMISSED_KEY = 'installBannerDismissed'

// Invitation to install the app, shown in the browser only (never inside the
// installed app). Dismissing hides it on this device; "Install app" in the
// settings menu stays available.
export function InstallBanner() {
  const t = useT()
  const { standalone, canPrompt, installed } = useInstallState()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      return false
    }
  })

  if (standalone || installed || dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="card flex items-start gap-3">
      <img src="/apple-touch-icon.png" alt="" className="h-11 w-11 shrink-0 rounded-xl shadow-sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('install.title')}</p>
        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
          {t('install.body')}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {canPrompt ? (
            <button
              type="button"
              onClick={promptInstall}
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('install.install')}
            </button>
          ) : (
            <Link
              to="/install"
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('install.showMe')}
            </Link>
          )}
          {canPrompt && (
            <Link
              to="/install"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t('install.learnMore')}
            </Link>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t('install.dismiss')}
        className="-mr-1 -mt-1 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
