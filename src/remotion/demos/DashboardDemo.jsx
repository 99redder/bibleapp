import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion'

// Mock phone frame
function PhoneFrame({ children }) {
  return (
    <div
      style={{
        width: 320,
        height: 640,
        backgroundColor: '#111827',
        borderRadius: 40,
        padding: 12,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 28,
          backgroundColor: '#111827',
          borderRadius: 20,
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#111827',
          borderRadius: 32,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Header
function Header() {
  return (
    <div
      style={{
        padding: '50px 20px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Good morning</div>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Day 15 of 365</div>
      </div>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🌙
      </div>
    </div>
  )
}

// Progress tracker
function ProgressTracker({ progress }) {
  return (
    <div
      style={{
        margin: '0 20px 20px',
        backgroundColor: '#1f2937',
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#9ca3af', fontSize: 14 }}>Progress</span>
        <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>On Track ✓</span>
      </div>
      <div
        style={{
          height: 8,
          backgroundColor: '#374151',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4f46e5',
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
        {Math.round(progress * 11.89)} of 1,189 chapters completed
      </div>
    </div>
  )
}

// Reading card
function ReadingCard({ showCompleted, progress }) {
  const checkScale = spring({
    frame: progress,
    fps: 30,
    config: { damping: 10, stiffness: 200 },
  })

  return (
    <div
      style={{
        margin: '0 20px',
        backgroundColor: '#1f2937',
        borderRadius: 16,
        padding: 20,
        border: showCompleted ? '2px solid #22c55e' : '2px solid transparent',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#4f46e5', fontSize: 12, fontWeight: 'bold' }}>TODAY'S READING</span>
        {showCompleted && (
          <span
            style={{
              color: '#22c55e',
              fontSize: 12,
              fontWeight: 'bold',
              transform: `scale(${checkScale})`,
            }}
          >
            ✓ COMPLETED
          </span>
        )}
      </div>
      <h3 style={{ color: 'white', fontSize: 18, fontWeight: 'bold', margin: '0 0 8px' }}>
        Genesis 15-17
      </h3>
      <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 16px' }}>3 chapters • ~15 min read</p>

      {/* Scripture preview */}
      <div
        style={{
          backgroundColor: '#111827',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            color: '#d1d5db',
            fontSize: 14,
            fontStyle: 'italic',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          "After these things the word of the LORD came unto Abram in a vision, saying, Fear not,
          Abram: I am thy shield, and thy exceeding great reward."
        </p>
        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8, marginBottom: 0 }}>
          — Genesis 15:1 (KJV)
        </p>
      </div>

      {/* Action button */}
      <div
        style={{
          backgroundColor: showCompleted ? '#22c55e' : '#4f46e5',
          color: 'white',
          padding: '12px 0',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        {showCompleted ? '✓ Completed' : 'Start Reading'}
      </div>
    </div>
  )
}

// Calendar mini view
function CalendarMini() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const completed = [true, true, true, true, true, false, false]
  const future = [false, false, false, false, false, true, true]

  return (
    <div
      style={{
        margin: '20px 20px 0',
        backgroundColor: '#1f2937',
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
        This Week
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((day, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: '#6b7280', fontSize: 10, marginBottom: 4 }}>{day}</div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: completed[i] ? '#22c55e' : future[i] ? '#374151' : '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
              }}
            >
              {completed[i] ? '✓' : i + 19}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardDemo() {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Animations
  const phoneScale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' })
  const phoneOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  // Show completion animation at frame 120
  const showCompleted = frame > 120
  const completionProgress = Math.max(0, frame - 120)

  // Progress bar animation
  const progressValue = interpolate(frame, [30, 60], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <h1 style={{ color: 'white', fontSize: 36, fontWeight: 'bold', margin: 0 }}>
          Your Daily Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, marginTop: 8 }}>
          Track progress and stay motivated
        </p>
      </div>

      {/* Phone */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `scale(${phoneScale})`,
          marginTop: 40,
        }}
      >
        <PhoneFrame>
          <Header />
          <ProgressTracker progress={progressValue} />
          <ReadingCard showCompleted={showCompleted} progress={completionProgress} />
          <Sequence from={60}>
            <div style={{ opacity: interpolate(frame - 60, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              <CalendarMini />
            </div>
          </Sequence>
        </PhoneFrame>
      </div>

      {/* Completion celebration */}
      {showCompleted && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            opacity: interpolate(completionProgress, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            🎉 Reading Complete!
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}
