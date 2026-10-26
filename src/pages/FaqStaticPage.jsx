import { LogoBadge } from '../components/ui/BrandLogo'
import en from '../i18n/en'
import { FaqList, QUESTIONS } from './faqQuestions'

// The English FAQ as a plain page at /faq/, written into dist by scripts/prerenderFaq.mjs so
// search engines can index it (they treat the app's /#/faq as the home page). Same header and
// cards as FaqPage, with plain links instead of router links and a sign-up card at the end.
export function FaqStaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-lg">
        <a
          href="/"
          className="text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          &larr; Bible Reading Plan
        </a>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{en['faq.title']}</h1>
        </header>

        <FaqList questions={QUESTIONS} />

        <section className="card mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ready to start reading?</h2>
          <p className="mt-2 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Build a plan that fits your schedule. It takes about a minute.
          </p>
          <a href="/#/signup" className="btn-primary mt-4 inline-block font-semibold">
            Start Your Free Reading Plan
          </a>
        </section>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </a>
          {' · '}
          <a href="/#/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
            Privacy Policy
          </a>
          {' · '}
          <a href="/#/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}
