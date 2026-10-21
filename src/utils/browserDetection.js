/**
 * Detects if the user is viewing the app in an in-app browser
 * (Facebook Messenger, Instagram, Twitter, etc.)
 *
 * Google OAuth blocks sign-in from these browsers for security reasons.
 */
export function isInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera

  // Common in-app browser identifiers
  const inAppBrowsers = [
    'FBAN',           // Facebook App
    'FBAV',           // Facebook App Version
    'FB_IAB',         // Facebook In-App Browser
    'Instagram',      // Instagram
    'Twitter',        // Twitter
    'Line',           // Line
    'KAKAOTALK',      // KakaoTalk
    'Snapchat',       // Snapchat
    'LinkedInApp',    // LinkedIn
    'Pinterest',      // Pinterest
    'Slack',          // Slack
    'Discord',        // Discord
    'TikTok',         // TikTok
    'Musical.ly',     // TikTok (old name)
    'ByteLocale',     // TikTok
    'BytedanceWebview', // TikTok
    'GSA/',           // Google Search App
    'wv)',            // Android WebView
  ]

  // Also check for generic webview indicators
  const genericWebviewIndicators = [
    'WebView',
    'wv',
  ]

  // Check for in-app browsers
  for (const browser of inAppBrowsers) {
    if (ua.includes(browser)) {
      return true
    }
  }

  // Check for iOS in-app browser (standalone mode is fine, but embedded webviews are not)
  // This checks if it's iOS and NOT Safari and NOT Chrome
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isSafari = /Safari/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua)
  const isChrome = /CriOS/.test(ua)
  const isFirefox = /FxiOS/.test(ua)

  if (isIOS && !isSafari && !isChrome && !isFirefox) {
    // Could be an in-app browser on iOS
    // But let's be more specific - check for Facebook/Instagram indicators
    if (ua.includes('Mobile') && !ua.includes('Safari')) {
      return true
    }
  }

  return false
}

/**
 * True when running as an installed app (home screen / dock), not in a browser tab.
 */
export function isStandaloneApp() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}

/**
 * Which set of install instructions fits this device and browser.
 * @returns {'ios-safari'|'ios-other'|'ios-inapp'|'android-chrome'|'android-samsung'|'android-firefox'|'android-other'|'android-inapp'|'desktop-chromium'|'desktop-safari'|'desktop-firefox'|'desktop-other'}
 */
export function getInstallPlatform() {
  const ua = navigator.userAgent || ''
  // iPadOS reports itself as a Mac ("Macintosh"); touch support gives it away.
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  const isIOS = /iPhone|iPad|iPod/.test(ua) || isIPadOS

  if (isIOS) {
    if (isInAppBrowser()) return 'ios-inapp'
    if (/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)) return 'ios-other'
    return 'ios-safari'
  }

  if (/Android/.test(ua)) {
    if (isInAppBrowser()) return 'android-inapp'
    if (/SamsungBrowser/.test(ua)) return 'android-samsung'
    if (/Firefox/.test(ua)) return 'android-firefox'
    if (/Chrome/.test(ua)) return 'android-chrome'
    return 'android-other'
  }

  if (/Firefox/.test(ua)) return 'desktop-firefox'
  if (/Edg\/|Chrome|Chromium/.test(ua)) return 'desktop-chromium'
  if (/Safari/.test(ua)) return 'desktop-safari'
  return 'desktop-other'
}

/**
 * Gets a user-friendly name for the detected in-app browser
 */
export function getInAppBrowserName() {
  const ua = navigator.userAgent || navigator.vendor || window.opera

  if (ua.includes('FBAN') || ua.includes('FBAV') || ua.includes('FB_IAB') || ua.includes('Messenger')) {
    return 'Facebook/Messenger'
  }
  if (ua.includes('Instagram')) {
    return 'Instagram'
  }
  if (ua.includes('Twitter')) {
    return 'Twitter/X'
  }
  if (ua.includes('TikTok') || ua.includes('ByteLocale') || ua.includes('BytedanceWebview')) {
    return 'TikTok'
  }
  if (ua.includes('LinkedInApp')) {
    return 'LinkedIn'
  }
  if (ua.includes('Snapchat')) {
    return 'Snapchat'
  }
  if (ua.includes('Discord')) {
    return 'Discord'
  }
  if (ua.includes('Slack')) {
    return 'Slack'
  }

  return 'this app'
}
