import { initializeApp } from 'firebase/app'
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
  Timestamp
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
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

export const markDayComplete = async (uid, dayNumber, userProgress) => {
  const dayRef = doc(db, 'users', uid, 'readingPlan', `day-${dayNumber}`)
  await updateDoc(dayRef, {
    completed: true,
    completedAt: Timestamp.now()
  })

  const newCompletedDays = [...userProgress.completedDays, dayNumber]
  const newProgress = {
    currentDay: dayNumber + 1,
    completedDays: newCompletedDays,
    lastReadDate: Timestamp.now()
  }

  await updateUserProgress(uid, newProgress)
  return newProgress
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
