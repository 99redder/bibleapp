// Shared brand mark: an open book with a gold cross rising from its spine.
// The book pages use `currentColor` (so it adapts to light/dark or a
// gradient badge); the cross and page lines are fixed accent colors.
export function BrandMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* left page */}
      <path
        d="M24 17.2C20.5 14.9 15.8 14 11.1 14.6c-1.15.15-2 1.13-2 2.3v17.8c0 1.4 1.22 2.47 2.6 2.29 4-.52 8.07.28 11.7 2.31V17.2z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      {/* right page */}
      <path
        d="M24 17.2C27.5 14.9 32.2 14 36.9 14.6c1.15.15 2 1.13 2 2.3v17.8c0 1.4-1.22 2.47-2.6 2.29-4-.52-8.07.28-11.7 2.31V17.2z"
        fill="currentColor"
      />
      {/* subtle text lines on the right page */}
      <path
        d="M28 22.6c2.3-.95 4.8-1.35 7.2-1.25M28 27.1c2.3-.95 4.8-1.35 7.2-1.25M28 31.6c1.7-.7 3.5-1.05 5.3-1.2"
        stroke="#0b4f80"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* gold cross */}
      <rect x="21.9" y="2" width="4.2" height="17" rx="1" fill="#fbbf24" />
      <rect x="17.5" y="6.2" width="13" height="4.2" rx="1" fill="#fbbf24" />
    </svg>
  )
}

// Logo inside a gradient badge with a soft glow — used on the auth screens.
export function LogoBadge({ className = '' }) {
  return (
    <div className={`relative mx-auto h-24 w-24 ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 opacity-50 blur-lg" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 via-primary-600 to-indigo-700 shadow-xl ring-1 ring-white/20">
        <BrandMark className="h-16 w-16 text-white" />
      </div>
    </div>
  )
}

// Badge + "BIBLE PLANNER" wordmark, for page headers and footers. `onDark`
// keeps the text light on surfaces that are dark in both themes.
export function BrandLockup({ className = '', tagline = true, onDark = false }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-primary-600 to-indigo-700 shadow-md ring-1 ring-white/20 sm:h-10 sm:w-10">
        <BrandMark className="h-7 w-7 text-white sm:h-8 sm:w-8" />
      </span>
      <span className="leading-none">
        <span className={`block whitespace-nowrap font-display text-[15px] font-bold tracking-[0.04em] sm:text-lg sm:tracking-[0.06em] ${onDark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          Bible Planner
        </span>
        {tagline && (
          <span className={`mt-1 block whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.26em] ${onDark ? 'text-amber-400' : 'text-amber-600 dark:text-amber-400'}`}>
            Daily reading plan
          </span>
        )}
      </span>
    </span>
  )
}
