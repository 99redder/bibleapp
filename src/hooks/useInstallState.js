import { useState, useSyncExternalStore } from 'react'
import { getInstallPlatform, isStandaloneApp } from '../utils/browserDetection'
import { canPromptInstall, subscribeInstallPrompt, wasInstalledThisSession } from '../services/installPrompt'

/**
 * Install status for the current device: which instructions apply, whether
 * it's already running as an installed app, and whether a one-tap install
 * prompt is available.
 */
export function useInstallState() {
  const [platform] = useState(getInstallPlatform)
  const [standalone] = useState(isStandaloneApp)
  const canPrompt = useSyncExternalStore(subscribeInstallPrompt, canPromptInstall, () => false)
  const installed = useSyncExternalStore(subscribeInstallPrompt, wasInstalledThisSession, () => false)

  return { platform, standalone, canPrompt, installed }
}
