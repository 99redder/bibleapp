import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const BookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h12v16H6V4zm2 2v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z"/>
  </svg>
)

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

const features = [
  {
    title: 'Your Timeline, Your Pace',
    description: 'Choose a reading plan that fits your life — finish the entire Bible in 6, 12, 18, or 24 months, or set a custom duration. No guilt, no rushing.',
    icon: '📅',
  },
  {
    title: 'Daily Readings on Your Phone',
    description: 'Open the app each day to see exactly which chapters to read. Scripture text loads right in the app — no Bible required.',
    icon: '📖',
  },
  {
    title: 'Track Your Progress',
    description: 'Mark each day complete and watch your progress build. See a calendar of completed days, and know at a glance if you\'re on track, ahead, or behind.',
    icon: '✅',
  },
]

const steps = [
  {
    number: '1',
    title: 'Create a free account',
    description: 'Sign up with email or Google in seconds.',
  },
  {
    number: '2',
    title: 'Set up your plan',
    description: 'Pick your start date, reading timeline, and Bible translation.',
  },
  {
    number: '3',
    title: 'Read a little every day',
    description: 'Open the app daily, read your assigned chapters, and mark them complete.',
  },
]

const versions = ['KJV', 'ASV', 'WEB', 'BBE', 'Darby', 'YLT', 'CPDV', 'RV', 'T4T']

export function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">Bible Planner App</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 sm:px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-1.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="px-4 py-16 text-center max-w-2xl mx-auto">
          <div className="mx-auto w-20 h-20 mb-6 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Read Through the Bible<br />on Your Own Schedule
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            A guided Bible reading plan app designed for your phone. Pick your timeline,
            get daily scripture readings, and track every chapter from Genesis to Revelation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl text-base transition-colors shadow-md"
            >
              Start Your Free Reading Plan
            </Link>
            <Link
              to="/login"
              className="inline-block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-8 py-3 rounded-xl text-base transition-colors"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">Free to use. No credit card required.</p>
        </section>

        {/* ── Features ── */}
        <section className="px-4 py-14 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
              Everything You Need to Read the Whole Bible
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.title} className="text-center px-4">
                  <div className="text-4xl mb-4" role="img" aria-label={f.title}>{f.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="px-4 py-14 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
              How It Works
            </h2>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reading Plan Options ── */}
        <section className="px-4 py-14 bg-white dark:bg-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Choose Your Reading Timeline
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
              Whether you want to take it slow or power through, there's a plan for you.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['6 Months', '12 Months', '18 Months', '24 Months'].map((duration) => (
                <div
                  key={duration}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl py-4 px-3 text-center border border-gray-200 dark:border-gray-600"
                >
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{duration}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">reading plan</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Or set a completely custom duration — from 1 month to 10 years.
            </p>
          </div>
        </section>

        {/* ── Bible Versions ── */}
        <section className="px-4 py-14 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Read in Your Preferred Translation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
              Choose from multiple free Bible translations at setup.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {versions.map((v) => (
                <span
                  key={v}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Checklist ── */}
        <section className="px-4 py-14 bg-white dark:bg-gray-800">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Built for Consistency
            </h2>
            <ul className="space-y-4">
              {[
                'Personalized reading schedule based on your start date',
                'Daily chapter assignments — always know what to read',
                'Mark readings complete and track your streak',
                'Read ahead on good days; catch up on busy ones',
                'Calendar view shows completed and missed days',
                'Works on any phone — no app download required',
                'Dark mode for evening reading',
                'Free to use, no subscription needed',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-4 py-16 text-center bg-primary-600">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Read the Whole Bible?
          </h2>
          <p className="text-primary-100 mb-8 max-w-md mx-auto">
            Create your free account and have your personalized reading plan set up in under two minutes.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-primary-700 hover:bg-primary-50 font-bold px-10 py-3 rounded-xl text-base transition-colors shadow-md"
          >
            Start Reading Today — It's Free
          </Link>
        </section>
      </main>

      {/* ── Footer ── */}
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
          {' · '}
          <Link to="/login" className="hover:text-primary-400 transition-colors">
            Sign In
          </Link>
        </p>
      </footer>
    </div>
  )
}
