import { Link } from 'react-router-dom'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            &larr; Back to Login
          </Link>
        </div>

        <div className="card prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: January 25, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bible Planner App ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our Bible reading plan application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Account Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Email address</li>
              <li>Account credentials (password is securely hashed)</li>
              <li>If using Google Sign-In: your Google account email and profile information</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Reading Plan Data
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information about your Bible reading preferences and progress:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Reading plan settings (start date, duration, Bible version)</li>
              <li>Reading progress and completion dates</li>
              <li>Preferences (weekend readings, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use your information solely to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide and maintain your personalized Bible reading plan</li>
              <li>Track your reading progress across devices</li>
              <li>Authenticate your account</li>
              <li>Send password reset emails when requested</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              We do not sell, rent, or share your personal information with third parties
              for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Storage and Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your data is stored securely using Google Firebase services, which employs
              industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Encryption in transit and at rest</li>
              <li>Secure authentication protocols</li>
              <li>Access controls and security rules</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Google Firebase</strong> - Authentication and data storage</li>
              <li><strong>API.Bible</strong> - Bible text content delivery</li>
              <li><strong>Google Sign-In</strong> - Optional authentication method</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              These services have their own privacy policies governing their use of data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Reset your reading plan at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cookies and Local Storage
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use local storage to save your dark mode preference. Firebase may use
              cookies for authentication purposes. We do not use tracking cookies or
              analytics that identify individual users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our service is not directed to children under 13. We do not knowingly collect
              personal information from children under 13. If you believe we have collected
              such information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify users of
              any material changes by updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a
                href="mailto:privacy@bibleplannerapp.com"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                chris.gorham451@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
