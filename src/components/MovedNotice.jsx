import { useState } from 'react'
import { isLegacyHost } from '../utils/browserDetection'

const DISMISSED_KEY = 'renameNoticeDismissed'

// Shown once on the old domain, which is mostly apps installed before the
// rename. Those apps keep working and updating (Cloudflare proxies the old
// domain), so this only explains the new name next to the old home-screen icon
// and reassures people that there is nothing to do.
export function MovedNotice() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      return false
    }
  })

  if (dismissed || !isLegacyHost()) return null

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-primary-700 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-base sm:flex-1">
          <span className="font-semibold">Bible Planner is now called Bible Reading Plan.</span>{' '}
          You don't need to do anything. Keep using the app just like before; your reading plan and progress are all
          here.
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="self-start rounded-lg bg-white px-6 py-2 text-base font-semibold text-primary-700 hover:bg-primary-50 sm:self-auto"
        >
          OK
        </button>
      </div>
    </div>
  )
}
