import { Link } from 'react-router-dom'
import { isLegacyHost } from '../utils/browserDetection'

const NEW_SITE_URL = 'https://biblereadingplan.app/'

// Shown only on the old domain (mostly apps installed from it, whose service
// worker keeps them there). Sign-in is per-domain, so users sign in once on the
// new site; their plan and progress live in their account and come along.
export function MovedNotice() {
  if (!isLegacyHost()) return null

  return (
    <div className="bg-primary-700 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm sm:flex-1">
          <span className="font-semibold">We've moved to biblereadingplan.app.</span>{' '}
          Your plan and progress come with you.
        </p>
        <div className="flex shrink-0 gap-2">
          <Link
            to="/install"
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
          >
            How to switch
          </Link>
          <a
            href={NEW_SITE_URL}
            target="_blank"
            rel="noopener"
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/60 hover:bg-primary-600"
          >
            Open new site
          </a>
        </div>
      </div>
    </div>
  )
}
