import { useEffect, useRef, useState } from 'react'
import { SparkleIcon } from '../ui/SparkleIcon'
import { TRIVIA_CATEGORIES } from '../../utils/triviaCategories'
import { formatTriviaReference } from '../../services/trivia'

// Small inline button placed after a verse (or chapter heading) that has trivia.
// Visually tiny so it doesn't compete with the text, with a larger invisible tap area.
export function TriviaMarker({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title="Fun fact"
      className="relative ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 align-[-0.2em] text-amber-600 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25"
    >
      <SparkleIcon className="h-3 w-3" />
    </button>
  )
}

export function TriviaEntry({ entry }) {
  const category = TRIVIA_CATEGORIES[entry.category]

  return (
    <article className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {category && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <span aria-hidden="true">{category.icon}</span> {category.label}
          </span>
        )}
        <span>{formatTriviaReference(entry)}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{entry.text}</p>
      <a
        href={entry.source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs text-primary-600 hover:underline dark:text-primary-400"
      >
        Source: {entry.source.label} ↗
      </a>
    </article>
  )
}

// "Did you know?" panel. A bottom sheet on phones and a floating card on larger
// screens; it only ever opens when the reader taps a marker, and closing it
// returns them to exactly where they were reading.
export function TriviaSheet({ entries, onClose }) {
  const closeButtonRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:pb-8">
      <div
        className="absolute inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trivia-sheet-title"
        className="relative max-h-[75vh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-[sheetUp_0.25s_ease-out] dark:bg-gray-800 sm:max-w-md sm:rounded-2xl sm:pb-6"
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 sm:hidden" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="trivia-sheet-title"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400"
          >
            <SparkleIcon className="h-4 w-4" />
            Did you know?
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {entries.map(entry => <TriviaEntry key={entry.id} entry={entry} />)}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Back to reading
        </button>
      </div>
    </div>
  )
}

// Collapsed recap shown after the passage, for anyone who read straight through.
export function TriviaSummary({ entries }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
          <SparkleIcon className="h-4 w-4 shrink-0 text-amber-500" />
          <span>
            Did you know?{' '}
            <span className="font-normal text-amber-700/80 dark:text-amber-300/80">
              {entries.length} fun fact{entries.length === 1 ? '' : 's'} in this reading
            </span>
          </span>
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-amber-600 transition-transform dark:text-amber-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="space-y-5 border-t border-amber-200 px-4 py-4 dark:border-amber-500/20">
          {entries.map(entry => <TriviaEntry key={entry.id} entry={entry} />)}
        </div>
      )}
    </div>
  )
}
