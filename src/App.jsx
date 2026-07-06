import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(module => ({ default: module.OnboardingPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
    </div>
  )
}

function UpdatePrompt() {
  const [updateSW, setUpdateSW] = useState(null)

  useEffect(() => {
    const handleUpdate = (event) => setUpdateSW(() => event.detail.updateSW)
    window.addEventListener('bible-planner-update-ready', handleUpdate)
    return () => window.removeEventListener('bible-planner-update-ready', handleUpdate)
  }, [])

  if (!updateSW) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-primary-200 bg-white p-4 shadow-lg dark:border-primary-800 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-white">A faster version is ready.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => updateSW(true)}
          className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setUpdateSW(null)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Later
        </button>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, userDoc, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {userDoc?.onboardingComplete ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <OnboardingPage />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 404 / fallback */}
        <Route
          path="*"
          element={
            user ? (
              userDoc?.onboardingComplete ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <NotFoundPage />
            )
          }
        />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
          <UpdatePrompt />
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
