# Bible Planner App

A mobile-first React PWA that guides users through reading the entire Bible on a personalized schedule. Users create an account, set up a reading plan (6–24 months, Bible version, start date), and get daily chapter assignments with progress tracking.

**Live site**: https://www.bibleplannerapp.com
**Repo**: https://github.com/99redder/bibleapp
**Built by**: [Eastern Shore AI, LLC](https://www.easternshore.ai)

---

## Quick Start

```bash
npm install
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build → dist/
```

Requires a `.env` file with Firebase and Bible API keys (see `.env.example`).

**Deployment**: Push via GitHub Desktop → GitHub Actions builds and deploys to GitHub Pages automatically.
**Do not** use `git push` from the command line.

---

## Architecture

```
React 18 + Vite 4 + Tailwind CSS
├── Firebase Auth (email/password + Google OAuth)
├── Firestore (user data, reading plans, progress)
├── API.Bible (scripture text, proxied through Firebase Functions)
└── GitHub Pages (hosting via custom domain www.bibleplannerapp.com)
```

**Routing**: HashRouter (required for GitHub Pages static hosting — all URLs contain `#`).
**State**: React Context — `AuthContext` for auth/user data, `ThemeContext` for dark mode.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | All routes defined here |
| `src/pages/LandingPage.jsx` | Public marketing page (route `/`) |
| `src/pages/DashboardPage.jsx` | Main app screen for logged-in users |
| `src/pages/OnboardingPage.jsx` | 5-step plan setup wizard |
| `src/services/firebase.js` | Firebase init + all auth/Firestore helpers |
| `src/services/bibleAPI.js` | Fetches scripture passages from API.Bible proxy |
| `src/services/readingPlanGenerator.js` | Divides Bible into daily reading chunks |
| `src/utils/bibleStructure.js` | All 66 books with chapter counts + API.Bible version IDs |
| `src/utils/browserDetection.js` | Detects in-app browsers to hide Google OAuth |
| `src/context/AuthContext.jsx` | Provides `user`, `userDoc`, `login`, `logout`, etc. |
| `src/context/ThemeContext.jsx` | Provides `isDark`, `toggleTheme`; persists to localStorage |
| `index.html` | SEO meta tags, Open Graph, JSON-LD, favicon links |
| `public/robots.txt` | Allows all crawlers |
| `public/sitemap.xml` | XML sitemap pointing to root URL |
| `public/CNAME` | Custom domain for GitHub Pages |
| `vite.config.js` | Vite + PWA config; base path `/` |
| `CLAUDE.md` | Full project context for AI agents — read this first |

---

## Route Map

| Route | Component | Access |
|-------|-----------|--------|
| `/` | LandingPage | Public (unauthenticated) or → `/dashboard` |
| `/login` | LoginPage | Public or → `/dashboard` |
| `/signup` | SignupPage | Public or → `/dashboard` |
| `/privacy` | PrivacyPolicyPage | Public |
| `/terms` | TermsOfServicePage | Public |
| `/onboarding` | OnboardingPage | Auth required |
| `/dashboard` | DashboardPage | Auth required |

Authenticated users are always redirected away from public-only routes.

---

## Data Model (Firestore)

```
users/{uid}
  ├── email, uid, createdAt, onboardingComplete
  ├── settings: { startDate, durationMonths, bibleVersion, includeWeekends }
  └── progress: { currentDay, completedDays[], lastReadDate }

users/{uid}/readingPlan/{day-N}
  └── { dayNumber, scheduledDate, passages[], completed, completedAt }
```

---

## Environment Variables

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_BIBLE_PROXY_BASE        # Firebase Functions URL for Bible API proxy
```

Same variables must be set as **GitHub Secrets** for CI/CD deployment.

---

## Important Patterns & Gotchas

- **Date parsing**: Use `new Date(str + 'T00:00:00')` — never `new Date("YYYY-MM-DD")` which parses as UTC and causes timezone bugs.
- **HashRouter**: All React Router paths are hash-based (`/#/dashboard`). Do not switch to BrowserRouter without adding server-side redirect config.
- **Firebase writes**: Use `setDoc(..., { merge: true })` to safely write without overwriting the whole document.
- **API.Bible**: 5,000 req/day limit on free tier. Responses are cached 24hrs by the service worker.
- **Google OAuth**: Hidden when an in-app browser (Facebook, Instagram) is detected. Users are prompted to open in Safari/Chrome.
- **Dark mode**: Class-based (`dark` class on `<html>`). Toggle stored in `localStorage` key `theme`.
- **PWA icons**: Current icons are placeholders — replace `pwa-192x192.png` and `pwa-512x512.png` for production.

---

## For AI Agents

For full context including all implementation details, session history, Firestore rules, Bible version IDs, and CSS class documentation, read [`CLAUDE.md`](CLAUDE.md).

The `CLAUDE.md` file is the authoritative source of truth for this project and is kept up to date at the end of each development session.
