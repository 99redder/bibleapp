# Bible Reading App - Project Context

## IMPORTANT: Workflow Reminders
1. **Deployment**: Always push updates via GitHub Desktop - do not use command line git push. After pushing, GitHub Actions automatically builds and deploys to GitHub Pages.
2. **Context**: Always update this claude.md file with updated context at the end of each session.

## Overview
A mobile-first React application that helps users read through the Bible on a customized schedule. Users sign up, complete an onboarding survey to customize their reading plan, and receive daily reading assignments with progress tracking.

## Tech Stack
- **Frontend**: React 18 + Vite 4.5.0
- **Styling**: Tailwind CSS with dark mode support
- **Backend**: Firebase (Auth + Firestore)
- **Bible Data**: API.Bible (free tier)
- **State Management**: React Context
- **Routing**: React Router v6 (HashRouter for GitHub Pages)
- **Deployment**: GitHub Pages via GitHub Actions
- **PWA**: vite-plugin-pwa with auto-update service worker
- **Video Generation**: Remotion for creating Bible verse videos

## Live URLs
**Primary (Custom Domain)**: http://www.bibleplannerapp.com (HTTPS pending Let's Encrypt certificate)
**Fallback (GitHub Pages)**: https://99redder.github.io/bibleapp/

**Notes**:
- Custom domain registered: www.bibleplannerapp.com
- Repository was renamed from "BibleApp" to "bibleapp"
- HTTPS will be available 12-48 hours after DNS propagation

## Project Structure
```
/src
  /components
    /auth
      ProtectedRoute.jsx     - Route guard for authenticated users
    /dashboard
      Calendar.jsx           - Monthly calendar showing completed/missed days
      ProgressTracker.jsx    - Shows ahead/behind/on-track status
      ReadingCard.jsx        - Displays daily scripture with mark complete
    /ui
      Button.jsx             - Primary/secondary button variants
      Input.jsx              - Form input with label and error
      Select.jsx             - Dropdown select
      Toggle.jsx             - Switch toggle
      RadioGroup.jsx         - Radio button group with cards
    VerseVideoPreview.jsx    - Remotion player for in-app video preview
  /context
    AuthContext.jsx          - Firebase auth state management
    ThemeContext.jsx         - Dark mode state management
  /pages
    LoginPage.jsx            - Email/password login
    SignupPage.jsx           - Account creation
    OnboardingPage.jsx       - 5-step wizard for plan setup
    DashboardPage.jsx        - Main reading interface
  /remotion
    index.js                 - Remotion entry point
    Root.jsx                 - Composition registration
    BibleVerseVideo.jsx      - Animated verse video component
  /services
    firebase.js              - Firebase init, auth, and Firestore functions
    bibleAPI.js              - API.Bible wrapper for fetching passages
    readingPlanGenerator.js  - Algorithm to divide Bible into daily readings
  /utils
    bibleStructure.js        - Bible books/chapters data, version IDs
    dateHelpers.js           - Date formatting and calculation utilities
  App.jsx                    - Main app with routing
  main.jsx                   - React entry point
  index.css                  - Tailwind + custom styles
```

## Key Features

### Authentication
- Email/password signup and login via Firebase Auth
- **Google OAuth** login (requires enabling in Firebase Console)
- Password reset functionality
- Protected routes redirect to login
- Auth state persisted across sessions

### Firebase Console Setup for OAuth
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your domain(s) to Authorized domains (e.g., `www.bibleplannerapp.com`)

### Onboarding Survey (5 Steps)
1. **Start Date** - When to begin the reading plan (validates no past dates allowed)
2. **Duration** - 6, 12, 18, 24 months, "Finish by end of year", or custom (1-120 months)
3. **Bible Version** - 11 free translations available
4. **Include Weekends** - Toggle for weekend readings
5. **Review & Confirm** - Summary before generating plan

### Dashboard
- Daily reading card with scripture text from API.Bible
- Mark as Read button to advance progress
- Progress tracker showing ahead/behind/on-track status
- Calendar view showing completed (green) and missed (red) days
- **Read Ahead**: Navigate to view/complete future readings
- **Start Fresh**: Reset plan and go through onboarding again
- Dark mode toggle

### Dark Mode
- System preference detection
- Manual toggle in header
- Preference saved to localStorage
- Full dark mode support across all pages

## Firebase Configuration

### Environment Variables (.env)
**Note**: Actual values are stored in `.env` file (not committed to git) and GitHub Secrets. Replace placeholders below with your own API keys.

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_BIBLE_API_KEY=your_bible_api_key_here
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
    durationMonths: 6 | 12 | 18 | 24,
    bibleVersion: "KJV" | "ASV" | "WEB" | etc.,
    includeWeekends: boolean,
    emailDailyPortion: false
  },
  progress: {
    currentDay: number,
    completedDays: [number],
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
```

## Deployment
**Always use GitHub Desktop to push changes.**

Workflow:
1. Make code changes
2. Run `npm run build` to build locally
3. Commit and push via GitHub Desktop
4. GitHub Actions automatically deploys to GitHub Pages

The GitHub Actions workflow uses secrets for environment variables.

## Known Issues / Future Enhancements
- Email daily portion feature (skipped for now, setting exists but not implemented)
- Some Bible versions may have limited chapter availability
- Consider adding streak tracking
- Consider adding notes/highlights feature
- Consider adding verse sharing

## Important Notes
- Uses HashRouter for GitHub Pages compatibility (URLs have #)
- Custom domain configured with CNAME file in `/public/CNAME`
- Firebase functions use setDoc with merge:true to handle missing documents
- Dark mode preference stored in localStorage
- API.Bible has rate limits (5,000 requests/day on free tier)
- Date picker on iOS uses native spinner modal (works correctly)
- Date picker on Firefox desktop has limited styling control for greying out past dates
- Input fields have explicit `box-sizing: border-box` and `max-width: 100%` to prevent overflow on mobile
- **Date parsing**: Always use `new Date(dateString + 'T00:00:00')` to parse date strings as local time (without the 'Z' suffix). Using `new Date("YYYY-MM-DD")` parses as UTC which causes timezone issues.

## Vite Configuration (vite.config.js)
- `base: '/'` - Root path for custom domain (bibleplanapp.com)
- PWA manifest `start_url` and `scope` set to `/`
- **Note**: Previously was `/bibleapp/` for subdirectory hosting at 99redder.github.io/bibleapp/

## PWA Configuration
- Service worker auto-updates
- Bible API responses cached for 24 hours
- Firebase requests are network-only (not cached)
- Manifest configured for standalone display
- Icons: pwa-192x192.png and pwa-512x512.png (placeholder icons - should be replaced)

## CSS Custom Classes (index.css)
- `.input` - Form inputs with dark mode, box-sizing fixes for mobile
- `.card` - Card containers with `overflow-visible` for date pickers
- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.scripture-text` - Bible text styling with serif font

## UI/Branding
- Login and Signup pages have Bible icon logo (book with text lines SVG)
- App name: "Bible Reading Plan"
- Tagline: "Read through the Bible on your own schedule"
- Consistent branding across auth pages

## Remotion (Video Generation)
Remotion is installed for creating Bible verse videos programmatically.

### Remotion Files
- `src/remotion/index.js` - Entry point for Remotion
- `src/remotion/Root.jsx` - Registers video compositions
- `src/remotion/BibleVerseVideo.jsx` - Animated Bible verse video component
- `src/components/VerseVideoPreview.jsx` - In-app video preview using @remotion/player

### Remotion Commands
```bash
npm run remotion:studio           # Open Remotion Studio to preview/edit videos
npm run remotion:render           # Render portrait video (1080x1920)
npm run remotion:render:landscape # Render landscape video (1920x1080)
npm run remotion:render:square    # Render square video (1080x1080)
```

### Video Compositions Available
- `BibleVerseVideo` - Portrait (1080x1920) - for Instagram Stories, TikTok
- `BibleVerseVideoLandscape` - Landscape (1920x1080) - for YouTube
- `BibleVerseVideoSquare` - Square (1080x1080) - for Instagram posts

### Note
Remotion requires Node.js 18+. Use `nvm use 20` before running Remotion commands.

## Recent Session Updates
- Added Bible icon and app description to LoginPage and SignupPage
- Fixed date input overflow on mobile (box-sizing, max-width fixes)
- Added custom duration and "finish by end of year" options to onboarding
- Added date validation to prevent past date selection
- Added Remotion for Bible verse video generation
- Created 3 app demo videos using Remotion:
  - AppIntroDemo (7s) - App introduction with features
  - OnboardingDemo (9s) - Setup wizard walkthrough
  - DashboardDemo (7s) - Daily reading experience
- Fixed ESM module resolution by adding .jsx extensions to imports
- Demo videos output to `/out/` folder (demo-intro.mp4, demo-onboarding.mp4, demo-dashboard.mp4)
- Fixed date validation timezone bug - dates were being parsed as UTC instead of local time, preventing today's date from being selected in US timezones
- **Custom Domain Setup (2026-01-24)**:
  - Registered custom domain: bibleplanapp.com (later changed to www.bibleplannerapp.com)
  - Changed Vite base path from `/bibleapp/` to `/` in vite.config.js
  - Updated PWA manifest start_url and scope from `/bibleapp/` to `/`
  - Created `/public/CNAME` file with domain for GitHub Pages
  - Updated CNAME to www.bibleplannerapp.com
  - Site now works at http://www.bibleplannerapp.com
  - HTTPS pending Let's Encrypt certificate provisioning (12-48 hours)
- **Removed Facebook OAuth (2026-01-25)**:
  - Removed Facebook login option from LoginPage and SignupPage
  - Removed FacebookAuthProvider from firebase.js
  - Only Google OAuth and email/password authentication remain
