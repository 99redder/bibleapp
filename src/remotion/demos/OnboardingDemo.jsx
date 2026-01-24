import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion'

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
      {/* Notch */}
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
      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1f2937',
          borderRadius: 32,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Progress bar
function ProgressBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '20px 16px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: i <= step ? '#4f46e5' : '#374151',
          }}
        />
      ))}
    </div>
  )
}

// Step content components
function StepContent({ title, children }) {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{title}</h2>
      {children}
    </div>
  )
}

function StartDateStep() {
  return (
    <StepContent title="When do you want to start?">
      <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20 }}>
        Choose when you'd like to begin your reading journey.
      </p>
      <div
        style={{
          backgroundColor: '#374151',
          borderRadius: 8,
          padding: 12,
          color: 'white',
          fontSize: 16,
        }}
      >
        📅 January 25, 2026
      </div>
    </StepContent>
  )
}

function DurationStep() {
  const options = [
    { label: '6 months', desc: '~6-7 chapters/day', selected: false },
    { label: '12 months', desc: '~3-4 chapters/day', selected: true },
    { label: '18 months', desc: '~2-3 chapters/day', selected: false },
  ]
  return (
    <StepContent title="Reading timeline">
      <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
        How long would you like to take?
      </p>
      {options.map((opt, i) => (
        <div
          key={i}
          style={{
            backgroundColor: opt.selected ? '#4f46e5' : '#374151',
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            border: opt.selected ? '2px solid #6366f1' : '2px solid transparent',
          }}
        >
          <div style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{opt.label}</div>
          <div style={{ color: opt.selected ? '#c7d2fe' : '#9ca3af', fontSize: 12 }}>{opt.desc}</div>
        </div>
      ))}
    </StepContent>
  )
}

function VersionStep() {
  return (
    <StepContent title="Bible version">
      <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
        Which translation would you prefer?
      </p>
      <div
        style={{
          backgroundColor: '#374151',
          borderRadius: 8,
          padding: 12,
          color: 'white',
          fontSize: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>King James Version (KJV)</span>
        <span style={{ color: '#9ca3af' }}>▼</span>
      </div>
    </StepContent>
  )
}

function ReviewStep() {
  return (
    <StepContent title="Review your plan">
      <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
        Here's a summary of your reading plan:
      </p>
      {[
        ['Start Date', 'January 25, 2026'],
        ['Duration', '12 months'],
        ['Version', 'KJV'],
        ['Reading Days', 'Every day'],
      ].map(([label, value], i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #374151',
          }}
        >
          <span style={{ color: '#9ca3af', fontSize: 14 }}>{label}</span>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{value}</span>
        </div>
      ))}
    </StepContent>
  )
}

export function OnboardingDemo() {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Determine which step to show based on frame
  const stepDuration = 60 // frames per step
  const currentStep = Math.min(Math.floor(frame / stepDuration), 3)

  // Phone animation
  const phoneScale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' })
  const phoneOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  // Step transition
  const stepProgress = (frame % stepDuration) / stepDuration
  const stepOpacity = interpolate(stepProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

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
          top: 80,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <h1 style={{ color: 'white', fontSize: 36, fontWeight: 'bold', margin: 0 }}>
          Easy Setup
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, marginTop: 8 }}>
          Create your personalized plan in minutes
        </p>
      </div>

      {/* Phone */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `scale(${phoneScale})`,
          marginTop: 60,
        }}
      >
        <PhoneFrame>
          <ProgressBar step={currentStep} total={5} />
          <div style={{ opacity: stepOpacity }}>
            {currentStep === 0 && <StartDateStep />}
            {currentStep === 1 && <DurationStep />}
            {currentStep === 2 && <VersionStep />}
            {currentStep === 3 && <ReviewStep />}
          </div>
          {/* Next button */}
          <div style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
            <div
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '14px 0',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {currentStep === 3 ? 'Start My Plan' : 'Next'}
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Step indicator text */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          color: '#64748b',
          fontSize: 16,
        }}
      >
        Step {currentStep + 1} of 5
      </div>
    </AbsoluteFill>
  )
}
