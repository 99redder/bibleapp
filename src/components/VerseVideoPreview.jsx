import { Player } from '@remotion/player'
import { BibleVerseVideo } from '../remotion/BibleVerseVideo'

export function VerseVideoPreview({
  verse,
  reference,
  backgroundColor = '#1e3a5f',
  format = 'portrait' // 'portrait', 'landscape', 'square'
}) {
  const dimensions = {
    portrait: { width: 1080, height: 1920 },
    landscape: { width: 1920, height: 1080 },
    square: { width: 1080, height: 1080 },
  }

  const { width, height } = dimensions[format]

  return (
    <div className="w-full max-w-md mx-auto">
      <Player
        component={BibleVerseVideo}
        inputProps={{
          verse,
          reference,
          backgroundColor,
        }}
        durationInFrames={150}
        fps={30}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          width: '100%',
          aspectRatio: `${width} / ${height}`,
        }}
        controls
        autoPlay
        loop
      />
    </div>
  )
}
