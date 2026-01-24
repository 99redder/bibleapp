import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion'

// App logo component
function AppLogo({ scale = 1 }) {
  return (
    <div
      style={{
        width: 120 * scale,
        height: 120 * scale,
        backgroundColor: '#4f46e5',
        borderRadius: 24 * scale,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <svg
        width={72 * scale}
        height={72 * scale}
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h12v16H6V4zm2 2v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z" />
      </svg>
    </div>
  )
}

// Feature card component
function FeatureCard({ icon, title, description, delay }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const translateX = interpolate(frame - delay, [0, 15], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '20px 30px',
        borderRadius: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: '#4f46e5',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ color: 'white', fontSize: 22, fontWeight: 'bold', margin: 0 }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, margin: '4px 0 0 0' }}>{description}</p>
      </div>
    </div>
  )
}

export function AppIntroDemo() {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  })

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  // Title animation
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleY = interpolate(frame, [20, 40], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Tagline animation
  const taglineOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        opacity: fadeOut,
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
        }}
      />

      <Sequence from={0} durationInFrames={120}>
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 40,
          }}
        >
          <AppLogo scale={1.5} />
        </div>
      </Sequence>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 56,
            fontWeight: 'bold',
            margin: 0,
            letterSpacing: -1,
          }}
        >
          Bible Reading Plan
        </h1>
      </div>

      {/* Tagline */}
      <div style={{ opacity: taglineOpacity, textAlign: 'center', marginBottom: 60 }}>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 24,
            margin: 0,
          }}
        >
          Read through the Bible on your own schedule
        </p>
      </div>

      {/* Features */}
      <Sequence from={60}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          <FeatureCard
            icon="📅"
            title="Personalized Plans"
            description="Choose your timeline and schedule"
            delay={0}
          />
          <FeatureCard
            icon="📖"
            title="Daily Readings"
            description="Track progress with daily assignments"
            delay={15}
          />
          <FeatureCard
            icon="✨"
            title="Multiple Translations"
            description="11 Bible versions available"
            delay={30}
          />
        </div>
      </Sequence>

      {/* CTA */}
      <Sequence from={120}>
        <div
          style={{
            marginTop: 40,
            opacity: interpolate(frame - 120, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '16px 40px',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Start Your Journey Today
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  )
}
