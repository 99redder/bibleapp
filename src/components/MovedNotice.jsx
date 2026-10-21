import { isLegacyHost } from '../utils/browserDetection'

const NEW_SITE_URL = 'https://biblereadingplan.app/'

// Shown only on the old domain (mostly apps installed from it, whose service
// worker keeps them there). Sign-in is per-domain, so users sign in once on the
// new site; their plan and progress live in their account and come along.
export function MovedNotice() {
  if (!isLegacyHost()) return null

  return (
    <div className="bg-primary-700 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2">
        <p className="min-w-0 flex-1 text-sm">
          <span className="font-semibold">We've moved to biblereadingplan.app.</span>{' '}
          Open the new site, sign in, and add it to your home screen. Your plan and progress come with you.
        </p>
        <a
          href={NEW_SITE_URL}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Open new site
        </a>
      </div>
    </div>
  )
}
