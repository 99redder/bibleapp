import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const BookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h12v16H6V4zm2 2v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z"/>
  </svg>
)

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

export function NotFoundPage() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user, userDoc } = useAuth()

  const homeLink = user
    ? userDoc?.onboardingComplete
      ? '/dashboard'
      : '/onboarding'
    : '/'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={homeLink} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">Bible Planner App</span>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">

          {/* Icon */}
          <div className="mx-auto w-24 h-24 mb-8 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg relative">
            <BookIcon className="w-14 h-14 text-white" />
            <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
              ?
            </span>
          </div>

          {/* 404 */}
          <p className="text-8xl font-extrabold text-primary-600 dark:text-primary-400 leading-none mb-4">
            404
          </p>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist. It may have been moved or the link may be incorrect.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 italic mb-10">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo; — Psalm 119:105
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={homeLink}
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl text-base transition-colors shadow-md"
            >
              Back to Home
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-8 py-3 rounded-xl text-base transition-colors"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Bible Planner App</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Website created and maintained by{' '}
          <a
            href="https://www.easternshore.ai"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary-400 transition-colors"
          >
            Eastern Shore AI, LLC
          </a>
        </p>
        <p className="text-xs text-gray-500">
          <Link to="/privacy" className="hover:text-primary-400 transition-colors">
            Privacy Policy
          </Link>
          {' · '}
          <Link to="/terms" className="hover:text-primary-400 transition-colors">
            Terms of Service
          </Link>
        </p>
      </footer>

    </div>
  )
}
