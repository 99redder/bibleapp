# Bible Reading App - Project Context

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

## Live URL
https://chrisgorham999.github.io/BibleApp/

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
  /context
    AuthContext.jsx          - Firebase auth state management
    ThemeContext.jsx         - Dark mode state management
  /pages
    LoginPage.jsx            - Email/password login
    SignupPage.jsx           - Account creation
    OnboardingPage.jsx       - 5-step wizard for plan setup
    DashboardPage.jsx        - Main reading interface
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
- Password reset functionality
- Protected routes redirect to login
- Auth state persisted across sessions

### Onboarding Survey (5 Steps)
1. **Start Date** - When to begin the reading plan
2. **Duration** - 6, 12, 18, or 24 months
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
```
VITE_FIREBASE_API_KEY=AIzaSyCWCMaofFbla3ea7PsTsnlTBgAJaA6FPYw
VITE_FIREBASE_AUTH_DOMAIN=bibleapp-f097a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bibleapp-f097a
VITE_FIREBASE_STORAGE_BUCKET=bibleapp-f097a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=311938331759
VITE_FIREBASE_APP_ID=1:311938331759:web:58651c2fd7d9048a84499a
VITE_BIBLE_API_KEY=8gLNsKSdnTpTcHmC2bdoL
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
Automatic via GitHub Actions on push to main branch:
1. Builds with Vite using GitHub Secrets for env vars
2. Deploys to GitHub Pages

Manual deployment (not recommended):
```bash
npm run deploy     # Builds and deploys via gh-pages
```

## Known Issues / Future Enhancements
- Email daily portion feature (skipped for now, setting exists but not implemented)
- Some Bible versions may have limited chapter availability
- Consider adding streak tracking
- Consider adding notes/highlights feature
- Consider adding verse sharing

## Important Notes
- Uses HashRouter for GitHub Pages compatibility (URLs have #)
- Firebase functions use setDoc with merge:true to handle missing documents
- Dark mode preference stored in localStorage
- API.Bible has rate limits (5,000 requests/day on free tier)
