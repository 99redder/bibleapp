import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoBadge } from '../components/ui/BrandLogo'
import { useInstallState } from '../hooks/useInstallState'
import { promptInstall } from '../services/installPrompt'
import { INSTALL_GUIDES, browserGuideForPlatform, guideForPlatform } from '../utils/installGuides'
import { INSTALL_GUIDES_ES } from '../utils/installGuides.es'
import { useLanguage, useT } from '../i18n'

const APP_URL = 'https://biblereadingplan.app'

const ICON_PATHS = {
  share: (
    <>
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8" />
    </>
  ),
  add: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  install: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
      <path d="M12 7v6M9.5 10.5L12 13l2.5-2.5" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>
  )
}

function HintIcon({ name }) {
  if (name === 'app') {
    return <img src="/apple-touch-icon.png" alt="" className="h-6 w-6 rounded-md" />
  }
  if (name === 'dots-vertical' || name === 'dots-horizontal') {
    const points = name === 'dots-vertical' ? [[12, 5], [12, 12], [12, 19]] : [[5, 12], [12, 12], [19, 12]]
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {points.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" />)}
      </svg>
    )
  }
  if (!ICON_PATHS[name]) return null
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  )
}

// A small mock of the button the reader is looking for.
function Hint({ icon, label }) {
  const isConfirm = icon === 'confirm'
  return (
    <span
      className={`mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:border-gray-600 dark:bg-gray-800 ${
        isConfirm ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-100'
      }`}
      aria-hidden="true"
    >
      {!isConfirm && <span className="text-primary-600 dark:text-primary-400"><HintIcon name={icon} /></span>}
      {label}
    </span>
  )
}

function CopyLinkButton() {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        {copied ? t('installPage.linkCopied') : t('installPage.copyLink')}
      </button>
      {failed && (
        <p className="mt-2 select-all rounded bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100">
          {APP_URL}
        </p>
      )}
    </div>
  )
}

const BENEFITS = [
  ['📱', 'installPage.benefit.1'],
  ['⚡', 'installPage.benefit.2'],
  ['✈️', 'installPage.benefit.3'],
  ['🔄', 'installPage.benefit.4']
]

const FAQS = [1, 2, 3].map(n => ({
  question: `installPage.faq.${n}.question`,
  answer: `installPage.faq.${n}.answer`
}))

// Shown in Spanish to signed-in Spanish readers; English for everyone else.
export function InstallPage() {
  const { user } = useAuth()
  const t = useT()
  const guides = useLanguage() === 'es' ? INSTALL_GUIDES_ES : INSTALL_GUIDES
  const { platform, standalone, canPrompt, installed } = useInstallState()
  const detectedGuideKey = guideForPlatform(platform)
  const [guideKey, setGuideKey] = useState(detectedGuideKey)
  const [promptOutcome, setPromptOutcome] = useState(null)
  const guide = guides[guideKey]
  const browserGuideKey = browserGuideForPlatform(platform)

  const handleInstall = async () => {
    setPromptOutcome(await promptInstall())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-lg">
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          &larr; {t('common.back')}
        </Link>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('installPage.title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('installPage.intro')}
          </p>
        </header>

        {standalone || installed ? (
          <div className="card mt-8 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {standalone ? t('installPage.usingInstalled') : t('installPage.installed')}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {standalone
                ? t('installPage.allSet')
                : t('installPage.openFromHome')}
            </p>
          </div>
        ) : (
          <>
            {canPrompt && guide.oneTap && (
              <div className="card mt-8 text-center ring-1 ring-primary-200 dark:ring-primary-500/30">
                <p className="font-semibold text-gray-900 dark:text-white">{t('installPage.oneTap')}</p>
                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-4 w-full rounded-lg bg-primary-600 py-3 font-semibold text-white shadow-md hover:bg-primary-700"
                >
                  {t('installPage.installButton')}
                </button>
                {promptOutcome === 'dismissed' && (
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {t('installPage.dismissed')}
                  </p>
                )}
              </div>
            )}

            <section className="mt-8" aria-labelledby="install-steps-title">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="install-steps-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {canPrompt && guide.oneTap ? t('installPage.orYourself') : t('installPage.howTo')}
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {guideKey === detectedGuideKey ? t('installPage.detected') : t('installPage.otherDevice')}
                </span>
              </div>

              <label htmlFor="install-device" className="mt-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('installPage.device')}
              </label>
              <select
                id="install-device"
                value={guideKey}
                onChange={(e) => setGuideKey(e.target.value)}
                className="input mt-1 bg-white dark:bg-gray-800"
              >
                {Object.entries(guides).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}{key === detectedGuideKey ? ` (${t('installPage.thisDevice')})` : ''}
                  </option>
                ))}
              </select>

              <ol className="mt-5 space-y-3">
                {guide.steps.map((step, index) => (
                  <li key={step.title} className="card flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{step.detail}</p>
                      {step.hint && <Hint icon={step.hint.icon} label={step.hint.label} />}
                      {step.action === 'copy-link' && <CopyLinkButton />}
                      {step.action === 'switch-to-browser' && (
                        <button
                          type="button"
                          onClick={() => setGuideKey(browserGuideKey)}
                          className="mt-3 block text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                        >
                          {t('installPage.showSteps', { label: guides[browserGuideKey].label })}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {guide.unsupported && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setGuideKey('ios-safari')}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {t('installPage.onIphone')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideKey('android-chrome')}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {t('installPage.onAndroid')}
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        <section className="card mt-8">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('installPage.why')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {BENEFITS.map(([icon, key]) => (
              <li key={key} className="flex gap-3">
                <span aria-hidden="true">{icon}</span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-2" aria-label={t('installPage.questions')}>
          {FAQS.map(faq => (
            <details key={faq.question} className="card group">
              <summary className="cursor-pointer list-none font-medium text-gray-900 marker:hidden dark:text-white">
                <span className="flex items-center justify-between gap-2">
                  {t(faq.question)}
                  <svg className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{t(faq.answer)}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}
