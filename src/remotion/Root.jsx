import { Composition } from 'remotion'
import { BibleVerseVideo } from './BibleVerseVideo'

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="BibleVerseVideo"
        component={BibleVerseVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          verse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          reference: "John 3:16 (KJV)",
          backgroundColor: '#1e3a5f',
        }}
      />
      <Composition
        id="BibleVerseVideoLandscape"
        component={BibleVerseVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          verse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          reference: "John 3:16 (KJV)",
          backgroundColor: '#1e3a5f',
        }}
      />
      <Composition
        id="BibleVerseVideoSquare"
        component={BibleVerseVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          verse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          reference: "John 3:16 (KJV)",
          backgroundColor: '#1e3a5f',
        }}
      />
    </>
  )
}
