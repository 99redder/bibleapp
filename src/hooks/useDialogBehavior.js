import { useEffect, useRef } from 'react'

/**
 * Shared modal behavior: close on Escape, lock background scroll (without
 * moving the reader's scroll position), focus the given element on open, and
 * restore focus to whatever was focused before when the dialog closes.
 */
export function useDialogBehavior(onClose, initialFocusRef) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    initialFocusRef?.current?.focus({ preventScroll: true })

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [])
}
