import { createContext, useContext, useState, useEffect } from 'react'
import {
  auth,
  onAuthStateChanged,
  signUp,
  logIn,
  logOut,
  resetPassword,
  signInWithGoogle,
  signInWithFacebook,
  createUserDocument,
  getUserDocument
} from '../services/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const doc = await getUserDocument(firebaseUser.uid)
        setUserDoc(doc)
      } else {
        setUser(null)
        setUserDoc(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = async (email, password) => {
    try {
      setError(null)
      const { user: firebaseUser } = await signUp(email, password)
      const doc = await createUserDocument(firebaseUser.uid, email)
      setUserDoc(doc)
      return firebaseUser
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const { user: firebaseUser } = await logIn(email, password)
      const doc = await getUserDocument(firebaseUser.uid)
      setUserDoc(doc)
      return firebaseUser
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await logOut()
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const sendResetEmail = async (email) => {
    try {
      setError(null)
      await resetPassword(email)
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      const { user: firebaseUser } = await signInWithGoogle()
      // Check if user document exists, create if not
      let doc = await getUserDocument(firebaseUser.uid)
      if (!doc) {
        doc = await createUserDocument(firebaseUser.uid, firebaseUser.email)
      }
      setUserDoc(doc)
      return firebaseUser
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const loginWithFacebook = async () => {
    try {
      setError(null)
      const { user: firebaseUser } = await signInWithFacebook()
      // Check if user document exists, create if not
      let doc = await getUserDocument(firebaseUser.uid)
      if (!doc) {
        doc = await createUserDocument(firebaseUser.uid, firebaseUser.email)
      }
      setUserDoc(doc)
      return firebaseUser
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  const refreshUserDoc = async () => {
    if (user) {
      const doc = await getUserDocument(user.uid)
      setUserDoc(doc)
    }
  }

  const value = {
    user,
    userDoc,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    sendResetEmail,
    refreshUserDoc,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.'
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups for this site.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.'
    default:
      return 'An error occurred. Please try again.'
  }
}
