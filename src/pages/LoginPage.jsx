import { useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { LogoBadge } from '../components/ui/BrandLogo'
import { isInAppBrowser, getInAppBrowserName } from '../utils/browserDetection.js'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const inAppBrowser = useMemo(() => isInAppBrowser(), [])
  const browserName = useMemo(() => getInAppBrowserName(), [])

  const { login, loginWithGoogle, sendResetEmail, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email address first.')
      return
    }

    try {
      await sendResetEmail(email)
      setResetSent(true)
    } catch (err) {
      // Error is handled by AuthContext
    }
  }

  const handleGoogleSignIn = async () => {
    clearError()
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden px-4 py-12 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Decorative background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/20" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-500/10" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and App Info */}
        <div className="text-center mb-8">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bible Planner App</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Build your own plan to read through the Bible
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Your translation', 'Your timeline', 'Weekends optional'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="card shadow-xl ring-1 ring-black/5 dark:ring-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {resetSent && (
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Password reset email sent! Check your inbox.
                </p>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Forgot your password?
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or continue with</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* In-app browser warning */}
          {inAppBrowser && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                Google sign-in unavailable
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                You're viewing this in {browserName}. For Google sign-in, tap the menu (•••) and select "Open in Safari" or "Open in Browser".
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Or use email/password above to sign in.
              </p>
            </div>
          )}

          {/* Social login buttons - hidden in in-app browsers */}
          {!inAppBrowser && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Sign up
          </Link>
        </p>

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            Website created and maintained by{' '}
            <a
              href="https://www.easternshore.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              Eastern Shore AI, LLC
            </a>
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              Privacy Policy
            </Link>
            {' · '}
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
