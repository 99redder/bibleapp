import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  runTransaction,
  Timestamp
} from 'firebase/firestore/lite'

import { computeStreakUpdate } from '../utils/streakHelpers'
import { emptyShownMilestones } from '../utils/rewards'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

// App Check (recommended): configure in Firebase Console and set VITE_FIREBASE_APPCHECK_SITE_KEY.
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY
export let appCheck = null
if (appCheckSiteKey) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  } catch (err) {
    console.warn('App Check init failed:', err)
  }
}

export const auth = getAuth(app)
export const db = getFirestore(app)

// Auth providers
const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const logIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const logOut = () => {
  return signOut(auth)
}

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email)
}

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

// User document functions
export const createUserDocument = async (uid, email) => {
  const userRef = doc(db, 'users', uid)
  const userData = {
    uid,
    email,
    createdAt: Timestamp.now(),
    onboardingComplete: false,
    settings: null,
    progress: {
      currentDay: 1,
      completedDays: [],
      lastReadDate: null
    }
  }
  await setDoc(userRef, userData)
  return userData
}

export const getUserDocument = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const updateUserSettings = async (uid, settings) => {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, {
    settings,
    onboardingComplete: true,
    progress: {
      currentDay: 1,
      completedDays: [],
      lastReadDate: null
    }
  }, { merge: true })
}

export const updateBibleVersion = async (uid, bibleVersion) => {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    'settings.bibleVersion': bibleVersion
  })
}

export const updateUserProgress = async (uid, progress) => {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, { progress }, { merge: true })
}

// Reading plan functions
export const saveReadingPlan = async (uid, readingPlan) => {
  const batch = writeBatch(db)

  readingPlan.forEach((day) => {
    const dayRef = doc(db, 'users', uid, 'readingPlan', `day-${day.dayNumber}`)
    batch.set(dayRef, day)
  })

  await batch.commit()
}

export const getReadingPlanDay = async (uid, dayNumber) => {
  const dayRef = doc(db, 'users', uid, 'readingPlan', `day-${dayNumber}`)
  const daySnap = await getDoc(dayRef)
  return daySnap.exists() ? daySnap.data() : null
}

export const markDayComplete = async (uid, dayNumber, userProgress, settings) => {
  const dayRef = doc(db, 'users', uid, 'readingPlan', `day-${dayNumber}`)
  const userRef = doc(db, 'users', uid)

  return runTransaction(db, async (transaction) => {
    // Read the authoritative progress inside the transaction so rapid/retried
    // taps cannot overwrite a completion recorded by another request.
    const [daySnap, userSnap] = await Promise.all([
      transaction.get(dayRef),
      transaction.get(userRef)
    ])

    if (!daySnap.exists()) {
      throw new Error(`Reading plan day ${dayNumber} does not exist`)
    }

    const storedProgress = userSnap.data()?.progress || userProgress || {}
    const completedDays = Array.isArray(storedProgress.completedDays)
      ? storedProgress.completedDays
      : []
    const newCompletedDays = completedDays.includes(dayNumber)
      ? [...completedDays]
      : [...completedDays, dayNumber]
    const currentDay = Number(storedProgress.currentDay || 1)
    const completedAt = Timestamp.now()

    // Update the reading streak based on the user's local day this reading is logged.
    const streak = computeStreakUpdate({
      lastStreakDate: storedProgress.lastStreakDate || null,
      currentStreak: storedProgress.currentStreak || 0,
      longestStreak: storedProgress.longestStreak || 0,
      today: new Date(),
      includeWeekends: settings?.includeWeekends
    })

    const newProgress = {
      currentDay: Math.max(currentDay, dayNumber + 1),
      completedDays: newCompletedDays,
      lastReadDate: completedAt,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastStreakDate: streak.lastStreakDate,
      // Preserve any milestones already celebrated (updated separately after detection).
      shownMilestones: storedProgress.shownMilestones || emptyShownMilestones()
    }

    transaction.update(dayRef, {
      completed: true,
      completedAt
    })
    transaction.set(userRef, { progress: newProgress }, { merge: true })

    return newProgress
  })
}

// Persist which milestones have been celebrated (deep-merged into progress).
export const updateShownMilestones = async (uid, shownMilestones) => {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, { progress: { shownMilestones } }, { merge: true })
}

export const getCompletedDays = async (uid) => {
  const planRef = collection(db, 'users', uid, 'readingPlan')
  const q = query(planRef, where('completed', '==', true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

// Reset user's reading plan (start fresh)
export const resetReadingPlan = async (uid) => {
  // Delete all reading plan documents
  const planRef = collection(db, 'users', uid, 'readingPlan')
  const snapshot = await getDocs(planRef)

  const batch = writeBatch(db)
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref)
  })

  // Reset user settings and progress
  const userRef = doc(db, 'users', uid)
  batch.update(userRef, {
    onboardingComplete: false,
    settings: null,
    progress: {
      currentDay: 1,
      completedDays: [],
      lastReadDate: null
    }
  })

  await batch.commit()
}

export { onAuthStateChanged, Timestamp }
