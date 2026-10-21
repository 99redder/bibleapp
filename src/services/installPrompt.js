// Chrome, Edge, and Samsung Internet fire `beforeinstallprompt` once, early in
// page load, when the app can be installed. Capture it before React mounts so
// the install guide and banner can offer a one-tap "Install" button.

let deferredPrompt = null
let installedThisSession = false
const listeners = new Set()

const notify = () => listeners.forEach(listener => listener())

export function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    installedThisSession = true
    notify()
  })
}

export function subscribeInstallPrompt(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const canPromptInstall = () => deferredPrompt !== null

export const wasInstalledThisSession = () => installedThisSession

/**
 * Show the browser's native install dialog.
 * @returns {Promise<'accepted'|'dismissed'|'unavailable'>}
 */
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable'
  const prompt = deferredPrompt
  // The event can only be used once.
  deferredPrompt = null
  notify()
  await prompt.prompt()
  const { outcome } = await prompt.userChoice
  return outcome
}
