// Shared brand mark: an open book with an amber bookmark ribbon.
// The book pages use `currentColor` (so it adapts to light/dark or a
// gradient badge); the ribbon and page lines are fixed accent colors.
export function BrandMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* left page */}
      <path
        d="M24 14.2C20.5 11.9 15.8 11 11.1 11.6c-1.15.15-2 1.13-2 2.3v19.8c0 1.4 1.22 2.47 2.6 2.29 4-.52 8.07.28 11.7 2.31V14.2z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      {/* right page */}
      <path
        d="M24 14.2C27.5 11.9 32.2 11 36.9 11.6c1.15.15 2 1.13 2 2.3v19.8c0 1.4-1.22 2.47-2.6 2.29-4-.52-8.07.28-11.7 2.31V14.2z"
        fill="currentColor"
      />
      {/* subtle text lines on the right page */}
      <path
        d="M28 19.6c2.3-.95 4.8-1.35 7.2-1.25M28 24.1c2.3-.95 4.8-1.35 7.2-1.25M28 28.6c1.7-.7 3.5-1.05 5.3-1.2"
        stroke="#0b4f80"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* bookmark ribbon */}
      <path d="M19.5 9h9v11.2L24 17.3l-4.5 2.9V9z" fill="#f59e0b" />
      <path d="M19.5 9h9v2h-9z" fill="#fbbf24" />
    </svg>
  )
}

// Logo inside a gradient badge with a soft glow — used on the auth screens.
export function LogoBadge({ className = '' }) {
  return (
    <div className={`relative mx-auto h-24 w-24 ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 opacity-50 blur-lg" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 via-primary-600 to-indigo-700 shadow-xl ring-1 ring-white/20">
        <BrandMark className="h-14 w-14 text-white" />
      </div>
    </div>
  )
}
