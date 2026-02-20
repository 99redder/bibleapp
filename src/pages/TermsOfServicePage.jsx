import { Link } from 'react-router-dom'

export function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: January 25, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing or using Bible Planner App ("the Service"), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not
              use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Bible Planner App is a free web application that helps users create and follow
              personalized Bible reading plans. The Service allows you to set reading goals,
              track your progress, and read Bible passages from various translations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Accounts
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Acceptable Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bible Content
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bible text is provided through API.Bible and is subject to the copyright and
              licensing terms of each respective translation. The translations available are
              those permitted for free public use.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We do not claim ownership of the Bible text content. All Scripture quotations
              are used in accordance with the terms of their respective copyright holders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              The Service, including its original content, features, and functionality
              (excluding Bible text), is owned by Bible Planner App and is protected by
              copyright and other intellectual property laws. You may not copy, modify,
              distribute, or create derivative works without our permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Service Availability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We strive to maintain Service availability but do not guarantee uninterrupted
              access. The Service may be temporarily unavailable due to maintenance, updates,
              or circumstances beyond our control. We reserve the right to modify or
              discontinue the Service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE,
              UNINTERRUPTED, OR FREE OF HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS AT
              YOUR OWN RISK.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BIBLE PLANNER APP SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
              ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You may delete your account at any time. We reserve the right to suspend or
              terminate accounts that violate these Terms of Service or for any other reason
              at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update these Terms of Service from time to time. Continued use of the
              Service after changes constitutes acceptance of the new terms. We will update
              the "Last updated" date when changes are made.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of
              the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about these Terms of Service, please contact us at:{' '}
              <a
                href="mailto:contact@easternshore.ai"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                contact@easternshore.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
