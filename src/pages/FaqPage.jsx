import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoBadge } from '../components/ui/BrandLogo'

// Screenshots live in public/faq. They were captured at 2x on a 390px-wide
// phone from the real screens with sample data, so the sizes below are pixels.
function Screenshot({ src, alt, width, height }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className="mx-auto block h-auto w-full max-w-xs rounded-xl border border-gray-200 shadow-sm dark:border-gray-700"
    />
  )
}

// Written for older readers: plain words, every answer visible without tapping.
const QUESTIONS = [
  {
    question: 'Does this cost any money?',
    answer: (
      <p>
        No. Bible Reading Plan is completely free, and it will stay that way. There's no subscription, no in-app
        purchases, no ads, and you never need a credit card.
      </p>
    )
  },
  {
    question: "Why don't you have the NIV?",
    answer: (
      <>
        <p>
          The NIV (New International Version) is owned by a publisher, and its license doesn't allow it to be built
          into a free app like this one. All 11 translations in Bible Reading Plan are free for anyone to share, which
          is why we can include them.
        </p>
        <p>
          If you like the NIV, try the <strong>Berean Standard Bible (BSB)</strong> or the{' '}
          <strong>World English Bible (WEB)</strong>. Both are written in clear, modern English. You can switch
          translations anytime with Change plan.
        </p>
      </>
    )
  },
  {
    question: "What's the longest time I can choose for my plan?",
    answer: (
      <>
        <p>
          <strong>Up to 10 years (120 months).</strong>
        </p>
        <p>
          When you set up your plan, pick 6, 12, 18, or 24 months, choose to finish by the end of the year, or tap{' '}
          <strong>Custom duration</strong> and enter any number of months from 1 to 120. The longer your plan, the
          shorter each day's reading. A 10-year plan is about 9 verses a day.
        </p>
        <Screenshot
          src="/faq/plan-length.webp"
          alt="The Reading timeline step with Custom duration chosen and 120 months entered, showing about 9 verses per day"
          width={756}
          height={1528}
        />
        <p>Need more time later? Change plan lets you add up to 3 more years at a time.</p>
      </>
    )
  },
  {
    question: 'Can I change my plan after I make one?',
    answer: (
      <>
        <p>
          Yes, anytime. On the main screen, tap the <strong>gear button</strong> at the top, then tap{' '}
          <strong>Change plan</strong>.
        </p>
        <Screenshot
          src="/faq/change-plan-menu.webp"
          alt="The gear button at the top right is circled, and the menu under it has Change plan circled"
          width={780}
          height={666}
        />
        <p>
          You can switch your Bible translation, give yourself more or less time, include or skip weekends, or read
          just the Old or New Testament. Before you save, you'll see your new daily reading and finish date.
        </p>
        <Screenshot
          src="/faq/change-plan.webp"
          alt="The Change your plan screen with a new timeframe chosen and a preview of the new schedule and finish date"
          width={780}
          height={1718}
        />
        <p>The readings you've already finished, your streak, and your calendar are all kept.</p>
      </>
    )
  },
  {
    question: 'How do I start over?',
    answer: (
      <>
        <p>
          If you only want a different pace, translation, or timeline, use <strong>Change plan</strong> instead. It
          keeps everything you've already read.
        </p>
        <p>
          To begin a brand-new plan from the very beginning, tap the <strong>gear button</strong> at the top of the
          main screen, then tap <strong>Start Fresh</strong>.
        </p>
        <Screenshot
          src="/faq/start-over-menu.webp"
          alt="The gear button at the top right is circled, and the menu under it has Start Fresh circled"
          width={780}
          height={666}
        />
        <p>
          You'll be asked to confirm. Start Fresh deletes your current plan and all your progress, including your
          streak and calendar, and it can't be undone. Then you'll set up a new plan.
        </p>
        <Screenshot
          src="/faq/start-over-confirm.webp"
          alt="The Start Fresh confirmation, warning that it deletes your current plan and all progress, with Cancel and Start Fresh buttons"
          width={716}
          height={444}
        />
      </>
    )
  },
  {
    question: "How will I know if I'm ahead or behind?",
    answer: (
      <>
        <p>
          Look at the <strong>Your Progress</strong> box on the main screen. It tells you whether you're on track, or
          how many days ahead or behind you are.
        </p>
        <Screenshot
          src="/faq/progress.webp"
          alt="The Your Progress box showing 3 days ahead, Day 64 of 365"
          width={756}
          height={620}
        />
        <p>
          To see each day, tap the <strong>calendar button</strong> at the top of the main screen. Green days are days
          you read, and red days are days you missed.
        </p>
        <Screenshot
          src="/faq/calendar.webp"
          alt="The calendar with green circles on days that were read and a red circle on a missed day"
          width={756}
          height={922}
        />
      </>
    )
  },
  {
    question: 'I missed some days. How do I catch up?',
    answer: (
      <>
        <p>
          Don't worry, nothing gets skipped. Your next reading is always the one right after the last one you
          finished, and the <strong>Your Progress</strong> box shows how many days behind you are.
        </p>
        <Screenshot
          src="/faq/progress-behind.webp"
          alt="The Your Progress box showing 2 days behind, Day 59 of 365"
          width={756}
          height={620}
        />
        <p>
          To catch up, read more than one reading in a day. After you tap <strong>Mark as Read</strong>, the next
          reading appears right away, so you can keep going.
        </p>
        <p>
          If you'd rather not double up, use <strong>Change plan</strong> to give yourself more time. It spreads the
          rest of your readings out starting today and puts you back on track.
        </p>
      </>
    )
  },
  {
    question: 'What are the fun facts?',
    answer: (
      <>
        <p>
          Fun facts are short, true stories about how the passage you're reading shows up in the wider world: songs,
          movies, art, history, sports, space, and everyday sayings. Each one tells you where the information came
          from. They're just for fun and don't explain or interpret the Bible.
        </p>
        <p>
          When a chapter or verse has a fun fact, you'll see a small <strong>sparkle button</strong> next to it. Tap
          it to read the fact.
        </p>
        <Screenshot
          src="/faq/fun-facts-marker.webp"
          alt="Today's reading with a small sparkle button circled next to the 1 Samuel 17 heading"
          width={756}
          height={760}
        />
        <Screenshot
          src="/faq/fun-facts-sheet.webp"
          alt="A fun fact titled David and Goliath, with its source and a Back to reading button"
          width={780}
          height={640}
        />
        <p>
          Fun facts never pop up on their own, so they won't interrupt your reading. To turn them on or off, tap the{' '}
          <strong>gear button</strong> at the top of the main screen, then tap the <strong>Fun facts</strong> switch.
        </p>
        <Screenshot
          src="/faq/fun-facts-toggle.webp"
          alt="The gear button and the Fun facts switch in the menu are circled"
          width={780}
          height={666}
        />
      </>
    )
  },
  {
    question: 'Can I use it on my phone and my tablet or computer?',
    answer: (
      <>
        <p>
          Yes. Sign in with the same account on each one. Your plan and progress are saved to your account, so what
          you read on one shows up on the others.
        </p>
        <p>
          Sign in the same way you signed up: with your email and password, or with <strong>Continue with
          Google</strong>.
        </p>
        <p>
          If you added Bible Reading Plan to an iPhone or iPad home screen, sign in once inside that app too. It keeps
          its own sign-in, separate from Safari.
        </p>
      </>
    )
  },
  {
    question: 'I forgot my password. What do I do?',
    answer: (
      <>
        <p>
          On the sign-in screen, type your email address in the <strong>Email</strong> box, then tap{' '}
          <strong>Forgot your password?</strong> We'll email you a link to set a new password. If it doesn't arrive
          in a few minutes, check your junk or spam folder.
        </p>
        <Screenshot
          src="/faq/forgot-password.webp"
          alt="The sign-in box with an email address typed in and Forgot your password? circled"
          width={756}
          height={880}
        />
        <p>
          If you signed up with <strong>Continue with Google</strong>, you don't have a separate password for Bible
          Reading Plan. Just tap Continue with Google.
        </p>
      </>
    )
  }
]

export function FaqPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-lg">
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          &larr; Back
        </Link>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Frequently Asked Questions</h1>
        </header>

        <div className="mt-8 space-y-6">
          {QUESTIONS.map(({ question, answer }) => (
            <section key={question} className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{question}</h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">{answer}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
