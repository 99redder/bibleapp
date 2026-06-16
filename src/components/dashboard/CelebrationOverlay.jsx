import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

// Icons keyed by reward type. Kept inline (matching the rest of the app's SVG style).
function RewardIcon({ icon }) {
  const common = {
    className: 'w-16 h-16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  if (icon === 'flame') {
    return (
      <svg {...common}>
        <path d="M12 2c1 3-2 4-2 7a3 3 0 006 0c0-1-.5-2-1-2.5C16 9 17 11 17 14a5 5 0 11-10 0c0-4 3-6 5-12z" />
      </svg>
    )
  }
  if (icon === 'rocket') {
    return (
      <svg {...common}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 014-9 11.5 11.5 0 018 8 22 22 0 01-9 4z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    )
  }
  if (icon === 'trophy') {
    return (
      <svg {...common}>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M7 6H4v1a4 4 0 004 4M17 6h3v1a4 4 0 01-4 4" />
      </svg>
    )
  }
  // medal (default for percentage milestones)
  return (
    <svg {...common}>
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12v3l2 1" />
      <path d="M8.5 8.5L6 2M15.5 8.5L18 2M9 3h6" />
    </svg>
  )
}

// Theme color per reward type (used for the icon halo + button accent).
const THEME = {
  streak: { ring: 'from-orange-400 to-red-500', text: 'text-orange-500', btn: 'bg-orange-500 hover:bg-orange-600' },
  daysAhead: { ring: 'from-sky-400 to-indigo-500', text: 'text-sky-500', btn: 'bg-sky-500 hover:bg-sky-600' },
  percent: { ring: 'from-emerald-400 to-green-600', text: 'text-emerald-500', btn: 'bg-emerald-500 hover:bg-emerald-600' }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function CelebrationOverlay({ reward, onDismiss }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!reward || prefersReducedMotion()) return

    const canvas = canvasRef.current
    if (!canvas) return

    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true })
    const colors = reward.type === 'streak'
      ? ['#fb923c', '#ef4444', '#fbbf24']
      : reward.type === 'daysAhead'
        ? ['#38bdf8', '#6366f1', '#a78bfa']
        : ['#34d399', '#16a34a', '#fbbf24']

    // Two bursts from the lower corners — reads well on a tall phone screen.
    const fire = () => {
      myConfetti({ particleCount: 70, spread: 70, startVelocity: 45, origin: { x: 0.1, y: 1 }, angle: 60, colors })
      myConfetti({ particleCount: 70, spread: 70, startVelocity: 45, origin: { x: 0.9, y: 1 }, angle: 120, colors })
    }
    fire()
    const t = setTimeout(fire, 350)

    return () => {
      clearTimeout(t)
      myConfetti.reset()
    }
  }, [reward])

  if (!reward) return null

  const theme = THEME[reward.type] || THEME.percent

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={reward.title}
    >
      {/* Confetti canvas sits above the backdrop, behind the card */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-xs rounded-2xl bg-white dark:bg-gray-800 shadow-2xl px-6 py-8 text-center animate-[popIn_0.35s_cubic-bezier(0.18,0.89,0.32,1.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${theme.ring} text-white shadow-lg animate-[badgePop_0.5s_ease-out]`}
        >
          <RewardIcon icon={reward.icon} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{reward.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{reward.message}</p>

        <button
          onClick={onDismiss}
          className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold text-white transition-colors ${theme.btn}`}
        >
          Keep going
        </button>
      </div>
    </div>
  )
}
