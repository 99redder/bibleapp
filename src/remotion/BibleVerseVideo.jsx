import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export function BibleVerseVideo({ verse, reference, backgroundColor = '#1e3a5f' }) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Animation for verse text
  const verseOpacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0]
  )

  const verseY = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })

  // Animation for reference
  const referenceOpacity = interpolate(
    frame,
    [20, 50, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0]
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderTop: '3px solid rgba(255,255,255,0.3)',
          borderLeft: '3px solid rgba(255,255,255,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderBottom: '3px solid rgba(255,255,255,0.3)',
          borderRight: '3px solid rgba(255,255,255,0.3)',
        }}
      />

      {/* Verse text */}
      <div
        style={{
          opacity: verseOpacity,
          transform: `translateY(${interpolate(verseY, [0, 1], [20, 0])}px)`,
          textAlign: 'center',
          maxWidth: '80%',
        }}
      >
        <p
          style={{
            color: 'white',
            fontSize: 48,
            fontFamily: 'Georgia, serif',
            lineHeight: 1.5,
            fontStyle: 'italic',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          "{verse}"
        </p>
      </div>

      {/* Reference */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          opacity: referenceOpacity,
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 28,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            letterSpacing: 2,
          }}
        >
          {reference}
        </p>
      </div>
    </AbsoluteFill>
  )
}
