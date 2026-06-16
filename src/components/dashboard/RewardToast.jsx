import { useEffect, useRef, useState } from 'react'

const ICON_BG = {
  streak: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
  daysAhead: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300',
  percent: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
}

function ToastIcon({ icon }) {
  const common = {
    className: 'w-6 h-6',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }
  if (icon === 'flame') {
    return <svg {...common}><path d="M12 2c1 3-2 4-2 7a3 3 0 006 0c0-1-.5-2-1-2.5C16 9 17 11 17 14a5 5 0 11-10 0c0-4 3-6 5-12z" /></svg>
  }
  if (icon === 'rocket') {
    return (
      <svg {...common}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 014-9 11.5 11.5 0 018 8 22 22 0 01-9 4z" />
      </svg>
    )
  }
  // medal / default
  return (
    <svg {...common}>
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12v3l2 1" />
      <path d="M8.5 8.5L6 2M15.5 8.5L18 2" />
    </svg>
  )
}

function Toast({ reward, onDone }) {
  const [leaving, setLeaving] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    timers.current.push(setTimeout(() => setLeaving(true), 4000))
    timers.current.push(setTimeout(() => onDone(reward.id), 4350))
    return () => timers.current.forEach(clearTimeout)
  }, [reward.id, onDone])

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => onDone(reward.id), 350)
  }

  return (
    <div
      onClick={dismiss}
      role="status"
      className={`pointer-events-auto flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 px-4 py-3 ${
        leaving ? 'animate-[toastOut_0.35s_ease-in_forwards]' : 'animate-[toastIn_0.35s_ease-out]'
      }`}
    >
      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${ICON_BG[reward.type] || ICON_BG.percent}`}>
        <ToastIcon icon={reward.icon} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{reward.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{reward.message}</p>
      </div>
    </div>
  )
}

// Fixed stack of toasts, anchored below the sticky header on mobile.
export function RewardToastStack({ toasts, onDone }) {
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[55] flex flex-col items-center gap-2 px-4">
      <div className="w-full max-w-sm space-y-2">
        {toasts.map(reward => (
          <Toast key={reward.id} reward={reward} onDone={onDone} />
        ))}
      </div>
    </div>
  )
}
