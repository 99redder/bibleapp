import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoBadge } from '../components/ui/BrandLogo'
import { useInstallState } from '../hooks/useInstallState'
import { promptInstall } from '../services/installPrompt'
import { isLegacyHost } from '../utils/browserDetection'
import { INSTALL_GUIDES, browserGuideForPlatform, guideForPlatform } from '../utils/installGuides'

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
        {copied ? 'Link copied ✓' : 'Copy link'}
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
  ['📱', 'Opens full-screen from your home screen, like any app'],
  ['⚡', 'Loads fast and picks up right where you left off'],
  ['✈️', "Readings you've opened work even without a connection"],
  ['🔄', 'Always up to date — no app store updates needed']
]

const FAQS = [
  {
    question: 'Is this safe?',
    answer: 'Yes. Bible Reading Plan is a web app from biblereadingplan.app, made by Eastern Shore AI, LLC. Installing adds it to your home screen so it opens full-screen; it runs with the same protections as any website, and you can remove it anytime.'
  },
  {
    question: "Why isn't it in the App Store or Google Play?",
    answer: "It doesn't need to be. Web apps install straight from your browser in a few seconds, take up very little space, and update automatically."
  },
  {
    question: 'How do I remove it?',
    answer: 'Press and hold the Bible Reading Plan icon and choose Remove App or Uninstall — just like any other app. Your reading plan stays saved to your account.'
  }
]

// On the old domain, installing would just reinstall the old app, so explain
// how to move to the new one instead.
function MoveCard({ standalone }) {
  return (
    <div className="card mt-8">
      <p className="text-lg font-semibold text-gray-900 dark:text-white">Bible Reading Plan has moved</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {standalone ? 'This is the old app.' : 'This is the old address.'} Your plan and progress are saved to your
        account, so nothing is lost when you switch.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200">
        <li>
          Open Safari (iPhone) or Chrome (Android) yourself and go to <strong>biblereadingplan.app</strong>. Links
          opened from inside this app can land in a small viewer that can't install apps.
        </li>
        <li>Sign in with the same account.</li>
        <li>Add it to your home screen: on iPhone tap Share, then Add to Home Screen; on Android tap Install app.</li>
        <li>Delete this old app from your home screen.</li>
      </ol>
      <CopyLinkButton />
    </div>
  )
}

export function InstallPage() {
  const { user } = useAuth()
  const { platform, standalone, canPrompt, installed } = useInstallState()
  const detectedGuideKey = guideForPlatform(platform)
  const [guideKey, setGuideKey] = useState(detectedGuideKey)
  const [promptOutcome, setPromptOutcome] = useState(null)
  const guide = INSTALL_GUIDES[guideKey]
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
          &larr; Back
        </Link>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Install Bible Reading Plan</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Put your daily reading one tap away. The app opens full-screen, loads fast, and works offline.
          </p>
        </header>

        {isLegacyHost() ? (
          <MoveCard standalone={standalone} />
        ) : standalone || installed ? (
          <div className="card mt-8 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {standalone ? "You're using the installed app 🎉" : 'Installed! 🎉'}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {standalone
                ? "You're all set — Bible Reading Plan is on your device."
                : 'Open Bible Reading Plan from your home screen or app list.'}
            </p>
          </div>
        ) : (
          <>
            {canPrompt && guide.oneTap && (
              <div className="card mt-8 text-center ring-1 ring-primary-200 dark:ring-primary-500/30">
                <p className="font-semibold text-gray-900 dark:text-white">Your browser can install Bible Reading Plan in one tap.</p>
                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-4 w-full rounded-lg bg-primary-600 py-3 font-semibold text-white shadow-md hover:bg-primary-700"
                >
                  Install Bible Reading Plan
                </button>
                {promptOutcome === 'dismissed' && (
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    No problem — you can install anytime with the steps below.
                  </p>
                )}
              </div>
            )}

            <section className="mt-8" aria-labelledby="install-steps-title">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="install-steps-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {canPrompt && guide.oneTap ? 'Or install it yourself' : 'How to install'}
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {guideKey === detectedGuideKey ? 'Detected for your device' : 'Showing another device'}
                </span>
              </div>

              <label htmlFor="install-device" className="mt-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Device and browser
              </label>
              <select
                id="install-device"
                value={guideKey}
                onChange={(e) => setGuideKey(e.target.value)}
                className="input mt-1 bg-white dark:bg-gray-800"
              >
                {Object.entries(INSTALL_GUIDES).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}{key === detectedGuideKey ? ' (this device)' : ''}
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
                          Show the {INSTALL_GUIDES[browserGuideKey].label} steps →
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
                    Install on iPhone
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideKey('android-chrome')}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Install on Android
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        <section className="card mt-8">
          <h2 className="font-semibold text-gray-900 dark:text-white">Why install it?</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {BENEFITS.map(([icon, text]) => (
              <li key={text} className="flex gap-3">
                <span aria-hidden="true">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-2" aria-label="Questions about installing">
          {FAQS.map(faq => (
            <details key={faq.question} className="card group">
              <summary className="cursor-pointer list-none font-medium text-gray-900 marker:hidden dark:text-white">
                <span className="flex items-center justify-between gap-2">
                  {faq.question}
                  <svg className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}
