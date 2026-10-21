// Step-by-step install instructions for each device/browser combination.
// `hint` names a visual (see InstallPage) showing what the button looks like.

export const INSTALL_GUIDES = {
  'ios-safari': {
    label: 'iPhone or iPad — Safari',
    steps: [
      {
        title: 'Tap the Share button',
        detail: "It's the square with an arrow pointing up — at the bottom of Safari on iPhone, or at the top on iPad. If you only see •••, tap that first, then Share.",
        hint: { icon: 'share', label: 'Share' }
      },
      {
        title: 'Choose “Add to Home Screen”',
        detail: "Scroll down the list of options to find it. If it's not there, tap “View More” or “Edit Actions”.",
        hint: { icon: 'add', label: 'Add to Home Screen' }
      },
      {
        title: 'Tap “Add”',
        detail: 'Keep the name “Bible Planner”. If you see “Open as Web App”, leave it switched on.',
        hint: { icon: 'confirm', label: 'Add' }
      },
      {
        title: 'Open it from your Home Screen',
        detail: 'Tap the new Bible Planner icon. Sign in once — the app keeps its own sign-in, separate from Safari.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'ios-other': {
    label: 'iPhone or iPad — Chrome, Edge, or Firefox',
    steps: [
      {
        title: 'Tap the Share button',
        detail: 'In Chrome, it\'s in the address bar at the top. In Edge or Firefox, open the menu and choose Share.',
        hint: { icon: 'share', label: 'Share' }
      },
      {
        title: 'Choose “Add to Home Screen”',
        detail: "Scroll down to find it. If you don't see it, open www.bibleplannerapp.com in Safari and use the Safari steps instead.",
        hint: { icon: 'add', label: 'Add to Home Screen' }
      },
      {
        title: 'Tap “Add”',
        detail: 'Keep the name “Bible Planner”.',
        hint: { icon: 'confirm', label: 'Add' }
      },
      {
        title: 'Open it from your Home Screen',
        detail: 'Tap the new Bible Planner icon and sign in once — the app keeps its own sign-in.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'android-chrome': {
    label: 'Android — Chrome',
    oneTap: true,
    steps: [
      {
        title: 'Tap the menu',
        detail: "It's the three dots ⋮ in the top-right corner of Chrome.",
        hint: { icon: 'dots-vertical', label: 'Menu' }
      },
      {
        title: 'Tap “Install app” or “Add to Home screen”',
        detail: 'Chrome may use either name, depending on your phone.',
        hint: { icon: 'add', label: 'Install app' }
      },
      {
        title: 'Tap “Install”',
        detail: 'Confirm, and Chrome adds Bible Planner to your home screen.',
        hint: { icon: 'confirm', label: 'Install' }
      },
      {
        title: 'Open it from your home screen',
        detail: "Tap the Bible Planner icon. You'll also find it in your app drawer.",
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'android-samsung': {
    label: 'Android — Samsung Internet',
    oneTap: true,
    steps: [
      {
        title: 'Tap the menu',
        detail: "It's the three lines ≡ at the bottom right. (If you see an install icon in the address bar, you can tap that instead.)",
        hint: { icon: 'menu', label: 'Menu' }
      },
      {
        title: 'Tap “Add page to”, then “Home screen”',
        detail: 'On some versions this is called “Install” or “Add to Home screen”.',
        hint: { icon: 'add', label: 'Home screen' }
      },
      {
        title: 'Tap “Add”',
        detail: 'Bible Planner is added to your home screen.',
        hint: { icon: 'confirm', label: 'Add' }
      },
      {
        title: 'Open it from your home screen',
        detail: 'Tap the Bible Planner icon to start reading.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'android-firefox': {
    label: 'Android — Firefox',
    steps: [
      {
        title: 'Tap the menu',
        detail: "It's the three dots ⋮ — at the top right or bottom right, depending on your toolbar setting.",
        hint: { icon: 'dots-vertical', label: 'Menu' }
      },
      {
        title: 'Tap “Add to Home screen”',
        detail: 'It may be called “Add app to Home screen” or “Install”.',
        hint: { icon: 'add', label: 'Add to Home screen' }
      },
      {
        title: 'Tap “Add”',
        detail: 'Bible Planner is added to your home screen.',
        hint: { icon: 'confirm', label: 'Add' }
      },
      {
        title: 'Open it from your home screen',
        detail: 'Tap the Bible Planner icon to start reading.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'desktop-chromium': {
    label: 'Computer — Chrome or Edge',
    oneTap: true,
    steps: [
      {
        title: 'Click the install icon in the address bar',
        detail: 'At the right end of the address bar, look for a small screen with a down arrow.',
        hint: { icon: 'install', label: 'Install Bible Planner' }
      },
      {
        title: 'No icon? Use the browser menu',
        detail: 'Chrome: ⋮ → Cast, save, and share → Install page as app. Edge: ··· → Apps → Install this site as an app.',
        hint: { icon: 'dots-vertical', label: 'Menu' }
      },
      {
        title: 'Click “Install”',
        detail: 'Bible Planner opens in its own window.',
        hint: { icon: 'confirm', label: 'Install' }
      },
      {
        title: 'Open it like any other app',
        detail: 'Find Bible Planner in your Dock, taskbar, Start menu, or Applications folder.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'desktop-safari': {
    label: 'Mac — Safari',
    steps: [
      {
        title: 'Choose File → Add to Dock',
        detail: 'In the menu bar at the top of your screen. You can also click the Share button and choose “Add to Dock”. (Requires macOS Sonoma or later.)',
        hint: { icon: 'share', label: 'Add to Dock' }
      },
      {
        title: 'Click “Add”',
        detail: 'Keep the name “Bible Planner”.',
        hint: { icon: 'confirm', label: 'Add' }
      },
      {
        title: 'Open it from your Dock',
        detail: 'Bible Planner opens in its own window. Sign in once — the app keeps its own sign-in.',
        hint: { icon: 'app', label: 'Bible Planner' }
      }
    ]
  },

  'desktop-firefox': {
    label: 'Computer — Firefox',
    unsupported: true,
    steps: [
      {
        title: "Firefox on computers can't install apps",
        detail: 'Open www.bibleplannerapp.com in Chrome, Edge, or Safari to install it — or install it on your phone instead.',
        hint: { icon: 'browser', label: 'Open in another browser' },
        action: 'copy-link'
      }
    ]
  },

  'in-app': {
    label: 'Inside Facebook, Instagram, or another app',
    steps: [
      {
        title: 'Open this page in your browser',
        detail: 'Apps like Facebook and Instagram open links in their own viewer, which can\'t install apps. Tap the ••• or ⋮ menu (usually at the top right) and choose “Open in browser” or “Open in Safari”.',
        hint: { icon: 'dots-horizontal', label: 'Open in browser' }
      },
      {
        title: 'Or copy the link',
        detail: 'Then paste it into Safari (iPhone) or Chrome (Android).',
        hint: { icon: 'browser', label: 'www.bibleplannerapp.com' },
        action: 'copy-link'
      },
      {
        title: 'Then follow the steps for your browser',
        detail: 'Once the page is open in your browser, come back to this guide for the next steps.',
        hint: { icon: 'app', label: 'Bible Planner' },
        action: 'switch-to-browser'
      }
    ]
  }
}

const PLATFORM_TO_GUIDE = {
  'ios-safari': 'ios-safari',
  'ios-other': 'ios-other',
  'ios-inapp': 'in-app',
  'android-chrome': 'android-chrome',
  'android-samsung': 'android-samsung',
  'android-firefox': 'android-firefox',
  'android-other': 'android-chrome',
  'android-inapp': 'in-app',
  'desktop-chromium': 'desktop-chromium',
  'desktop-safari': 'desktop-safari',
  'desktop-firefox': 'desktop-firefox',
  'desktop-other': 'desktop-chromium'
}

export function guideForPlatform(platform) {
  return PLATFORM_TO_GUIDE[platform] || 'ios-safari'
}

/** The regular-browser guide an in-app browser user should continue with. */
export function browserGuideForPlatform(platform) {
  return platform.startsWith('android') ? 'android-chrome' : 'ios-safari'
}
