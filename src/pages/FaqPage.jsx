import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoBadge } from '../components/ui/BrandLogo'
import { useLanguage, useT } from '../i18n'
import { FaqList, QUESTIONS, QUESTIONS_ES } from './faqQuestions'

export function FaqPage() {
  const { user } = useAuth()
  const t = useT()
  const questions = useLanguage() === 'es' ? QUESTIONS_ES : QUESTIONS

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-lg">
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          &larr; {t('common.back')}
        </Link>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('faq.title')}</h1>
        </header>

        <FaqList questions={questions} />
      </div>
    </div>
  )
}
