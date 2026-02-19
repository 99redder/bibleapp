# Bible Reading App - Project Context

## IMPORTANT: Workflow Reminders
1. **Deployment**: Always push updates via GitHub Desktop - do not use command line git push. After pushing, GitHub Actions automatically builds and deploys to GitHub Pages.
2. **Context**: Always update this claude.md file with updated context at the end of each session.

## Overview
A mobile-first React application that helps users read through the Bible on a customized schedule. Users sign up, complete an onboarding survey to customize their reading plan, and receive daily reading assignments with progress tracking.

## Tech Stack
- **Frontend**: React 18 + Vite 4.5.0
- **Styling**: Tailwind CSS with dark mode support (`darkMode: 'class'`)
- **Backend**: Firebase (Auth + Firestore)
- **Bible Data**: API.Bible (free tier) — proxied through Firebase Functions
- **State Management**: React Context (AuthContext, ThemeContext)
- **Routing**: React Router v6 (HashRouter for GitHub Pages)
- **Deployment**: GitHub Pages via GitHub Actions
- **PWA**: vite-plugin-pwa with auto-update service worker
- **Video Generation**: Remotion for creating Bible verse videos

## Live URLs
**Primary (Custom Domain)**: https://www.bibleplannerapp.com
**Fallback (GitHub Pages)**: https://99redder.github.io/bibleapp/

**Notes**:
- Custom domain: www.bibleplannerapp.com
- HTTPS active via Let's Encrypt (domain set up 2026-01-24)
- Repository was renamed from "BibleApp" to "bibleapp"

## Project Structure
```
/public
  CNAME                      - Custom domain: www.bibleplannerapp.com
  favicon.svg / .png         - Favicons
  apple-touch-icon.png       - iOS home screen icon
  pwa-192x192.png            - PWA icon
  pwa-512x512.png            - PWA icon (also maskable)
  robots.txt                 - Allow all crawlers, points to sitemap
  sitemap.xml                - XML sitemap for SEO

/src
  /components
    /auth
      ProtectedRoute.jsx     - Route guard; redirects unauthenticated to /login
    /dashboard
      Calendar.jsx           - Monthly calendar showing completed (green) / missed (red) days
      ProgressTracker.jsx    - Shows ahead/behind/on-track status relative to schedule
      ReadingCard.jsx        - Displays daily scripture passage with Mark Complete button
    /ui
      Button.jsx             - Primary/secondary button variants with loading state
      Input.jsx              - Form input with label and error message
      Select.jsx             - Dropdown select
      Toggle.jsx             - Switch toggle (used for include weekends setting)
      RadioGroup.jsx         - Radio button group rendered as cards
    VerseVideoPreview.jsx    - Remotion @remotion/player for in-app video preview
  /context
    AuthContext.jsx          - Firebase auth state; exposes user, userDoc, login, logout, etc.
    ThemeContext.jsx         - Dark mode state; reads/writes localStorage; applies 'dark' class to html
  /pages
    LandingPage.jsx          - Public marketing/landing page (route /) with SEO content
    LoginPage.jsx            - Email/password + Google OAuth login
    SignupPage.jsx           - Account creation (email/password + Google OAuth)
    OnboardingPage.jsx       - 5-step wizard to configure the reading plan
    DashboardPage.jsx        - Main reading interface (largest file ~19KB)
    PrivacyPolicyPage.jsx    - Privacy policy (linked in footer)
    TermsOfServicePage.jsx   - Terms of service (linked in footer)
  /remotion
    index.js                 - Remotion entry point
    Root.jsx                 - Registers video compositions
    BibleVerseVideo.jsx      - Animated verse video + app demo compositions
  /services
    firebase.js              - Firebase init, auth helpers, Firestore CRUD functions
    bibleAPI.js              - API.Bible proxy wrapper for fetching passages
    readingPlanGenerator.js  - Algorithm to divide Bible books/chapters into daily readings
  /utils
    bibleStructure.js        - All 66 Bible books with chapter counts and API.Bible version IDs
    dateHelpers.js           - Date formatting and calculation utilities
    browserDetection.js      - Detects in-app browsers (Facebook, Instagram) to hide Google OAuth
  App.jsx                    - Main app with HashRouter and all route definitions
  main.jsx                   - React entry point (renders App into #root)
  index.css                  - Tailwind directives + custom CSS classes
```

## Routing (App.jsx)
All routes use HashRouter (URLs contain `#`):
- `/` — LandingPage (unauthenticated) or redirect to dashboard (authenticated)
- `/login` — LoginPage (unauthenticated only)
- `/signup` — SignupPage (unauthenticated only)
- `/privacy` — PrivacyPolicyPage (public)
- `/terms` — TermsOfServicePage (public)
- `/onboarding` — OnboardingPage (auth required; skips to dashboard if already complete)
- `/dashboard` — DashboardPage (auth required)
- `*` wildcard — redirects to dashboard or onboarding based on auth/onboarding state

## Key Features

### Authentication
- Email/password signup and login via Firebase Auth
- **Google OAuth** login (popup-based, hidden in in-app browsers)
- In-app browser detection (Facebook, Instagram) — warns user to open in Safari/Chrome
- Password reset functionality via email
- Protected routes redirect to login; redirect back after login via `location.state.from`
- Auth state persisted across sessions

### Firebase Console Setup for OAuth
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your domain(s) to Authorized domains (e.g., `www.bibleplannerapp.com`)

### Onboarding Survey (5 Steps)
1. **Start Date** - When to begin the reading plan (validates: no past dates, today OK)
2. **Duration** - 6, 12, 18, 24 months, "Finish by end of year", or custom (1–120 months)
3. **Bible Version** - 11 free translations available
4. **Include Weekends** - Toggle for weekend readings
5. **Review & Confirm** - Summary before generating and saving plan to Firestore

### Dashboard
- Daily reading card with scripture text fetched from API.Bible via proxy
- Mark as Read button to advance progress
- Progress tracker showing ahead/behind/on-track status
- Calendar view showing completed (green) and missed (red) days
- **Read Ahead**: Navigate to view/complete future readings
- **Start Fresh**: Reset plan and go through onboarding again
- Dark mode toggle in header

### Dark Mode
- System preference detection on first load
- Manual toggle in header
- Preference saved to localStorage key `theme`
- Implemented by toggling `dark` class on `<html>` element
- Full dark mode support across all pages via Tailwind `dark:` variants

## Firebase Configuration

### Environment Variables (.env)
**Note**: Actual values are stored in `.env` file (not committed to git) and GitHub Secrets.

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_BIBLE_PROXY_BASE=https://bibleapp-f097a.web.app/api/bible
```

### GitHub Secrets (for deployment)
Same variables must be set in GitHub repo → Settings → Secrets and variables → Actions:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_BIBLE_API_KEY

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /readingPlan/{dayId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Firestore Data Structure

### users/{uid}
```javascript
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  createdAt: Timestamp,
  onboardingComplete: boolean,
  settings: {
    startDate: Timestamp,
    durationMonths: number,        // 6, 12, 18, 24, or custom
    bibleVersion: "KJV" | "ASV" | "WEB" | etc.,
    includeWeekends: boolean,
    emailDailyPortion: false       // not yet implemented
  },
  progress: {
    currentDay: number,
    completedDays: [number],       // array of day numbers
    lastReadDate: Timestamp
  }
}
```

### users/{uid}/readingPlan/{day-N}
```javascript
{
  dayNumber: number,
  scheduledDate: Timestamp,
  passages: [
    { book: "Genesis", abbrev: "GEN", chapter: 1 }
  ],
  completed: boolean,
  completedAt: Timestamp | null
}
```

## Bible Versions Available (API.Bible IDs)
- KJV: `de4e12af7f28f599-02`
- ASV: `06125adad2d5898a-01`
- WEB: `9879dbb7cfe39e4d-04`
- BBE: `65eec8e0b60e656b-01`
- DARBY: `478f0e49c63acf21-01`
- YLT: `f32e5dbdebc937a1-01`
- WBT: `7142879509583d59-04`
- FBV: `65eec8e0b60e656b-01`
- CPDV: `bba9f40f9c70cddc-01`
- RV: `40072c4a5aba4022-01`
- T4T: `b0f3a3d2dafb7e0b-01`

## Development Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Deployment
**Always use GitHub Desktop to push changes.**

Workflow:
1. Make code changes locally
2. Run `npm run build` to verify the build succeeds
3. Commit and push via GitHub Desktop
4. GitHub Actions workflow (`.github/workflows/`) automatically builds with secrets and deploys to GitHub Pages

The GitHub Actions workflow injects the environment variables from GitHub Secrets at build time.

## Known Issues / Future Enhancements
- Email daily portion feature (skipped for now, setting exists but not implemented)
- Some Bible versions may have limited chapter availability in API.Bible
- PWA icons (pwa-192x192.png, pwa-512x512.png) are placeholder icons — should be replaced with real branded icons
- Consider adding streak tracking
- Consider adding notes/highlights feature
- Consider adding verse sharing (social media)
- Consider adding push notifications for daily readings

## Important Notes
- **HashRouter**: URLs use `#` (e.g., `/#/dashboard`). Required for GitHub Pages static hosting since there's no server-side routing.
- **Custom domain**: Configured with CNAME file in `/public/CNAME` (value: `www.bibleplannerapp.com`)
- **Firebase setDoc with merge:true**: Used throughout to handle cases where the user document may not exist yet
- **Dark mode**: Stored in localStorage key `theme`; `dark` class applied to `<html>` element
- **API.Bible rate limits**: 5,000 requests/day on free tier; responses cached 24hrs in service worker
- **Date parsing**: Always use `new Date(dateString + 'T00:00:00')` to parse YYYY-MM-DD strings as local time. `new Date("YYYY-MM-DD")` parses as UTC, causing off-by-one timezone bugs.
- **In-app browser detection**: `browserDetection.js` detects Facebook/Instagram browsers; Google OAuth is hidden when in-app browser is detected
- **Bible proxy**: API.Bible requests go through Firebase Functions proxy at `VITE_BIBLE_PROXY_BASE` to keep API key server-side
- **Vite base path**: `base: '/'` — for custom domain root hosting (previously was `/bibleapp/` for GitHub Pages subdirectory)

## Vite Configuration (vite.config.js)
- `base: '/'` — root path for custom domain
- PWA manifest `start_url` and `scope` set to `/`
- Bible API cached for 24 hours (NetworkFirst)
- Firebase is NetworkOnly (no caching)
- Dev server port: 3000

## PWA Configuration
- Service worker auto-updates (registerType: 'autoUpdate')
- Bible API responses cached for 24 hours
- Firebase requests are network-only (auth and Firestore must be fresh)
- Manifest configured for standalone display, portrait orientation
- Icons: pwa-192x192.png and pwa-512x512.png (placeholder — replace with real icons)

## CSS Custom Classes (index.css)
- `.input` — Form inputs with dark mode support, box-sizing fixes for mobile
- `.card` — White/dark card containers with `overflow-visible` (needed for date picker dropdowns)
- `.btn`, `.btn-primary`, `.btn-secondary` — Button styles
- `.scripture-text` — Bible passage text; Georgia serif font, larger line-height

## Tailwind Theme
- **Primary color**: Sky blue (`primary-600: #0284c7`) — used for buttons, links, focus rings
- **Dark mode**: Class-based (`darkMode: 'class'`)
- **Font**: Extends with `serif` family (Georgia) for scripture text

## UI/Branding
- App name: "Bible Planner" / "Bible Reading Plan"
- Tagline: "Read through the Bible on your own schedule"
- Bible icon: SVG book with text lines, white on primary-600 background, rounded corners
- Login and Signup pages display the icon, app name, and tagline
- Footer credit: "Website created and maintained by Eastern Shore AI, LLC" (links to easternshore.ai)
- Footer links: Privacy Policy, Terms of Service
- Consistent branding across all pages

## SEO Configuration (added 2026-02-19)
- `index.html`: Comprehensive meta tags — title, description, keywords, canonical URL, Open Graph, Twitter Card, JSON-LD (WebApplication schema)
- `public/robots.txt`: Allows all crawlers; references sitemap
- `public/sitemap.xml`: Includes root URL; updated with current date
- `src/pages/LandingPage.jsx`: Public marketing page at route `/`; keyword-rich content targeting "bible reading plan", "read through the bible", "daily bible readings"
- **SEO target audience**: People searching for guided Bible reading plans, especially on mobile

## Remotion (Video Generation)
Remotion is installed for creating Bible verse videos programmatically.

### Remotion Files
- `src/remotion/index.js` — Entry point for Remotion
- `src/remotion/Root.jsx` — Registers video compositions
- `src/remotion/BibleVerseVideo.jsx` — Animated Bible verse video + 3 app demo compositions

### Remotion Commands
```bash
npm run remotion:studio            # Open Remotion Studio
npm run remotion:render            # Portrait (1080x1920)
npm run remotion:render:landscape  # Landscape (1920x1080)
npm run remotion:render:square     # Square (1080x1080)
npm run remotion:demo:all          # Render all 3 demo videos
```

### Video Compositions Available
- `BibleVerseVideo` — Portrait (1080x1920) — Instagram Stories, TikTok
- `BibleVerseVideoLandscape` — Landscape (1920x1080) — YouTube
- `BibleVerseVideoSquare` — Square (1080x1080) — Instagram posts
- `AppIntroDemo` (7s) — App introduction
- `OnboardingDemo` (9s) — Setup wizard walkthrough
- `DashboardDemo` (7s) — Daily reading experience

Demo videos output to `/out/` folder: demo-intro.mp4, demo-onboarding.mp4, demo-dashboard.mp4

### Note
Remotion requires Node.js 18+. Use `nvm use 20` before running Remotion commands.

## Session History

### 2026-01-24: Custom Domain Setup
- Registered custom domain: www.bibleplannerapp.com
- Changed Vite base path from `/bibleapp/` to `/`
- Updated PWA manifest start_url and scope to `/`
- Created `/public/CNAME` with domain for GitHub Pages
- HTTPS active via Let's Encrypt

### 2026-01-25: Auth Cleanup
- Removed Facebook OAuth (LoginPage, SignupPage, firebase.js)
- Only Google OAuth and email/password remain

### Earlier: Initial Features
- Added Bible icon and app description to LoginPage and SignupPage
- Fixed date input overflow on mobile (box-sizing, max-width fixes)
- Added custom duration and "finish by end of year" options to onboarding
- Added date validation to prevent past date selection
- Fixed timezone bug: dates parsed as UTC instead of local time
- Added Remotion for Bible verse video generation (3 demo videos)
- Fixed ESM module resolution (.jsx extensions in imports)

### 2026-02-19: SEO & AI Navigation Optimization
- Enhanced `index.html` with full SEO meta tags: title, description, keywords, canonical, Open Graph, Twitter Card, JSON-LD WebApplication schema
- Created `public/robots.txt` — allows all crawlers, references sitemap
- Created `public/sitemap.xml` — lists root URL for search engine indexing
- Created `src/pages/LandingPage.jsx` — public marketing/landing page targeting Bible reading plan keywords
- Updated `src/App.jsx` to route `/` to LandingPage (unauthenticated) instead of redirecting to /login
- Updated `README.md` with comprehensive AI-agent-friendly project guide
- Updated `CLAUDE.md` with complete project structure including all files
